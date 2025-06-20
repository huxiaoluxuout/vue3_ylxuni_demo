<template>
  <view>
    <button @click="btn1">btn</button>
  </view>
</template>

<script setup>
import {onLoad, onUnload, onShow} from '@dcloudio/uni-app'

import {ylxEventBus} from "@/ylxuniCore/useylxuni";
import {CHARACTERISTICSLIST, ylxBle} from "@/ylxuniCore/ylxBle/ylxBle";
import {
  EMIT_ADAPTER_STATE,
  EMIT_CHARACTERISTIC_VALUE,
  EMIT_CONNECTION,
  isBleInitProxy,
  ON_NOTIFY
} from "@/ylxuniCore/ylxBle/onBle";

ylxEventBus.on(({args}) => {
  // console.log('dxxx', args[0])
  // args[0].thenCallback('xxiiioooo')

})
onLoad(() => {
  initBle()
  uni.$on(ON_NOTIFY, (data) => {
    console.log('ON_NOTIFY-data', data)
  })
})

onUnload(() => {
  uni.$off(ON_NOTIFY)
  ylxBle.stopBluetoothDevicesDiscovery()

})

function initBle() {
  console.warn('initBle')

  if (isBleInitProxy.isBleInit) {
    getDeviceList()
    return
  }

  ylxBle.closeBle(() => {

    ylxBle.initBle().then(res => {
      console.log('初始化蓝牙-res', res)
      isBleInitProxy.isBleInit = true
      getDeviceList()

    }).catch(err => {
      console.error('initBle-初始化蓝牙-err', err)


      if (err.code === 10001) { // 当前蓝牙适配器不可用


        // uni.$off(DEVICE_LIST, onDeviceList)
        // uni.$off(CONNECTION_STATE, handleDisconnect)


      }
    })
  }).catch(err => {
    console.error('closeBle', err)

  })

}

function getDeviceList() {
  console.warn('开始搜索！')
  // 整个App打开只触发一次
  if (!isBleInitProxy.isOnBle) {
    uni.$emit(EMIT_CHARACTERISTIC_VALUE)
    uni.$emit(EMIT_CONNECTION)
    uni.$emit(EMIT_ADAPTER_STATE)
    isBleInitProxy.isOnBle = true
  }

  ylxBle.startDeviceSearch(5 * 1000).then(() => {
    ylxBle.getBluetoothDevices().then(res => {
      console.log('搜索结果', res)
      ylxBle.stopBluetoothDevicesDiscovery()

      const deviceId = res[0].deviceId
      ylxBle.connect(deviceId).then(res => {


        setTimeout(() => {
          ylxBle.enableNotification(deviceId, CHARACTERISTICSLIST, () => {
            console.log('notify 开启成功')
          }, () => {

          })
        }, 2000)

      })
    })
  })

}

function onDeviceFound() {
  console.log('发现新设备！')
  ylxBle.onBluetoothDeviceFound((device) => {
    console.log('onDeviceFound', device)
    // ylxBle.stopBluetoothDevicesDiscovery()

  })
}


function btn1() {
  console.log('btn1')
  ylxEventBus.emit({
    targetPath: '/pages/index/index',
    // prevPage:true,
    options: {
      age: 12
    }
  })
}
</script>


<style scoped lang="scss">

</style>
