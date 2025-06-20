/*---------------蓝牙搜索---------------------*/
import {ylxBle} from "@/ylxuniCore/ylxBle/ylxBle";
import {debounce} from "@/utils/tools";

export const DEVICE_CONNECTION = "deviceList";
export const EMIT_DEVICE_CONNECTION = "emitDeviceList";
export const ON_DEVICE_LIST = "emitAppDeviceList";

/*---------------蓝牙---------------------*/
export const ADAPTER_STATE = "adapterState";
export const EMIT_ADAPTER_STATE = "emitAdapterState";
export const ON_ADAPTER_STATE = "emitAppAdapterState";

/*---------------设备连接------------------*/
export const CONNECTION = "connection";
export const EMIT_CONNECTION = "emitConnection";
export const ON_CONNECTION = "onConnection";

/*---------------OnNotify------------------*/
export const CHARACTERISTIC_VALUE = "characteristicValue";
export const EMIT_CHARACTERISTIC_VALUE = "emitCharacteristicValue";
export const ON_NOTIFY = "emitAppCharacteristicValue";


export const isBleInitProxy = {
    isBleInit: false,
    isOnBle: false,
}


export default function (callback) {

    uni.$on(EMIT_ADAPTER_STATE, () => ylxBle.onBluetoothAdapterStateChange((data) => uni.$emit(ADAPTER_STATE, data)))
    uni.$on(EMIT_CONNECTION, () => ylxBle.onBLEConnectionStateChange((data) => uni.$emit(CONNECTION, data)))

    uni.$on(EMIT_CHARACTERISTIC_VALUE, () => ylxBle.onBLECharacteristicValueChange((data) => uni.$emit(ON_NOTIFY, data)))


    const onCharacteristicValHandle = ({hexString, deviceId, characteristicId}) => {
        console.log('App-收到的数据', {hexString, deviceId, characteristicId})
        uni.$emit(ON_NOTIFY, {hexString, deviceId, characteristicId})
    }
    const onConnectionHandle = (bleRes) => {
        console.log('连接', bleRes)


    }


    const onAdapterStateHandle = (bleRes) => {
        console.log('bleRes', bleRes)
        if (bleRes.hasOwnProperty("available")) {
            // 关闭蓝牙
            if (!bleRes.available) {
                console.log('蓝牙关闭')
            } else {
                // 蓝牙开启
                console.log('蓝牙开启')
            }

            uni.$emit(ON_ADAPTER_STATE, bleRes)

        } else if (bleRes.hasOwnProperty("connected")) {
            if (!bleRes.connected) { // 断开连接
                console.log('断开连接', bleRes)
                uni.$emit(ON_CONNECTION, bleRes)
            }
        }
    }
    const debounceOnAdapterStateHandle = debounce(onAdapterStateHandle, 600);


    const onDeviceListHandle = (bleRes) => {
        uni.$emit(ON_DEVICE_LIST, bleRes)
    }


    uni.$off(CHARACTERISTIC_VALUE, onCharacteristicValHandle)
    uni.$on(CHARACTERISTIC_VALUE, onCharacteristicValHandle)

    uni.$off(CONNECTION, onConnectionHandle)
    uni.$on(CONNECTION, onConnectionHandle)

    uni.$off(ADAPTER_STATE, debounceOnAdapterStateHandle)
    uni.$on(ADAPTER_STATE, debounceOnAdapterStateHandle)


    // 执行传入的回调函数
    if (callback) callback()
}



