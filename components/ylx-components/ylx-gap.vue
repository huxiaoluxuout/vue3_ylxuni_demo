<template>
  <view :style="resultCustomStyle" :class="customClass"></view>
</template>
<script>


import {localStringStyle, componentsMixin} from "@/components/ylx-components/ylx-JS/template";

import {convertStyleObjectToString} from "@/utils/tools.js";

export default {
  mixins: [componentsMixin],

  name: 'ylx-gap',

  props: {

    bgColor: {
      type: String,
      default: 'transparent'
    },
    height: {
      type: String,
      default: '1rpx'
    },
    width: {
      type: String,
      default: '100%'
    },
  },
  computed: {
    resultCustomStyle() {
      return convertStyleObjectToString({
        height: this.height,
        width: this.width,
        'background-color': this.bgColor,
      }) + localStringStyle(this.customStyle)
    },
  }
}
</script>



