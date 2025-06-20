export const SYS_INFO = 'sysInfo';
export const TOKEN = 'token';

async function getUnifiedSystemInfo() {
    let systemInfo = {}

    // #ifdef MP-WEIXIN
    const [
        systemSetting,
        appAuthorizeSetting,
        deviceInfo,
        windowInfo,
        appBaseInfo
    ] = await Promise.all([
        uni.getSystemSetting(),
        uni.getAppAuthorizeSetting(),
        uni.getDeviceInfo(),
        uni.getWindowInfo(),
        uni.getAppBaseInfo()
    ])

    systemInfo = {
        ...systemSetting,
        ...appAuthorizeSetting,
        ...deviceInfo,
        ...windowInfo,
        ...appBaseInfo,
        platform: 'weixin'
    }
    // #endif

    // #ifndef MP-WEIXIN
    systemInfo = await uni.getSystemInfoSync()
    // #endif

    return systemInfo
}

// 使用示例
getUnifiedSystemInfo().then(systemInfo => {
    console.log('系统信息:', systemInfo)
    uni.setStorage({
        key: SYS_INFO,
        data: systemInfo
    })
})
