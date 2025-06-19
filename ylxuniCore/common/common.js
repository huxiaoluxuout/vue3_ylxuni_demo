import {createProxyObject} from "@/.yalc/ylxuni/src/utils/createProxyObject";

export function onErrorProfileHandler() {
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

// 完善个人资料
export const profileProxy = createProxyObject({
    idNumber: null,
    phone: null,
    nickName: null,
    avatarUrl: null,
    actuallyName: null,
    haha: null,
})
