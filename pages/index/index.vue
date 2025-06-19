<template>
  <view class="content">
    <view class="flex">
      <button @click="testBtn1">完善</button>
      <button @click="testBtn2">未完善</button>
    </view>
    <view class="flex">
      <button @click="interceptTestBtn3('参数')">拦截</button>
    </view>
  </view>
</template>

<script>
import useMustCompleteUserInfo, {profileProxy} from "@/ylxuniCore/useMustCompleteUserInfo";

export default {
  data() {
    return {
      title: 'Hello'
    }
  },
  onLoad() {

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
      profileProxy.idNumber = false
      profileProxy.phone = false
      profileProxy.nickName = false
      profileProxy.avatarUrl = false
      profileProxy.actuallyName = false
    },
    interceptTestBtn3() {
      useMustCompleteUserInfo({
        onSuccess: this.testBtn3
      })('xxx')
    },
    testBtn3(data) {
      console.log(data, '正常执行代码。。。。。。。。。。', profileProxy)

    },
  }
}
</script>

<style>

</style>
