/**
 * 将参数转换为查询字符串
 * @param {object} params
 * @param {string} [prefix]
 * @returns {string}
 */
export const objToStr = (params, prefix = '?') => {
    if (Object.keys(params).length === 0) {
        return ''
    } else {
        const str = Object.keys(params).map(key => `${key}=${params[key]}`).join('&');
        return prefix + str;
    }


}

/**
 * 解析查询字符串
 * @param {string} queryString
 * @returns {object}}
 */
export const strToObj = (queryString) => {
    if (!queryString.startsWith('?')) return
    const params = {};
    queryString = queryString.slice(1);
    const keyValues = queryString.split('&');
    keyValues.forEach(keyValue => {
        const [key, value] = keyValue.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    return params;
};


/**
 * 提取指定属性并返回一个新对象
 * @param {Object} sourceAttributes - 源属性对象
 * @param {Array} additionalKeys - 需要额外提取的键数组
 * @returns {Object} - 包含提取属性的新对象
 */
export const extractAttributes = (sourceAttributes, additionalKeys = []) => {
    // 默认需要提取的属性数组
    const defaultKeys = ['flex', 'backgroundColor', 'filter', 'color'];

    // 初始化结果对象。
    const extractedAttributes = {};

    // 遍历默认键数组，提取属性值并添加到结果对象中。
    for (const key of defaultKeys) {
        const value = sourceAttributes[key];
        if (value !== null && value !== undefined) {
            extractedAttributes[key] = value;
        }
    }

    // 遍历额外键数组，提取属性值并添加到结果对象中。
    for (const key of additionalKeys) {
        const value = sourceAttributes[key];
        if (value !== null && value !== undefined) {
            extractedAttributes[key] = value;
        }
    }

    return extractedAttributes;
};

/**
 * 将样式对象转换为 CSS 字符串
 * @param {Object} styleObject - 样式对象
 * @returns {string} - CSS 字符串
 */
export const convertStyleObjectToString = (styleObject) => {
    const styleStringArray = [];
    for (const property in styleObject) {
        styleStringArray.push(`${property.replace(/([A-Z])/g, '-\$1').toLowerCase()}:${styleObject[property]}`);
    }
    return styleStringArray.join(';');
}

export function splitQueryUrl(pathUrl) {
    let url = /^\//.test(pathUrl) ? pathUrl : '/' + pathUrl;
    let [path, query] = url.split('?');
    return {
        path,
        query: query ? '?' + query : '',
        startStr: query ? '&' : '?',
    };
}


// 根据传入的索引批量删除
export function removeElementsByIndex(arr, indexes, callback) {
    indexes = Array.isArray(indexes) ? indexes : [indexes];
    // 根据传入的索引进行删除
    for (let i = indexes.length - 1; i >= 0; i--) {
        const index = indexes[i];
        if (index >= 0 && index < arr.length) {
            arr.splice(index, 1);
        }
    }
    typeof callback === 'function' && callback()

}

export function isEmptyData(value) {
    const dataType = Object.prototype.toString.call(value).replace(/\[object (\w+)]/, "$1").toLowerCase();
    if (value === undefined || value === null) {
        return true;
    } else if (dataType === 'string') {
        return value.trim().length === 0;
    } else if (dataType === 'array') {
        return value.length === 0;
    } else if (dataType === 'object') {
        return Object.keys(value).length === 0;
    } else if (dataType === 'number') {
        return value === 0;
    }
    return false;
}


// 判断数据类型
export function dataTypeJudge(val, type) {
    const dataType = Object.prototype.toString.call(val).replace(/\[object (\w+)\]/, "$1").toLowerCase();
    return type ? dataType === type : dataType;
}

// 将时间戳格式化为日期字符串
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}/${month}/${day}-${hours}:${minutes}`;
}

// 输出时间戳
export function dateTimestamp(date) {
// 将日期字符串转换为日期对象
    const dateObject = new Date(date);
// 获取时间戳（毫秒数）
    return dateObject.getTime();
}

export function computedRatio(strRatio) {
    let result = strRatio
    if (strRatio.indexOf(':') !== -1) {
        let ratio = strRatio.split(':').map(Number);
        result = (ratio[0] / ratio[1]).toFixed(3);
    }
    return result
}

export const promiseCallback = (promiseFn, ...args) => {
    return {
        onSuccess: (callback) => {
            promiseFn(...args).then(res => {
                callback(res);
            });
        },
        onError: (callback) => {
            promiseFn(...args).catch(err => {
                callback(err);
            });
        }
    };
}


export function parseSize(str) {
    let match = str.match(/(\d+)(rpx|px)/i);
    if (match) {
        return {
            num: parseFloat(match[1]),
            unit: match[2]
        };
    } else {
        return {
            num: parseFloat(str),
            unit: 'rpx'
        };
    }
}

export function removeTrailingZeros(value) {
    let stringValue = value.toString();
    return stringValue.replace(/(\.\d*?[1-9])0+$|\.0*$/, '\$1');
}

export function verificationID(IDStr) {
    const cP = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return cP.test(IDStr)
}

export function verificationPhone(phoneStr) {
    let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
    return reg.test(phoneStr)
}

/*
  if (!verificationPhone(phone.value)) {
    uni.showToast({
      icon: 'none',
      title: '输入正确的手机号'
    })
    return
  }
* */


export function simulateOperation() {
    return new Promise((resolve, reject) => {
        const delay = Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;

        const operationShouldFail = Math.random() < 0.3;// 假设有30%的概率失败
        setTimeout(() => {
            if (operationShouldFail) {
                reject('失败');
            } else {
                resolve('成功');
            }
        }, delay);
    });
}

export function replaceStr(str, startStr, newStartStr) {
    if (str.startsWith(startStr)) {
        return str.replace(startStr, newStartStr);
    }
    return str;
}

// 检查 URL 是否以 http://localhost 开头，并进行替换
export function replaceLocalhostUrl(url, newHost) {
    const baseUrl = newHost.split(':')[0] + ':' + newHost.split(':')[1];
    return replaceStr(url, 'http://localhost', baseUrl)
}

// 数组的循环播放
export class ArrayPlayer {
    constructor(options) {
        this.onIndex = options.onIndex; // 当前显示的索引
        this.list = options.list;       // 数组列表
        this.callback = options.callback; // 索引变化时的回调函数
        this.loop = true;               // 控制是否循环播放
    }

    async play() {
        this.loop = true;
        while (this.loop) {
            const item = this.list[this.onIndex]; // 获取当前信息

            await new Promise(resolve => setTimeout(resolve, item.delay * 1000)); // 异步延时

            let onIndex = (this.onIndex + 1) % this.list.length; // 更新索引实现循环
            this.onIndex = onIndex
            this.callback?.(onIndex); // 执行回调函数
        }

    }

    // 用于停止数组的循环播放
    stop() {
        this.loop = false;
    }
}

// 三角形判断
export function isValidTriangle(a, b, c) {
    // 检查任意两边之和是否大于第三边
    return (a + b > c) && (a + c > b) && (b + c > a);
}

// 算余弦值
export function getTriangleAngle(a, b, c, sideOppositeAngle) {
    // 使用余弦定理计算余弦值
    let cosineValue;
    if (sideOppositeAngle === 'a') {
        cosineValue = (b ** 2 + c ** 2 - a ** 2) / (2 * b * c);
    } else if (sideOppositeAngle === 'b') {
        cosineValue = (a ** 2 + c ** 2 - b ** 2) / (2 * a * c);
    } else if (sideOppositeAngle === 'c') {
        cosineValue = (a ** 2 + b ** 2 - c ** 2) / (2 * a * b);
    } else {
        throw new Error('Invalid sideOppositeAngle value. It should be "a", "b", or "c".');
    }

    // 使用反余弦函数计算角度（以弧度为单位）
    let angleRadians = Math.acos(cosineValue);

    // 将弧度转换为角度
    let angleDegrees = angleRadians * (180 / Math.PI);

    // 返回角度值（四舍五入到小数点后两位）
    return Math.round(angleDegrees * 1000) / 1000;
    // return angleRadians;
}

export function debounce(func, delay) {
    let timer; // 定时器
    return function (...args) {
        // 保持函数上下文
        const context = this;

        // 如果用户再次触发事件，清除之前的定时器
        clearTimeout(timer);

        // 设置新的定时器，延迟执行函数
        timer = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

export function ab2hex(buffer) {
    return Array.from(new Uint8Array(buffer), bit => ('00' + bit.toString(16)).slice(-2)).join('');
}

// throttle.js

/**
 * 节流函数 - 首次调用立即执行，结束后额外执行一次
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延迟的时间（毫秒）
 * @return {Function} 节流后的函数
 */
export function throttle(func, wait = 500) {
    let timer = null;
    let lastExec = 0;
    let lastArgs = null;

    return function (...args) {
        const now = Date.now();

        // 清除之前的定时器
        if (timer) {
            clearTimeout(timer);
        }

        // 如果是第一次调用或者距离上次执行超过了等待时间，立即执行
        if (now - lastExec > wait) {
            func.apply(this, args);
            lastExec = now;
        } else {
            // 否则，保存参数，等待下一次执行
            lastArgs = args;

            // 设置定时器，在等待时间结束后执行
            timer = setTimeout(() => {
                if (lastArgs) {
                    func.apply(this, lastArgs);
                    lastExec = Date.now();
                    lastArgs = null;
                }
            }, wait - (now - lastExec));
        }
    };
}

/**
 * 求两个数组的并集
 * @param arr1
 * @param arr2
 * @returns {Array}
 */
export function findSameElements(arr1, arr2) {
    let set2 = new Set(arr2);
    return arr1.filter(value => set2.has(value));
}

export function findMatchingIds(commonElements, partsArray) {
    let commonElementsSet = new Set(commonElements);

    return partsArray
        .filter(part => part.partsImg.some(img => commonElementsSet.has(img)))
        .map(part => Number(part.id));
}

/**
 *
 * @param arrSet
 * @param menuList
 * @param keyName
 * @returns {*}
 */
export function getSubmenu(arrSet, menuList, keyName) {
    return menuList.filter(item => {
        if (item[keyName]) {
            return item[keyName].some(img => arrSet.has(img))
        }
    });
}


function roundNumber(number, decimals) {
    // 输入验证
    if (typeof number !== 'number' || isNaN(number)) {
        throw new TypeError('number 必须是有效的数字');
    }
    if (typeof decimals !== 'number' || isNaN(decimals) || decimals < 0 || !Number.isInteger(decimals)) {
        throw new TypeError('decimals 必须是非负整数');
    }

    const factor = Math.pow(10, decimals);
    // 使用 Number.EPSILON 调整精度
    return Math.round((number + Number.EPSILON) * factor) / factor;
}

export function roundAndInteger(number, decimals) {
    // 输入验证
    if (typeof number !== 'number' || isNaN(number)) {
        throw new TypeError('number 必须是有效的数字');
    }
    if (typeof decimals !== 'number' || isNaN(decimals) || decimals < 0 || !Number.isInteger(decimals)) {
        throw new TypeError('decimals 必须是非负整数');
    }

    // 四舍五入到指定的小数位数
    const rounded = roundNumber(number * 100, decimals);

    // 四舍五入到整数
    return Math.round(rounded);
}


export function convertTime(value, inputUnit = 'seconds') {
    let totalMs = 0;

    switch(inputUnit) {
        case 'milliseconds':
            totalMs = value;
            break;
        case 'seconds':
            totalMs = value * 1000;
            break;
        case 'minutes':
            totalMs = value * 60 * 1000;
            break;
        default:
            throw new Error('不支持的输入单位');
    }

    const totalSeconds = Math.floor(totalMs / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;
    const ms = totalMs % 1000;

    return {
        days,
        hours,
        minutes,
        seconds,
        milliseconds: ms,
        toString() {
            const parts = [];
            if (days > 0) parts.push(`${days}天`);
            if (hours > 0) parts.push(`${hours}小时`);
            if (minutes > 0) parts.push(`${minutes}分`);
            if (seconds > 0) parts.push(`${seconds}秒`);
            if (ms > 0 || parts.length === 0) parts.push(`${ms}毫秒`);

            return parts.join(' ');
        }
    };
}



function isValidVersionFormat(version) {
    // 定义正则表达式，确保版本号的格式为 x.y.z，x、y、z 都是非负整数
    const versionRegex = /^\d+\.\d+\.\d+$/;

    // 使用正则表达式测试版本号是否符合格式
    return versionRegex.test(version);
}


/**
 * 比较两个版本号
 * @param {string} v1 新版本号1，如 "1.0.1"
 * @param {string} v2 旧版本号2，如 "1.0.0"
 * @returns {number} 返回比较结果
 */
export function compareVersions(v1, v2) {

    const versionRegex = /^\d+\.\d+\.\d+$/;

    // 如果版本号格式不正确，返回 -1
    if (!versionRegex.test(v1)) return -1;
    if (!versionRegex.test(v2)) return -1;

    // 将版本号分割为数字数组
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    // 比较每一部分
    for (let i = 0; i < 3; i++) {
        if (parts1[i] > parts2[i]) return 1; // v1 大于 v2
        if (parts1[i] < parts2[i]) return -1; // v1 小于 v2
    }

    return 0; // 版本相同
}
/*export function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    const maxLength = Math.max(parts1.length, parts2.length);

    for (let i = 0; i < maxLength; i++) {
        const num1 = parts1[i] || 0;
        const num2 = parts2[i] || 0;

        if (num1 > num2) return 1;
        if (num1 < num2) return -1;
    }

    return 0;
}*/
