<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V">
				<view><button class="targetBtn" hover-class="none" type="default" size="default" @click="handleGo">看结果</button></view>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	name:'report-result-popup',
	data() {
		return {
		};
	},
	//监听页面加载
	onLoad: function(option) {
	},
	//监听页面卸载
	onUnload() {},
	computed: {},
	methods: {
		handleGo: function() {
			const _self = this;
			this.$store
				.dispatch('createUserReport', {})
				.then(data => {
					window.document.title = "个人测评报告";
					const url = _self.$pageConfig[4];
					uni.redirectTo({ url });
				})
				.catch(e => {
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					});
				});
		}
	},
	components: {}
};
</script>
<style></style>
