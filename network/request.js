import {BASE_URL} from "@/network/config";
import {dataTypeJudge} from "@/utils/tools";


// 请求函数
export const request = (options) => {
    let token = uni.getStorageSync('token') || ''
    console.log( BASE_URL + options.url)
    return new Promise((resolve, reject) => {

        uni.request({
            ...options,
            url: BASE_URL + options.url,
            header: {
                "token": token
            },
            success(response) {
                if (dataTypeJudge(response.data) === 'object' && response.data.code === 0) {
                    return resolve(response.data);
                } else if (dataTypeJudge(response.data) === 'object' && response.data.code !== 0) {
                    // uni.showToast({title: response.data.msg, icon: 'error', duration: 5000, mask: false})
                    return resolve(response.data);
                }
            },
            fail(err) {
                // uni.showToast({title: JSON.stringify(err), icon: 'none', duration: 5000})
                reject(err)
            },
            complete(completeRes) {

                if(completeRes.statusCode===500) {
                    console.warn('接口传参：',options)
                    console.warn('my-fail',completeRes)
                    /*uni.showModal({
                        title: '后端报错',
                        content: '联系后端开发人员解决',
                        success: function (res) {
                            if (res.confirm) {
                                console.log('用户点击确定');
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });*/

                    return  reject(completeRes)

                }
            }
        });

    })
};
