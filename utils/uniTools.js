// 微信登录 code
export const ylxLoginCode = () => {
    return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.login({
            provider: 'weixin',
            success: function (res) {
                resolve(res);
            },
            fail: function (fail) {
                reject(fail);
            },
        });
        // #endif

    });
};


/**
 * 调起App支付
 * @param {string} provider='wxpay' 支付方式
 * @param {Object} orderInfo 订单数据
 * @param {string} orderInfo.prepayid
 * @param {string} orderInfo.appid
 * @param {string} orderInfo.partnerid
 * @param {string} orderInfo.noncestr
 * @param {string} orderInfo.timestamp
 * @param {string} orderInfo.package
 * @param {string} orderInfo.sign
 * @returns {Promise<>}
 */
export const PayMoneyApp = function ({provider, orderInfo}) {
    return new Promise((resolve, reject) => {
        // #ifdef APP-PLUS
        uni.requestPayment({
            provider: provider || 'wxpay',
            orderInfo: orderInfo,
            success: function (PaymentSuccess) {
                resolve(PaymentSuccess);
            },
            fail: function (fail) {

                if (fail.errMsg === 'requestPayment:fail cancel') {
                    console.warn('支付取消')
                }
                console.err(fail)
                reject(fail);
            }
        });
        // #endif
    })
}

/**
 * 微信小程序付款
 * @param {Object} paymentInfo
 * @param {string} paymentInfo.nonceStr='1713315071653'
 * @param {string} paymentInfo.package='prepay_id=wx170851119223082968c7e3942811860000'
 * @param {string} paymentInfo.paySign='5E10EBAEE6177494577D9CF9E1513236'
 * @param {string} paymentInfo.signType='MD5'
 * @param {string} paymentInfo.timeStamp='1713315072'
 * @returns {Promise<>}
 */
export const PayMoneyMp = (paymentInfo) => {
    return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.requestPayment({
            timeStamp: paymentInfo.timeStamp,
            nonceStr: paymentInfo.nonceStr,
            package: paymentInfo.package,
            signType: paymentInfo.signType,
            paySign: paymentInfo.paySign,
            success(success) {
                resolve(success);
            },
            fail(fail) {
                if (fail.errMsg === 'requestPayment:fail cancel') {
                    console.warn('支付取消')
                }
                reject(fail)
            },
            complete(complete) {
                resolve(complete);
            },
        });
        // #endif
        // #ifdef WEB
        resolve('WEB');
        // #endif
    });
};


/**
 * 统一提示方便全局修改
 * @param title
 * @param duration
 * @param mask
 * @param icon
 * @constructor
 */
export const ylxToast = (title, duration = 2000, mask = false, icon = 'none') => {
    if (!Boolean(title)) {
        return;
    }
    uni.showToast({
        title,
        duration,
        mask,
        icon
    });
}


import pagesConfig from "@/pages.json";

const {
    tabBar: {
        list: tabBarPages = []
    } = {}
} = pagesConfig;
/**
 *
 * @param pagePath --目标页
 * @param {object} parseInfo
 * @param api
 * @param {function} [callback]
 * @param {Object} [config]-其它配置
 * @param {boolean} config.isOpenBack -- 开启返回到目标页
 * @param {boolean} config.toPage -- 分享页参数
 * @param {boolean} config.isSkip -- 当前页面是要跳转到的页面不跳转
 *
 */
const toTargetPage = (pagePath, parseInfo = {}, api, callback, config) => {
    if (!pagePath) return;

    const pattern = /\/?([^?]+)/;

    const targetRoute = pagePath.match(pattern)[1];
    const isTabBarPage = tabBarPages.map(item => ylxFilterPath(item.pagePath)).includes(ylxFilterPath(targetRoute));

    const Pages = getCurrentPages()
    const currentPage = Pages[Pages.length - 1].route

    if (isTabBarPage) {
        uni.switchTab({
            url: ylxFilterPath(targetRoute),
            success: function () {
                if (typeof callback === 'function') {
                    callback({targetPath:'/'+targetRoute})
                }
            },
            fail: function (fail) {
                console.error(fail)
            }
        })
    } else {

        let startStr = pagePath.indexOf('?') === -1 ? '?' : '&';
        let queryString = '';

        if (config.toPage) {
            if (Object.keys(parseInfo).length) {
                queryString = startStr + 'pageInfo=' + encodeURIComponent(JSON.stringify(parseInfo))
            }
        } else {
            if (Object.keys(parseInfo).length) {
                queryString = startStr + Object.keys(parseInfo).map((key) => `${key}=${parseInfo[key]}`).join('&');
            }
        }

        // 当前页面是要跳转到的页面不跳转
        if (config.isSkip) {
            if (currentPage === targetRoute) {
                if (typeof callback === 'function') {
                    callback({targetPath:'/'+targetRoute})
                }
                return;
            }
        }

        let pagesRoute = Pages.map(item => item.route)

        // 开启返回到目标页
        if (config.isOpenBack) {
            let index = pagesRoute.findIndex(item => item === targetRoute)
            let deltaNum = pagesRoute.length - 1 - index
            uni.navigateBack({
                delta: deltaNum,
                success: function () {
                    if (typeof callback === 'function') {
                        callback({targetPath:'/'+targetRoute})
                    }
                }
            })
            return;

        }
        // console.log('212121212112',api,ylxFilterPath(removeVueExtension(pagePath) + queryString));
        if(api==='navigateTo'){
            uni.navigateTo({
                url: ylxFilterPath(removeVueExtension(pagePath) + queryString),
                success: function (res) {
                    if (typeof callback === 'function') {
                        callback({targetPath:'/'+targetRoute})

                    }
                },
                fail: function (fail) {
                    console.error('fail', fail.errMsg);
                }
            })
        }else  if(api==='redirectTo'){
            uni.redirectTo({
                url: ylxFilterPath(removeVueExtension(pagePath) + queryString),
                success: function (res) {
                    if (typeof callback === 'function') {
                        callback({targetPath:'/'+targetRoute})

                    }
                },
                fail: function (fail) {
                    console.error('fail', fail.errMsg);
                }
            })
        }

    }
}

