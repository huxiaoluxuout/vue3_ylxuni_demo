<template>
  <view class="content">
    <view class="flex">
      <button @click="testBtn1">完善</button>
      <button @click="testBtn2">未完善</button>
      <button @click="testBtn21">testBtn21</button>
    </view>
    <view class="flex">
      <button @click="interceptTestBtn3('参数')">拦截</button>
      <button @click="interceptTestBtn4('interceptTestBtn4')">ylxEventBusApp</button>
    </view>
    <button @click="testBtn5('testBtn5')">文章</button>

  </view>
</template>

<script>
import useNextInterceptor from "@/ylxuniCore/common/useNextInterceptor";
import {onErrorProfileHandler, profileProxy} from "@/ylxuniCore/common/common";
import {ylxEventBus} from "@/ylxuniCore/useylxuni";
import {ylxNavigateTo} from "@/utils/uniTools";

export default {
  data() {
    return {
      title: 'Hello'
    }
  },
  onLoad() {
    ylxEventBus.on(({args}) => {
      console.log('index-data', args[0])
    })
  },
  methods: {
    testBtn1() {
      console.log('完善', profileProxy)
      profileProxy.idNumber = true
      profileProxy.phone = true
      profileProxy.nickName = true
      profileProxy.avatarUrl = true
      profileProxy.actuallyName = true
      // idNumber: null,
      // phone: null,
      // nickName: null,
      // avatarUrl: null,
      // actuallyName: null
    },

    testBtn2() {
      console.log('未完善', profileProxy)
      profileProxy.idNumber = true
      profileProxy.phone = false
      profileProxy.nickName = false
      profileProxy.avatarUrl = false
      profileProxy.actuallyName = false
    },
    testBtn21() {
      profileProxy.haha = false

    },
    interceptTestBtn3(data) {
      useNextInterceptor({
        isNext: profileProxy.idNumber && profileProxy.phone && profileProxy.nickName && profileProxy.actuallyName,
        onSuccess: () => this.testBtn3(data),
        onError: onErrorProfileHandler
      })()
    },
    testBtn3(data) {
      console.log(data, '正常执行代码。。。。。。。。。。', profileProxy)

    },
    interceptTestBtn4(data) {
      console.log(data, '正常执行代码。。。。。。。。。。')
      ylxEventBus.emitGlobal({
        profileProxy,
        testBtn3: this.testBtn3
      }, 'index').then((res) => {
        // 回调信息
        console.log(res)
      })

    },

    testBtn5() {
      ylxNavigateTo('/pages/article/article')

      ylxEventBus.emit({
        targetPath: '/pages/article/article',

        options: {
          agex: 13
        }
      }).then(res => {
        console.log('res', res)
      })
    },
  }
}
</script>

<style>

</style>
