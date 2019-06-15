<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V">
				<view><button class="targetBtn" hover-class="none" @click="handleShare">让朋友也测测吧</button></view>
			</view>
		</view>
	</view>
</template>

<script>

export default {
	data() {
		return {
		};
	},
	//监听页面加载
	onLoad: function(option) {
		this.$store.commit('setCurrentPage', 'preparePage');
	},
	methods: {
		handleShare: function() {
			console.log("微信sdk接入")
		}
	},
	components: {
	}
};
</script>
<style></style>
