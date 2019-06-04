<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V"><page-head /></view>
			<view class="flex-item flex-item-V"><colorui-swiper /></view>
		</view>
	</view>
</template>

<script>
import coloruiSwiper from '../component/swiper/swiper.vue';
export default {
	data() {
		return {
			title: '首页'
		};
	},
	onLoad:function() {
		uni.showLoading({
			title: '加载中...'
		});
		uni.request({
			url:`${this.$apiUrl}/index/index`,
			method: 'GET',
			data: {},
			success: res => {
				console.log(res.data);
				uni.hideLoading();
			},
			fail: () => {},
			complete: () => {}
		});
	},
	//元素第一次挂载时
	mounted: function() {},
	//更新时
	updated: function() {},
	//销毁时
	destroyed: function() {},
	methods: {},
	components: {
		coloruiSwiper
	}
};
</script>
<style></style>
