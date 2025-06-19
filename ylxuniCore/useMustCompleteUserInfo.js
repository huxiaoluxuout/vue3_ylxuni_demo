import {createProxyObject} from "@/.yalc/ylxuni/src/utils/createProxyObject";
import {useInterceptorProxy} from "@/.yalc/ylxuni/src/utils/useInterceptorProxy";

// 完善个人资料
const targetProfile = {
    idNumber: null,
    phone: null,
    nickName: null,
    avatarUrl: null,
    actuallyName: null
}

export const profileProxy = createProxyObject(targetProfile)


function onErrorProfileHandler() {
    uni.showModal({
        title: '完善个人信息，获取完整功能',
        success: function (res) {
            if (res.confirm) {
                // ylxNavigateTo('pages/userInfo/userInfo')
            } else if (res.cancel) {
                console.log('用户点击取消');
            }
        }
    });
}

export default function ({onSuccess, onError = onErrorProfileHandler}) {
    const {createInterceptor: interceptor,proxyObject} = useInterceptorProxy({
        isCompleted: profileProxy.idNumber && profileProxy.phone && profileProxy.nickName && profileProxy.actuallyName
    })
    console.log('xxx-proxyObject',proxyObject)
    if (proxyObject?.isCompleted) {
        console.log('身份信息已完成')
    } else {
        console.error('去完成身份信息')
    }
    return interceptor({onSuccess, onError})
}

