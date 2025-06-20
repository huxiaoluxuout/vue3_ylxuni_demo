// 工具函数：确保目录存在
import {convertTime} from "@/utils/tools";


async function ensureDirExists(dirPath) {
    return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(dirPath,
            () => resolve(),
            () => {
                plus.io.requestFileSystem(plus.io.PRIVATE_DOC, (fs) => {
                    fs.root.getDirectory(dirPath.replace(/^_doc\//, ''),
                        {create: true},
                        () => resolve(),
                        (e) => reject(new Error(`无法创建目录: ${e.message}`))
                    );
                }, reject);
            }
        );
    });
}

// 获取文件名（处理查询参数和哈希）
export function getFileName(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.pathname.split('/').pop();
    } catch {
        return url.split('/').pop().split('?')[0].split('#')[0];
    }
}

// 获取视频缓存路径
export function getVideoCachePath(remoteUrl) {
    const fileName = getFileName(remoteUrl);
    return {
        relativePath: `_doc/videos/${fileName}`,
        playablePath: plus.io.convertLocalFileSystemURL(`_doc/videos/${fileName}`)
    };
}

// 工具函数：检查文件是否存在
export async function checkFileExists(filePath) {
    return new Promise((resolve) => {
        plus.io.resolveLocalFileSystemURL(filePath, () => resolve(true), () => resolve(false));
    });
}

/**
 * 获取缓存视频文件的大小（字节）
 * @param {string} filePath 文件路径
 * @returns {Promise<number>} 文件大小（字节），如果文件不存在则返回 -1
 */
function getCachedVideoSize(filePath) {
    return new Promise((resolve) => {
        plus.io.resolveLocalFileSystemURL(
            filePath,
            (entry) => {
                entry.file((file) => {
                    resolve(file.size);
                });
            },
            () => resolve(-1) // 文件不存在
        );
    });
}

// 添加辅助函数
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


/**
 * 获取远程文件信息并检查是否支持断点续传
 * @param {string} remoteUrl 远程文件URL
 * @returns {Promise<{size: number, supportRange: boolean}>} 文件大小和是否支持断点续传
 */
async function getRemoteFileInfo(remoteUrl) {
    if (!remoteUrl || typeof remoteUrl !== 'string') {
        throw new Error('无效的URL参数');
    }

    return new Promise((resolve, reject) => {
        try {
            const xhr = new plus.net.XMLHttpRequest();
            xhr.timeout = 10000;
            xhr.open('HEAD', remoteUrl);
            xhr.setRequestHeader('Cache-Control', 'no-cache');

            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const contentLength = parseInt(xhr.getResponseHeader('Content-Length'), 10);
                    const acceptRangesHeader = xhr.getResponseHeader('Accept-Ranges');
                    const contentRange = xhr.getResponseHeader('Content-Range');

                    // 如果服务器明确返回不支持范围请求
                    if (acceptRangesHeader === 'none') {
                        return resolve({
                            size: contentLength,
                            supportRange: false
                        });
                    }

                    // 检查内容长度是否有效
                    if (!isNaN(contentLength) && contentLength > 0) {
                        resolve({
                            size: contentLength,
                            // 支持范围请求的条件：
                            // 1. 明确返回bytes
                            // 2. 或者有Content-Range头
                            // 3. 或者Accept-Ranges未设置（根据HTTP规范，默认支持bytes）
                            supportRange: acceptRangesHeader === 'bytes' ||
                                !!contentRange ||
                                acceptRangesHeader === undefined
                        });
                    } else {
                        reject(new Error('无法获取有效的文件大小：Content-Length不存在或无效'));
                    }
                } else {
                    reject(new Error(`请求失败，状态码: ${xhr.status}`));
                }
            };

            xhr.onerror = function () {
                reject(new Error('网络请求失败'));
            };

            xhr.ontimeout = function () {
                reject(new Error('请求超时'));
            };

            xhr.send();
        } catch (error) {
            reject(new Error(`创建请求失败: ${error.message}`));
        }
    });
}

