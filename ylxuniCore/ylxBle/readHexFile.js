


export function plusIoReadHexFile(path) {

    plus.io.resolveLocalFileSystemURL(path, function (entry) {
        entry.file(function (file) {
            var reader = new plus.io.FileReader();
            reader.onloadend = function (e) {
                var content = e.target.result; // 文件内容
                console.log(content); // 处理HEX文件内容
            };
            reader.readAsText(file); // 读取文件内容为文本
        }, function (e) {
            console.error('获取文件失败：' + e.message);
        });
    }, function (e) {
        console.error('解析文件路径失败：' + e.message);
    });

}



// 调用函数选择文件
// selectHexFile();
