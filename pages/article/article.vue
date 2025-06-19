<template>
  <view>
<button @click="btn1">btn</button>
  </view>
</template>

<script setup>
import {ylxEventBus} from "@/ylxuniCore/useylxuni";

ylxEventBus.on(({args})=>{
  console.log('dxxx',args[0])
  args[0].thenCallback('xxiiioooo')

})



function btn1() {
  console.log('btn1')
  ylxEventBus.emit({
    targetPath:'/pages/index/index',
    // prevPage:true,
    options:{
      age:12
    }
  })
}
</script>


<style scoped lang="scss">

</style>
