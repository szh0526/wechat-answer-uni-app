<template>
	<view class="bottombar">
		<view class="cu-bar tabbar bg-white" style="padding-bottom: 7px;">
			<view :class="{'action':true,'text-gray':(curActive == 'home'),'text-green':(curActive == 'home')}" id="home" @click="onHomeClick">
				<view class="cuIcon-homefill" id="my" @click="onHomeClick" ></view> 首页
			</view>
			<view :class="{'action':true,'text-gray':(curActive != 'my'),'text-green':(curActive == 'my')}" id="my" @click="onMyClick">
				<view class="cuIcon-my" id="my" @click="onMyClick" ></view>我的测评
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'bottom-bar',
	props: {
		status: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			curActive:"home"
		};
	},
	mounted: function() {
		this.curActive = this.status;
	},
	destroyed:function(){
		this.curActive = "home";
	},
	methods: {
		onHomeClick:function(){
			this.curActive = "home";
			window.document.title = "妈妈测";
			const url = this.$pageConfig[1000];
			uni.redirectTo({ url });
		},
		onMyClick:function(){
			this.curActive = "my";
			window.document.title = "我的测评";
			const url = this.$pageConfig[1001];
			uni.redirectTo({ url });
		}
	},
	components: {
	}
};
</script>

<style>
	.bottombar{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}
	.cu-bar.tabbar .action [class*="cuIcon-"]{
		margin: 0 auto;
	}
</style>
