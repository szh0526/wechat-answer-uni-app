<template>
	<view style="background: #fff;height: 100vh;">
		<div class="userinfo">
			<div class="info">
				<text style="font-size: 1.2em;">{{ title }}</text>
				<text style="font-size: 1.2em;">{{ name }}</text>
				<text>{{ date }}</text>
			</div>
			<div class="img">
				<view class="cu-avatar lg round" :style="[{ backgroundImage: 'url(' + img + ')' }]"></view>
			</div>
		</div>
		<div class="htmlWrap">
			<view v-for="(item, index) in dataList" :key="index">
				<rich-text :nodes="item.htmlStr"></rich-text>
			</view>
			<view class="reportBox" v-if="showDown">
				<div :style="{'pointer-events':isStart ? 'none' : 'unset'}" @click="handlePrevPage">上一页</div>
				<div v-if="!showComment" @click="handleNextPage">下一页</div>
				<div v-if="showComment" @click="handleComment">去评价</div>
			</view>
			<!-- <view class="questionBox" v-if="showComment">
				<view><div class="comment" @click="handleComment">去评价</div></view>
				<view><wx-share-button title="去分享" /></view>
			</view> -->
			<view class="payBox" v-if="showPay">
				<view>
					<div class="pay" @click="handlePay">支付{{payAmount}}继续查看</div>
				</view>
			</view>
		</div>
	</view>
</template>

