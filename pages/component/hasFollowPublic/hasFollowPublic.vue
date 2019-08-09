<template>
	<uni-nav-bar :border="false" backgroundColor="#EED5D2" height="90upx">
		<view class="title">
			<view class="text-box">
				<view class="cu-item">
					<text class="lg text-red cuIcon-notice"></text>
				</view>
				<text>关注公众号<b style="color: #FF0000;">,及时接收奖励金到账通知</b></text>
			</view>
			<view class="follow">
				<!-- 公众号原始ID 3577957379 base64加密后:MzU3Nzk1NzM3OQ== -->
				<!-- <a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU3Nzk1NzM3OQ==#wechat_redirect">马上关注</a> -->
				<a href="#" @click="handleFollow">马上关注</a>
			</view>
			<view v-show="showHelp">
				<div class="masker" catchtouchmove="ture"></div>
				<div class="showMsg">
					<div class="qrcode">
						<img :src="qrcode" />
					</div>
					<div class="closeMsg" @click="handleClose"></div>
				</div>
			</view>
		</view>
	</uni-nav-bar>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	export default {
		name: 'has-follow-public',
		props: {},
		data() {
			return {
				showHelp:false,
				qrcode:'',
			};
		},
		mounted: function() {},
		methods: {
			handleFollow: function() {
				const {origin} = window.location;
				this.showHelp = true;
				this.qrcode = `${origin}/build/static/image/qrCode.jpeg`;
			},
			handleClose: function() {
				this.showHelp = false;
			},
		},
		components: {
			uniNavBar
		}
	};
</script>

<style>
	.title {
		font-size: 14px;
		position: relative;
		z-index: 2;
		margin-bottom: -1.28rem;
		height: 2.3rem;
		line-height: 2.1rem;
		color: #4c4b58;
		transition: all 0.5s;
		transition-property: all;
		transition-duration: 0.5s;
		transition-timing-function: ease;
		transition-delay: 0s;
	}

	.follow {
		float: right;
		line-height: 1.2rem;
	}

	.follow a {
		padding: 5px;
    display: block;
    border-radius: 5px;
    border: 1px solid #FF0000;
    color: #FF0000;
    height: 3vh;
    line-height: 3.2vh;
    text-decoration: none;
	}

	.text-box {
		display: inline-flex;
		line-height: 32px;
		font-weight: 400;
		color: #000000;
	}

	.cu-item {
		font-size: 18px;
	}
	
	.masker {
		pointer-events: none;
		background-color: black;
		left: 0;
		opacity: 0.7;
		position: fixed;
		top: 0;
		z-index: 9999;
		height: 100%;
		width: 100%;
	}
	
	.showMsg {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 25px;
		top: 0;
		margin: auto;
		height: 60vh;
		width: 87vw;
		background-image: url(/build/static/image/common/showFollow.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		z-index: 9999;
	}
	
	.showMsg .qrcode {
		height: 20vh;
		width: 34vw;
		left: 0;
		right: 0;
		bottom: 3vh;
		margin: auto;
		position: absolute;
	}
	
	.showMsg .qrcode img {
		width: 100%;
		height: 100%;
	}
	
	.closeMsg {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -10vh;
		margin: auto;
		height: 7vh;
		width: 11vw;
		background-image: url(/build/static/image/common/closeMsg2x.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		z-index: 9999;
	}
</style>
