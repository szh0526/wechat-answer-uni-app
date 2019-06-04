<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V"><page-head /></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '我的测评'
		};
	},
	onLoad() {
		uni.showLoading({
			title: '加载中...'
		});
		const url = `${this.$apiUrl}/index/index`;
		uni.request({
			url,
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
	methods: {},
	components: {}
};
</script>
<style></style>