<script>
	import wxShareButton from '../component/wxShareButton/index.vue';
	export default {
		components: {
			wxShareButton
		},
		data() {
			return {
				// 列表数据
				dataList: [],
				showComment: false,
				showPay: false,
				showDown: true,
				isStart: false,
				payAmount: 0,
				currentPage: 0,
				title: '',
				name: '',
				img: '',
				date: ''
			};
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
				const url = this.$pageConfig[1000];
				uni.navigateTo({
					url
				});
				return;
			}
			this.$store.commit('setCurrentPage', 'reportShow');
			const {
				title,
				userinfo,
				payAmount
			} = initUserQuestionsPayInfo;
			this.title = title;
			this.name = userinfo.name;
			this.img = userinfo.img;
			this.date = userinfo.date;
			this.payAmount = payAmount;

			this.upCallback();
		},
		methods: {
			handlePay: function() {
				const _self = this;
				this.$store
					.dispatch('getUserPayAmountInfo', {})
					.then(data => {
						if (this.$wechat && this.$wechat.isWechat()) {
							this.$wechat.pay(() => {
								_self.showDown = true;
								_self.showPay = false;
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
			handleComment: function() {
				window.document.title = '发表评价';
				const url = this.$pageConfig[5];
				uni.navigateTo({
					url
				});
			},
			handlePrevPage: function() {
				this.downCallback();
			},
			handleNextPage: function() {
				this.upCallback();
			},
			/*上拉加载的回调*/
			upCallback: function() {
				this.$store
					.dispatch('getNextUserReport', {
						currentPage: this.currentPage
					})
					.then(data => {
						let isEnd = parseInt(data.isEnd);
						// 接口返回的当前页数据列表 (数组)
						let curPageData = data.report_str ? [{
							htmlStr: `<div class='report'>${data.report_str}</div>`
						}] : [];
						//最后一页显示 去评价
						this.showComment = isEnd == 1;
						//显示支付按钮
						this.showPay = isEnd == 0 && data.must_pay == 1;
						//最后一页隐藏上一页按钮
						this.showDown = data.must_pay == 0;
						//页数
						this.currentPage = data.id;
						this.isStart = false;
						//设置列表数据
						this.dataList = curPageData; //追加新数据
					})
					.catch(e => {
						uni.showToast({
							icon: 'none',
							title: e.message,
							duration: 2000
						});
					});
			},
			/*下拉加载的回调*/
			downCallback: function() {
				this.$store
					.dispatch('getPreviousUserReport', {
						currentPage: this.currentPage
					})
					.then(data => {
						let isStart = parseInt(data.isStart);
						//最后一页显示 去评价
						this.showComment = false;
						//最后一页显示 去评价
						this.showDown = true;
						if (isStart == 0) {
							// 接口返回的当前页数据列表 (数组)
							let curPageData = data.report_str ? [{
								htmlStr: `<div class='report'>${data.report_str}</div>`
							}] : [];
							//页数
							this.currentPage = data.id;
							//设置列表数据
							this.dataList = curPageData; //追加新数据
						} else {
							this.isStart = true;
						}
					})
					.catch(e => {
						uni.showToast({
							icon: 'none',
							title: e.message,
							duration: 2000
						});
					});
			}
		}
	};
</script>
<style>
	@-webkit-keyframes fadeIn {
		0% {
			opacity: 0;
			/*初始状态 透明度为0*/
		}

		50% {
			opacity: 0.7;
			/*中间状态 透明度为0*/
		}

		100% {
			opacity: 1;
			/*结尾状态 透明度为1*/
		}
	}

	.userinfo {
		color: #fff;
		height: 22vh;
		width: 100%;
		padding: 2vh 0;
		background-image: url(/build/static/image/common/userInfo.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.userinfo div {
		margin: 0 0 0 15px;
	}

	.userinfo uni-text {
		display: block;
		color: #fff;
		margin: 1vh 10px 1vh 10px;
		font-size: 1em;
	}

	.userinfo .info {
		position: absolute;
		top: 3vh;
		left: 1vh;
		bottom: 77.5vh;
		width: 48vw;
		height: 30vh;
	}

	.userinfo .img {
		position: absolute;
		right: 5vh;
		/* left: 0; */
		bottom: 77.5vh;
		top: 0;
		margin: auto;
		width: 90px;
		height: 90px;
	}

	.cu-avatar.lg {
		width: 100%;
		height: 100%;
	}

	.htmlWrap {
		font-size: 1em;
		position: absolute;
		left: 0;
		top: 21.5vh;
		right: 0;
		padding: 16px;
		margin: auto;
		height: 63vh;
		width: 84vw;
		color: #78747e;
		font-size: 1em;
		background-color: #fcffff;
		overflow: hidden;
		overflow-y: auto;
		/* border-top-right-radius: 10px;
	border-top-left-radius: 10px;
	border-bottom: 0; */
		border-radius: 10px;
		box-shadow: 0 6px 10px #ccc;
	}

	.htmlWrap .report {
		-webkit-animation-name: fadeIn;
		/*动画名称*/
		-webkit-animation-duration: 1200ms;
		/*动画持续时间*/
		-webkit-animation-iteration-count: 1;
		/*动画次数*/
		-webkit-animation-delay: 0s;
		/*延迟时间*/
	}

	.htmlWrap .nextPage {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		background: #fff;
		height: 5vh;
		width: 92vw;
		box-shadow: 0px -6px 12px 1px #fff;
	}

	.htmlWrap .nextPage .down {
		margin: auto;
		height: 4vh;
		width: 4vw;
		background-image: url(/build/static/image/common/down.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.htmlWrap .questionBox {
		display: inline-flex;
		margin: auto;
		position: fixed;
		left: 0;
		width: 68vw;
		/* top: 0; */
		bottom: 1vh;
		right: 0;
	}

	.htmlWrap .questionBox div {
		width: 32vw;
		height: 8vh;
		margin: auto;
		display: inline-block;
	}

	.htmlWrap .questionBox div.comment {
		margin: 10px 0 5px 0;
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

	.htmlWrap .questionBox div.share {}

	.htmlWrap .payBox {
		margin: auto;
		position: fixed;
		left: 0;
		width: 57vw;
		/* top: 0; */
		bottom: 1vh;
		right: 0;
	}

	.htmlWrap .payBox div {
		color: #fff;
		text-align: center;
		font-size: 1.2em;
		border-radius: 10px;
		font-weight: bold;
		padding: 5px;
		width: 55vw;
		height: 6vh;
		margin: auto;
		display: inline-block;
	}

	.htmlWrap .payBox div.pay {
		background-image: url(/build/static/image/common/buttonbg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		font-size: 1.2em;
		line-height: 5.5vh;
		letter-spacing: 2px;
		border-radius: 5px;
		text-align: center;
		color: #fff;
	}

	.reportBox {
		margin: 3px;
		font-size: 1.2em;
		line-height: 7vh;
		letter-spacing: 2px;
		border-radius: 5px;
		text-align: center;
		color: #fff;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 1vh;
		margin: auto;
	}

	.reportBox div {
		display: inline-block;
		/* height: 50px;
	width: 22vw; */
		height: 7vh;
		width: 19vw;
		border-radius: 27px;
	}

	.reportBox div:active {
		opacity: 0.4;
	}

	.reportBox div:first-child {
		margin-right: 50px;
		background-image: url(/build/static/image/common/redbutton.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.reportBox div:last-child {
		margin-left: 50px;
		background-image: url(/build/static/image/common/redbutton.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}
</style>
