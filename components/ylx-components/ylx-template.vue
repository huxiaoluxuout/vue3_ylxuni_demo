<template>
  <view :class="customClass" :style="resultCustomStyle">
    我是模板
  </view>
</template>
<script>


import {componentsMixin, localStringStyle} from "@/components/ylx-components/ylx-JS/template";
import {convertStyleObjectToString} from "@/utils/tools.js";

export default {
  mixins: [componentsMixin],

  name: 'ylx-template',

  props: {


  },
  computed: {
    resultCustomStyle() {
      return convertStyleObjectToString({
        // 其它代码

      }) + localStringStyle(this.customStyle)
    },
  },

  methods: {}

}
</script>


