<template>
	<view class="bottombar">
		<view class="cu-bar tabbar bg-white" style="padding-bottom: 7px;">
			<view :class="{'action':true,'text-gray':(active !== 'home'),'text-green':(active == 'home')}" data-id="home" @click="onBarChange">
				<view class="cuIcon-homefill"></view> 首页
			</view>
			<view :class="{'action':true,'text-gray':(active !== 'my'),'text-green':(active == 'my')}" data-id="my" @click="onBarChange">
				<view class="cuIcon-my"></view>我的测评
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'bottom-bar',
	props: {
	},
	data() {
		return {
			active:"home"
		};
	},
	mounted: function() {
	},
	methods: {
		onBarChange:function(e){
			this.active = e.target.dataset.id;
			if(this.active == "home"){
				window.document.title = "妈妈测";
				const url = this.$pageConfig[1000];
				uni.redirectTo({ url });
			}else if(this.active == "my"){
				debugger
				window.document.title = "我的测评";
				const url = this.$pageConfig[1001];
				uni.redirectTo({ url });
			}
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