// 初始化下载任务
function initDownload(remoteUrl, relativePath, totalSize, downloadManager) {

    // 尝试获取之前下载的文件大小（实现断点续传）
    plus.io.resolveLocalFileSystemURL(relativePath, (entry) => {
        entry.file((file) => {
            downloadManager.initDownload(remoteUrl, relativePath, file.size, totalSize);
            console.log('发现已下载部分:', file.size, 'bytes');
        });
    }, () => {
        // 文件不存在，从头开始下载
        downloadManager.initDownload(remoteUrl, relativePath, 0, totalSize);
    });
}

export async function getVideoUrl({remoteUrl, videoKey, downloadManager}, callback) {

    const videoKeyStr = videoKey;
    const downVideoInfo = uni.getStorageSync(videoKey) || {};
    let {relativePath, playablePath} = downVideoInfo;
    let remoteFileInfo = downVideoInfo;
    let fileExists = false;

    // 情况1：存在本地缓存记录
    if (downVideoInfo?.key === videoKey) {
        console.log('111111');
        fileExists = await checkFileExists(relativePath);
        console.warn('距离上次下载完成已过去：', convertTime(Date.now() - downVideoInfo.timestamp, 'milliseconds').toString());
        remoteFileInfo = downVideoInfo
        console.log('remoteFileInfo', remoteFileInfo)
        console.log('总大小：', formatBytes(downVideoInfo.size))
    }
    // 情况2：无本地缓存记录
    else {
        console.log('000000');
        await ensureDirExists('_doc/videos');
        remoteFileInfo = await getRemoteFileInfo(remoteUrl);

        // 获取视频缓存路径
        const {relativePath: remoteRelativePath, playablePath: remotePlayablePath} = getVideoCachePath(remoteUrl);

        relativePath = remoteRelativePath;
        playablePath = remotePlayablePath;
        fileExists = await checkFileExists(relativePath);
    }

    try {
        const downloadedSize = fileExists ? await getCachedVideoSize(relativePath) : 0;

        if (fileExists) {
            // 情况1.1：缓存过期（超过10000天）
            /*   if (!downVideoInfo || Date.now() - downVideoInfo.timestamp >= 1000 * 60 * 60 * 24 * 10000) {
                   console.error('缓存过期，删除整文件重新下载', formatBytes(downloadedSize));
                   await deleteAndDownload();
                   return remoteUrl;
               }*/

            // 情况1.2：已完整缓存
            if (downloadedSize === remoteFileInfo.size) {
                console.warn('视频已完整缓存，直接使用', formatBytes(remoteFileInfo.size));
                return playablePath;
            }

            // 情况1.3：断点续传未完成
            console.warn('断点续传未完成，继续下载', formatBytes(downloadedSize));
            // await deleteAndDownload();

            initDownload(remoteUrl, relativePath, remoteFileInfo.size, downloadManager)

            setTimeout(() => {
                downloadManager.startDownload(() => {
                    callback(playablePath)
                })
            }, 300)


            return remoteUrl;
        }

        // 情况2.1：文件不存在，开始下载
        console.log('文件不存在，开始下载');
        // console.error({'远程URL': remoteUrl, '文件信息': remoteFileInfo, '相对路径': relativePath, '可播放路径': playablePath});

        initDownload(remoteUrl, relativePath, remoteFileInfo.size, downloadManager)

        uni.setStorage({
            key: videoKeyStr,
            data: {
                size: remoteFileInfo.size,
                key: videoKeyStr,
                timestamp: Date.now(),
                relativePath,
                playablePath

            },
            success() {
                downloadManager.startDownload(() => {
                    callback(playablePath)
                })
            }
        })

        return remoteUrl;

    } catch (error) {
        console.error('缓存视频失败:', error);
    }
}

// 添加删除文件函数
export async function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
            entry.remove(resolve, reject);
        }, reject);
    });
}
