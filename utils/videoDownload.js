import {convertTime} from "@/utils/tools";

export class VideoDownload {
    constructor() {
        this.currentTask = null;
        this.downloadedSize = 0;
        this.currentDownloadedSize = 0;
        this.totalSize = 0;
        this.remoteTotalSize = 0;
        this.remoteUrl = '';
        this.relativePath = '';
        this.isPaused = false;
        this.shouldResume = false; // 新增：标记是否需要恢复
        // 开始下载
        this.chunkSize = 1024 * 1024; // 1MB
    }

    // 初始化下载任务
    initDownload(remoteUrl, relativePath, downloadedSize = 0, totalSize = 0) {
        this.remoteUrl = remoteUrl;
        this.relativePath = relativePath;
        this.downloadedSize = downloadedSize;
        this.remoteTotalSize = totalSize;
        console.log('totalSize', totalSize)

    }



    startDownloadFn = function () {
        console.log('start downloadFn');
    }

    setStartDownloadFn(callback) {
        console.log('set downloadFn');
        this.startDownloadFn = callback
    }


    // 开始下载
    startDownload(callback) {

        // 如果已经有任务且正在下载中，不再创建新任务
        if (this.currentTask && (this.currentTask.state === 1 || this.currentTask.state === 3)) {
            console.log('下载任务已在进行中');
            this.setStartDownloadFn(() => {
                this.startDownload(callback)
            })
            return;
        }

        const downloadedTimestamp = Date.now();
        this.isPaused = false;
        this.shouldResume = false;

        this.currentTask = plus.downloader.createDownload(this.remoteUrl, {
            filename: this.relativePath,
            append: true,
            timeout: 30,
            retry: 3,
            priority: 1
        }, (data, status) => {

            console.log('completedCB-data', data)
            if (data.state === 4) {
                callback && callback()
                console.warn('下载耗时：', convertTime(Date.now() - downloadedTimestamp, 'milliseconds').toString())

            }


        });
        // 设置Range头 断点续传
        this.currentTask.setRequestHeader('Range', `bytes=${this.downloadedSize}-`);

        this.currentTask.addEventListener('statechanged', (task, status) => {
            this._handleStateChange(task, status);
        });
        console.log('this.currentTask.state', this.currentTask.state)

        this.currentTask.start();

        console.log(this.downloadedSize > 0 ? '继续下载' : '开始下载');
    }

    // 取消下载任务
    abortDownload() {
        if (!this.currentTask) {
            console.log('没有可取消的下载任务');
            return false;
        }
        this.currentTask.abort();

    }

    // 暂停下载
    pauseDownload() {
        if (!this.currentTask) {
            console.log('没有可暂停的下载任务');
            return false;
        }
        console.log('暂停下载-this.currentTask.state', this.currentTask.state)
        // 只有下载中的任务可以暂停
        if (this.currentTask.state === 3) {
            this.currentTask.pause();
            console.log('正在暂停下载...');
            return true;
        }
        // 已经暂停的任务
        else if (this.currentTask.state === 5) {
            console.warn('下载已经处于暂停状态');
            this.isPaused = true;
            return true;
        } else {
            console.log('当前任务状态无法暂停:', this.currentTask.state);
            return false;
        }
    }

    // 恢复下载
    resumeDownload() {
        if (!this.currentTask) {
            console.log('没有可恢复的下载任务');
            return false;
        }

        // 只有暂停的任务可以恢复
        if (this.currentTask.state === 5) {
            // 直接调用任务的resume方法（如果API支持）
            if (typeof this.currentTask.resume === 'function') {
                this.currentTask.resume();
                console.warn('恢复下载...');
                console.log('----------------');

                this.isPaused = false;
                return true;
            }
            // 如果不支持resume方法，则重新创建任务
            else {
                this.shouldResume = true;
                this.startDownload(); // 会从断点继续
                return true;
            }
        } else {
            console.log('当前任务状态无法恢复:', this.currentTask.state);
            return false;
        }
    }

    // 处理状态变化
    _handleStateChange(task, status) {
        // console.warn('状态变化:', task.state, '状态码:', status);
        switch (task.state) {
            case 1: // 开始请求
                console.log(`下载任务开始请求`);
                break;
            case 2: // 请求已接收
                console.log(`下载任务请求已经接收`);
                break;
            case 3: // 下载中
                this.totalSize = task.totalSize === 0 ? this.remoteTotalSize : task.totalSize;
                // console.log('this.totalSize', this.totalSize)
                const currentDownloadedSize = task.downloadedSize + this.downloadedSize;
                // console.log('currentDownloadedSize', currentDownloadedSize)

                console.log(`下载进度: ${((currentDownloadedSize / this.totalSize) * 100).toFixed(2)}%`);
                this.isPaused = false;
                this.shouldResume = false;
                break;
            case 4: // 完成
                if (status === 200 || status === 206) {
                    console.log('下载完成');
                    // 只有完全下载完成才重置size
                    if (status === 200) {
                        this.downloadedSize = 0;
                    }
                } else {
                    console.log('下载失败，状态码:', status);
                }
                this.isPaused = false;
                break;
            case 5: // 暂停
                console.log('下载任务已暂停');
                this.isPaused = true;
                // 更新已下载大小，为恢复做准备
                this.downloadedSize = task.downloadedSize;
                this.startDownloadFn()
                break;
            case -1: // 错误
                console.log('下载错误:', status);
                // 出错时尝试恢复
                if (this.shouldResume) {
                    setTimeout(() => this.resumeDownload(), 1000);
                }
                break;
        }
    }

    getCurrentTask() {
        return this.currentTask;
    }
}
