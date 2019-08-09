<template>
	<view class="VerticalMain">
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V" v-if="isFollowPublic">
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
							<div class="closeMsg" @click="handleCloseFollow"></div>
						</div>
					</view>
				</view>
			</view>
			<view class="flex-item flex-item-V">
				<view v-if="infos.length">
					<view class="padding-lr-xxs padding-bottom-sm">
						<view class="cu-list menu-avatar">
							<view class="tip">
								<text class="lg text-black">邀请俩人完成测试即可免费查看测试结果</text>
							</view>
							<view class="cu-item" v-for="(item, index) in infos" :key="index">
								<view class="cu-avatar round xxl" :style="{backgroundImage:`url(${item.img})`}"></view>
								<view class="content">
									<view class="text-black" style="width: 36vw;font-size: 1.2em;margin-right: 15px;">
										<text class="text-cut text-bold">{{item.title}}</text>
									</view>
									<view class="status" @click="handleShare(item.status)" :style="{backgroundColor:item.bgColor}">
										{{item.desc}}
									</view>
									<view class="cu-item">
										<text class="lg text-black" :class="'cuIcon-' + item.icon" style="font-size: 24px;"></text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="questionBox">
				<div class="submit" v-if="!showFreeReport" @click="handlePay">支付{{payAmount}}直接查看报告</div>
				<div class="submit" v-if="showFreeReport" @click="handleFree">免费查看</div>
			</view>
		</view>
		<view v-show="showShare">
			<div id="share">
				<img src="/build/static/image/common/guide_point.png" />
				<img src="/build/static/image/common/guide_btn.png" @click="handleCancel" />
			</div>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isFollowPublic: false,
				showFreeReport: false,
				showShare: false,
				payAmount: "0元",
				infos: [],
				showHelp:false,
				qrcode:'',
			}
		},
		//监听页面初次渲染完成
		onReady() {
			uni.hideTabBar({})
		},
		onLoad: function() {
			const {
				initUserQuestionsPayInfo
			} = this.$store.state;
			if (Object.prototype.toString.call(initUserQuestionsPayInfo) !== '[object Object]') {
				//当全局接口数据为空时 返回首页
				const url = this.$pageConfig[7];
				uni.redirectTo({
					url
				});
				return;
			}
			this.$store.commit('setCurrentPage', 'schedule');
			this.isFollowPublic = initUserQuestionsPayInfo.isFollowPublic == "0";
			this.payAmount = initUserQuestionsPayInfo.payAmount;
			this.getUserShareInfo();
		},
		methods: {
			getUserShareInfo: function() {
				this.$store
					.dispatch('getUserShareInfo', {})
					.then(data => {
						const {origin} = window.location;
						this.infos = data ? data.map((x, idx) => {
							if (idx == 0) {
								x.title = '完成测试';
							} else if (idx == 1) {
								x.title = '邀请1人完成测试';
							} else if (idx == 2) {
								x.title = '邀请2人完成测试';
							}
							x.img = !!x.img ? x.img : `${origin}/build/static/image/common/gray.jpg`;
							x.desc = x.status == "0" ? "前往" : "已完";
							x.bgColor = x.status == "0" ? "#e54d42" : "#44e766";
							x.icon = x.status == "0" ? "goodsfill" : "roundcheckfill";
							return x;
						}) : [];

						const temps = data && data.length > 0 ? data.filter(x => x.status == "0") : null;

						this.showFreeReport =  temps && temps.length == 0;
					})
					.catch(e => {
						uni.showToast({
							icon: 'none',
							title: e.message,
							duration: 2000
						});
					});
			},
			handlePay: function() {
				const _self = this;
				_self.$store
					.dispatch('getUserPayAmountInfo', {})
					.then(data => {
						if (_self.$wechat && _self.$wechat.isWechat()) {
							_self.$wechat.pay(() => {
								//支付完直接跳转
								_self.handleFree();
							});
						}
					})
					.catch(e => {
						uni.showToast({
							icon: 'none',
							title: e.message,
							duration: 2000
						});
					});
			},
			handleShare: function(status) {
				if (status == "1") return;
				this.showShare = true;
			},
			handleFree: function() {
				const _self = this;
				this.$store
					.dispatch('createUserReport', {})
					.then(data => {
						window.document.title = '个人测评报告';
						const url = _self.$pageConfig[4];
						uni.redirectTo({
							url
						});
					})
					.catch(e => {
						uni.showToast({
							icon: 'none',
							title: e.message,
							duration: 2000
						});
					});
			},
			handleCancel: function() {
				this.showShare = false;
			},
			handleFollow: function() {
				const {origin} = window.location;
				this.showHelp = true;
				this.qrcode = `${origin}/build/static/image/qrCode.jpeg`;
			},
			handleCloseFollow: function() {
				this.showHelp = false;
			},
		},
		components: {
		}
	}
</script>

<style>
	.cu-list.menu-avatar>.cu-item .content {
		position: absolute;
		left: 220upx;
		width: calc(100% - 96upx - 120upx - 20upx);
		line-height: 1.6em;
	}

	.cu-list.menu-avatar>.cu-item .content>uni-view {
		display: inline-block;
	}

	.cu-list.menu-avatar>.tip {
    background: #FFFFFF;
    font-size: 1.4em;
    text-align: center;
    height: 15vh;
    line-height: 15vh;
	}

	.cu-list.menu-avatar>.cu-item .content>.status {
		border-radius: 10px;
    color: #FFFFFF;
    /* font-weight: bold; */
    margin-right: 18px;
    font-size: 1.5em;
    padding: 5px;
    width: 16vw;
    height: 6vh;
    text-align: center;
    line-height: 5vh;
	}

	.cu-list.menu-avatar>.cu-item>.cu-avatar {
		position: absolute;
		left: 15px;
	}

	.cu-list.menu-avatar>.cu-item .countDesc {
		float: right;
		right: 10upx;
		line-height: 2.3em;
	}

	.cu-list.menu-avatar>.cu-item {
		padding-right: 20upx;
	}

	.VerticalNav.nav .cu-item.cur {
		background-color: #fff;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: '';
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		background-color: #FFFFFF;
		height: 100vh;
		flex: 1;
	}

	.VerticalMain .questionBox {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 3vh;
		margin: 0 auto;
		display: inline-flex;
		width: 60vw;
		text-align: center;
	}

	.VerticalMain .questionBox div {
		width: 32vw;
		margin: auto;
		display: inline-block;
	}

	.VerticalMain .questionBox div.submit {
		margin: 10px 0 5px 0;
		background-image: url(/build/static/image/common/buttonbg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		font-size: 1.2em;
		height: 7vh;
		width: 100vw;
		line-height: 7vh;
		letter-spacing: 2px;
		border-radius: 5px;
		text-align: center;
		color: #fff;
	}

	.VerticalMain .questionBox div.share {}


	.share {
		margin: 10px 25px 5px 25px;
		width: 32vw;
		background-image: url(/build/static/image/common/buttonbg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		font-size: 1.2em;
		height: 7vh;
		line-height: 7vh;
		letter-spacing: 2px;
		border-radius: 5px;
		text-align: center;
		color: #fff;
	}

	#share {
		background-color: black;
		left: 0;
		opacity: 0.7;
		position: fixed;
		top: 0;
		z-index: 9999;
		height: 100%;
		width: 100%;
	}

	#share img {
		float: right;
		width: 300px;
		max-width: 80%;
	}
	

	.title {
		background-color: #EED5D2;
		height: 90upx;
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
		margin: 5px;
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
		margin: 7px 5px;
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
