<template>
  <view :class="customClass" :style="resultCustomStyle">
    <view class="ylx-swiper" :style="{'--width':width,'--scale':resultScale}" >
      <swiper :current="resultCurrent" @change="ylxChangeSwiper" :duration="200" class="width-height" >
        <swiper-item v-for="(item,index) in swiperList" :key="index">
          <image class="rounded-8 width-height" mode="aspectFill" :src="item[srcKey]" :style="{width}"  @click="swiperPreviewImg(index)"></image>
        </swiper-item>
      </swiper>

      <view class="indicator" :style="`bottom:${indicatorBottom}`">
        <view class="indicator-item" :class="`${resultCurrent===index?'active':''}`" v-for="(item, index) in swiperList" @click="btnClick(index)" :key="index"></view>
      </view>

    </view>
  </view>
</template>
<script>

import {componentsMixin, localStringStyle,} from "@/components/ylx-components/ylx-JS/template";
import {computedRatio, convertStyleObjectToString} from "@/utils/tools";

export default {
  mixins: [componentsMixin],
  name: 'ylx-swiper',

  props: {

    swiperList: {
      type: Array,
      default: () => []
    },
    width: {
      type: String,
      default: '320rpx'
    },
    scale: {
      type: String,
      default: '10:7'
    },
    srcKey: {
      type: String,
      default: 'src'
    },
    indicatorBottom: {
      type: String,
      default: '-50rpx'
    },

    indicatorImageList: {
      type: Array,
      default: () => []
    },
    preview: Boolean,

  },
  data() {
    return {
      current: 0
    }
  },
  computed: {

    resultCustomStyle() {
      return convertStyleObjectToString({
        // 其它代码
      }) + localStringStyle(this.customStyle)
    },
    resultScale() {
      return computedRatio(this.scale)
    },
    resultCurrent() {
      return this.current
    },
  },

  methods: {
    ylxChangeSwiper(event) {
      this.$emit('updateCurrent', event.detail.current)
      this.current = event.detail.current
    },

    btnClick(index) {
      this.$emit('updateCurrent', index)
      this.current = index

    },
    // 预览
    swiperPreviewImg(index) {
      if (this.preview) {
        uni.previewImage({
          urls: this.swiperList.map(item => item[this.srcKey]),
          current: index,
        })
      }
    },
    setCurrent(current) {
      this.current = current
    },
    getCurrent() {
      return this.current
    },
  }

}
</script>

<style scoped lang="scss">
.ylx-swiper {
  position: relative;


  .indicator {
    position: absolute;
    bottom: 15rpx;
    left: 0;
    right: 0;
    border-radius: 50px;
    display: flex;
    align-items: center;
  /*  gap: 16rpx;*/
    justify-content: center;

    .indicator-item {
      height: 20rpx;
      width: 20rpx;
      border-radius: 10px;
      background-color: #a1a1a1;
      margin-right: 16rpx;
    }

    .active {
      width: 20rpx;
      background-color: #189ACF;
      transition-property: width;
      transition-duration: 80ms;
    }

  }
}

.width-height {
  --height-scale: calc(var(--width) / var(--scale));
  width: var(--width);
  height: var(--height-scale);
  position: relative;
}

</style>