/**
 *
 * @param {object} options
 * @param {string} options.pageInfo
 * @returns {string}
 */
export function ylxTargetPageDecode(options) {
    if (!options?.pageInfo) {
        return ''
    }
    let {pagePath, pagePrams} = JSON.parse(decodeURIComponent(options.pageInfo))
    return pagePath + pagePrams
}


/**
 * 跳转到应用内的某个页面
 * @param {string} pagePath 目标页面路径
 * @param {Object} [parse]={id:18} 对象参数
 * @param {function} [callback]
 * @param {Object} [config]
 * @param {boolean} [config.isOpenBack]
 * @param {boolean} [config.toPage]
 * @param {boolean} [config.isSkip]
 *
 */
export const ylxNavigateTo = (pagePath, parse = {}, callback, config = {
    isOpenBack: false,
    toPage: false,
    isSkip: true
}) => toTargetPage(pagePath, parse, 'navigateTo', callback, config);
/**
 * 跳转到应用内的某个页面
 * @param {string} pagePath 目标页面路径
 * @param {Object} [parse]={id:18} 对象参数
 * @param {function} [callback]
 * @param {Object} [config]
 * @param {boolean} [config.isOpenBack]
 * @param {boolean} [config.toPage]
 * @param {boolean} [config.isSkip]
 *
 *
 */
export const ylxRedirectTo = (pagePath, parse = {}, callback, config = {
    isOpenBack: false,
    toPage: false,
    isSkip: true
}) => toTargetPage(pagePath, parse, 'redirectTo', callback, config);

/**
 * 跳转到应用内的 tabBar  页面
 * @param {string} pagePath 目标页面路径
 * @param {function} [callback]
 * @param {Object} [config]
 * @param {boolean} [config.isOpenBack]
 * @param {boolean} [config.toPage]
 * @param {boolean} [config.isSkip]
 */
export const ylxSwitchTab = (pagePath, callback, config = {isOpenBack: false, toPage: false, isSkip: true}) => toTargetPage(pagePath, {} = {}, 'switchTab', callback, config);


// 路径补全
export const ylxFilterPath = (path) => {
    return /^\//.test(path) ? path : '/' + path
};

function removeVueExtension(filePath) {
    if (filePath.lastIndexOf('scanCode.vue') !== -1) {
        console.warn('移除.vue')
        return filePath.replace(/\.vue$/, '');
    } else {
        return filePath
    }
}

/*========*/
// IOS 底部兼容
export const ylxIOSBottomHeight = () => {
    const {model} = uni.getDeviceInfo()
    const models = ['X', 'XR', 'XS', '11', '12', '13', '14', '15'];
    if (model.indexOf('iPhone') !== -1 && models.some(item => model.indexOf(item) !== -1)) {
        return 35
    } else {
        return 0
    }
};
export const ylxOpenWxDebug = (envType = '') => {
    uni.getSystemInfo({
        success(res) {
            // #ifdef MP
            const accountInfo = uni.getAccountInfoSync()
            const {miniProgram} = accountInfo
            if ((res?.brand && res.brand !== "devtools")) {
                if (process.env.NODE_ENV === 'development') {
                    // 打开调试
                    uni.setEnableDebug({
                        enableDebug: ['develop'].concat([envType]).includes(miniProgram.envVersion) // 区分  develop:开发版本 trial:体验版 release:正式版
                    })
                } else {
                    console.log('生产环境');

                }
            }
            // #endif

        }
    })
}
