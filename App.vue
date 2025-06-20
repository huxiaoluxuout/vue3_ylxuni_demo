<script>

  import {useOnGlobal} from "@/ylxuniCore/useOnGlobal";
  import onBle from "@/ylxuniCore/ylxBle/onBle";



  export default {
		onLaunch: function() {
			console.log('App Launch')
      useOnGlobal('回调信息')
      onBle()

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
@import "static/css/ylx-tailwindcss.css";
@import "static/css/common.css";
@import "static/css/projects.css";
</style>
