import {BASE_URL} from "@/network/config";

export function downloadFile(name, callback, errCallback) {
    console.log('downloadFile-name', name);
    uni.downloadFile({
        timeout: 5000,
        url: BASE_URL + '/' + name + '?temp=' + Date.now(),
        success: (res) => {
            if (res.statusCode === 200) {
                console.log('文件下载成功', res.tempFilePath);
                readFileAbsolutePath(res.tempFilePath, callback)
            }
        },
        fail: (err) => {
            console.error('文件下载失败', err);
            errCallback && errCallback(err)
        }
    });

}

const readFileAbsolutePath = function (tempFilePath, callback) {
    // 获取完整的绝对路径
    const fullPath = plus.io.convertLocalFileSystemURL(tempFilePath);

    plus.io.resolveLocalFileSystemURL(fullPath, function (entry) {
        entry.file(function (file) {
            var fileReader = new plus.io.FileReader();
            fileReader.readAsText(file, 'utf-8');
            fileReader.onloadend = function (evt) {
                callback({
                    state: 1,
                    message: "读取成功！",
                    data: evt.target.result,
                    fileName: tempFilePath,
                });
            };
            fileReader.onerror = function (e) {
                callback({
                    state: 0,
                    message: "读取失败: " + JSON.stringify(e)
                });
            };
        }, function (e) {
            callback({
                state: 0,
                message: "获取文件失败: " + JSON.stringify(e)
            });
        });
    }, function (e) {
        callback({
            state: 0,
            message: "解析路径失败: " + JSON.stringify(e)
        });
    });
}


// webview 选择文件
export function chooseHexFile(callback) {

    var styles = {};
    if (!plus.webview.defaultHardwareAccelerated() && parseInt(plus.os.version) >= 5) {
        styles.hardwareAccelerated = true;
    }
    const wv = plus.webview.create('/static/webview/choose.html', 'webviewfile', {

        top: '20px',
        height: '250px',
        background: '#fff',
        ...styles
    });

    let pages = getCurrentPages(); //getCurrentPages() 函数用于获取当前页面栈的实例
    let page = pages[pages.length - 1];
    // plus.navigator.setFullscreen(true); //设置应用是否全屏显示
    let currentWebview = page.$getAppWebview();
    // wv.show()
    currentWebview.append(wv);

    plus.globalEvent.addEventListener('plusMessage', (msg) => {
        wv.hide()
        // plus.webview.close('webviewfile')
        if (msg.data.args.data.name === 'postMessage') {
            const receivedData = msg.data.args.data.arg;

            // console.log('收到数据:', receivedData.content);
            // 方案B：5+ App 原生API（仅App端）
            plus.navigator.setStatusBarStyle('light'); // 或 'dark'
            plus.navigator.setStatusBarBackground('#000000');

            callback && callback(receivedData)
        }
    });

}
