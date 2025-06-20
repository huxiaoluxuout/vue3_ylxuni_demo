// 治疗仪服务646687FB-033F-9393-6CA2-0E9401ADEB32
// 设备信服务646687F0-033F-9393-6CA2-0E9401ADEB32

// 治疗仪指令
export function command(HexType) {
    const originalString = `646687${HexType}-033F-9393-6CA2-0E9401ADEB32`
    return originalString.toUpperCase();
}

export function extractHexType(fullString) {
    // 正则表达式匹配 HexType 部分
    const regex = /^646687(.*?)-033F-9393-6CA2-0E9401ADEB32$/i;
    const match = fullString.match(regex);

    // 如果匹配成功，返回 HexType
    if (match && match[1]) {
        return match[1]; // match[1] 中就是 HexType
    } else {
        return null; // 如果没有匹配成功，返回 null
    }
}

export function Interval(callback1, callback2) {
    let Interval = null;

    function startInterval(timeout = 1000) {
        console.log('startInterval')
        stopInterval(Interval)
        Interval = setInterval(() => {
            callback1(callback2)
        }, timeout);
    }

    function stopInterval() {
        if (Interval) {
            clearInterval(Interval);
            Interval = null;
        }
    }

    return {
        start: startInterval,
        stop: stopInterval
    };

}

export function createInterval(callback1, callback2) {
    let currentInterval = null;
    let debounceTimeout = null;
    const intervalTime = 1000; // 定时器的间隔时间
    const debounceDelay = 500; // 防抖的延迟时间

    function stop() {
        if (currentInterval !== null) {
            // console.log('Stopping current interval...');
            clearInterval(currentInterval);
            currentInterval = null;
        }
    }

    function start() {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        debounceTimeout = setTimeout(() => {
            stop(); // 先停止之前的定时器
            // console.log('Starting new interval...');
            currentInterval = setInterval(() => {
                // console.log('Executing interval callback');
                callback1(callback2);
            }, intervalTime);
        }, debounceDelay);
    }

    return {start, stop};
}

export  function formatTimeSec(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // 使用 padStart 方法确保分钟和秒数都是两位数
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
export function startAccurateCountdown(callback, duration, interval = 1000) {
    if (typeof callback !== 'function' || duration <= 0) {
        console.error("Invalid parameters.");
        return;
    }

   /* if (interval < 50) {
        interval = 50;
    }*/
    /*  if (interval < 50) {
        interval = 50;
    }*/

    let endTime = Date.now() + duration;
    let timerId = null;
    let pausedDuration = 0;
    let isPaused = false;
    let lastDisplayedRefresh = -1;
    let isLock = false; // 锁机制标志
    const debounceDelay = 100; // 去抖动延迟时间
    let debounceTimer = null;
    let isStart = false;

    const update = () => {
        const remaining = endTime - Date.now();
        if (remaining <= 0) {
            callback(0);
            // console.log("倒计时结束!");
            clearTimeout(timerId);
            timerId = null;
            return;
        }

        const refreshRate = Math.floor(remaining / interval);
        if (!isPaused && lastDisplayedRefresh !== refreshRate) {
            callback(remaining);
            lastDisplayedRefresh = refreshRate;
        }

        timerId = setTimeout(update, 16);
    };

    const startTimer = () => {
        if (!timerId) {
            endTime = Date.now() + (isPaused ? pausedDuration : duration);
            isPaused = false;
            lastDisplayedRefresh = -1;
            timerId = setTimeout(update, 0);
        }
    };

    const pauseTimer = () => {
        if (!isLock && !isPaused && timerId) {
            isLock = true; // 上锁，防止重复调用
            if (debounceTimer) {
                clearTimeout(debounceTimer); // 清除之前的去抖动定时器
            }
            debounceTimer = setTimeout(() => {
                isPaused = true;
                pausedDuration = endTime - Date.now();
                clearTimeout(timerId);
                timerId = null;
                isLock = false; // 解锁
            }, debounceDelay);
        }
    };

    const goOnTimer = () => {
        if (!isStart) {
            startTimer()
            return
        }
        if (!isLock && isPaused) {
            isLock = true; // 上锁
            if (debounceTimer) {
                clearTimeout(debounceTimer); // 清除之前的去抖动定时器
            }
            debounceTimer = setTimeout(() => {
                startTimer();
                isLock = false; // 解锁
            }, debounceDelay);
        }
    };

    const reTime = (newDuration = duration) => {
        if (!isLock) {
            isLock = true; // 上锁
            if (debounceTimer) {
                clearTimeout(debounceTimer); // 清除之前的去抖动定时器
            }
            debounceTimer = setTimeout(() => {
                pauseTimer();
                if (typeof newDuration === 'number' && newDuration > 0) {
                    duration = newDuration;
                    endTime = Date.now() + (isPaused ? pausedDuration : duration);
                    pausedDuration = duration;
                    startTimer();
                    isLock = false; // 解锁
                }
            }, debounceDelay);

        }

    };

    // 立即开始
    if (isStart) {
        startTimer();
    }
    return {
        stop: pauseTimer,
        start: goOnTimer,
        reset: reTime
    };
}


export function formatTime(seconds) {
    if (seconds < 0) {
        return '00' + ':' + '00';
    }
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    minutes = minutes < 10 ? '0' + minutes : minutes;
    remainingSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return minutes + ':' + remainingSeconds;
}

// 010204030cbc01010202
