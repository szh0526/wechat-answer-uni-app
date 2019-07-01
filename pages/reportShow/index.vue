<template>
	<view style="background: #fff;height: 100vh;">
		<div class="userinfo">
			<div class="info">
				<text style="font-size: 1.2em;">{{ title }}</text>
				<text style="font-size: 1.2em;">{{ name }}</text>
				<text>{{ date }}</text>
			</div>
			<div class="img"><view class="cu-avatar lg round" :style="[{ margin: '30upx' }, { backgroundImage: 'url(' + img + ')' }]"></view></div>
		</div>
		<div class="htmlWrap">
			<view v-for="(item, index) in dataList" :key="index">
				<div :class="index > 0 ? 'report' : 'report_0'" :id="item.hash"><rich-text :nodes="item.htmlStr"></rich-text></div>
			</view>
			<view v-if="showDown">
				<div class="nextPage" @click="handleNextPage"><div class="down"></div></div>
			</view>
			<view class="questionBox" v-if="showComment">
				<view><div class="comment" @click="handleComment" /></view>
				<view><wx-share-button title="去分享" /></view>
			</view>
			<view class="payBox" v-if="showPay">
				<view><div class="pay" @click="handlePay">支付{{payAmount}}元继续查看</div></view>
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
			payAmount:0,
			currentPage: 0,
			title: '',
			name: '',
			img: '',
			date: ''
		};
	},
	onLoad: function() {
		const { initUserQuestionsPayInfo } = this.$store.state;
		if (Object.prototype.toString.call(initUserQuestionsPayInfo) !== '[object Object]') {
			//当全局接口数据为空时 返回首页
			const url = this.$pageConfig[0];
			uni.redirectTo({ url });
			return;
		}
		this.$store.commit('setCurrentPage', 'reportShow');
		const { title, userinfo,payAmount } = initUserQuestionsPayInfo;
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
			uni.redirectTo({ url });
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
					const dataListLen = this.dataList.length;
					const hash = 'report_' + dataListLen;
					// 接口返回的当前页数据列表 (数组)
					let curPageData = data.report_str ? [{ hash: hash, htmlStr: data.report_str }] : [];

					//最后一页显示 去评价和分享按钮
					this.showComment = data.isEnd == 1;
					//显示支付按钮
					this.showPay = data.isEnd == 0 && data.must_pay == 1;
					//最后一页隐藏下一页按钮
					this.showDown = data.isEnd == 0 && data.must_pay == 0;

					//页数+1
					this.currentPage = this.currentPage + 1;

					//设置列表数据
					if (data.isTop == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据

					setTimeout(() => {
						//跳转到新页
						if (dataListLen > 1) {
							window.location.hash = '#' + hash;
						}
					}, 500);
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
		opacity: 0; /*初始状态 透明度为0*/
	}
	50% {
		opacity: 0.7; /*中间状态 透明度为0*/
	}
	100% {
		opacity: 1; /*结尾状态 透明度为1*/
	}
}

.userinfo {
	color: #fff;
	height: 22vh;
	width: 100%;
	padding: 30upx 0;
	background-image: url(/build/static/image/common/userInfo.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.userinfo div {
	margin: 0 30upx 0 30upx;
}

.userinfo uni-text {
	display: block;
	color: #fff;
	margin: 10upx 20upx 10upx 20upx;
	font-size: 1em;
}

.userinfo .info {
	float: left;
	padding: 10upx;
	width: 50vw;
	height: 100%;
}

.userinfo .img {
	float: right;
	width: 30vw;
	height: 100%;
}

.cu-avatar.lg {
	width: 23vw;
	height: 14vh;
}

.htmlWrap {
	font-size: 1em;
	position: absolute;
	left: 0;
	top: 21vh;
	right: 0;
	padding: 32upx;
	margin: auto;
	height: 74vh;
	width: 84vw;
	color: #78747e;
	font-size: 1em;
	background-color: #fcffff;
	overflow: hidden;
	overflow-y: auto;
	border-top-right-radius: 20upx;
	border-top-left-radius: 20upx;
	border-bottom: 0;
	box-shadow: 0 12upx 20upx #ccc;
}

.htmlWrap .report {
	-webkit-animation-name: fadeIn; /*动画名称*/
	-webkit-animation-duration: 1200ms; /*动画持续时间*/
	-webkit-animation-iteration-count: 1; /*动画次数*/
	-webkit-animation-delay: 0s; /*延迟时间*/
}

.nextPage {
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

.nextPage .down {
	margin: auto;
	height: 4vh;
	width: 4vw;
	background-image: url(/build/static/image/common/down.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.questionBox {
	display: inline-flex;
	margin: auto;
	position: fixed;
	left: 0;
	width: 62vw;
	/* top: 0; */
	bottom: 0;
	right: 0;
}

.questionBox div {
	width: 30vw;
	height: 8vh;
	margin: auto;
	display: inline-block;
}

.questionBox div.comment {
	margin-right: 20upx;
	background-image: url(/build/static/image/common/goComent2x.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.questionBox div.share {
	margin-left: 20upx;
}

.payBox {
	margin: auto;
	position: fixed;
	left: 0;
	width: 62vw;
	/* top: 0; */
	bottom: 10upx;
	right: 0;
}

.payBox div {
	color: #fff;
	text-align: center;
	font-size: 1.2em;
	border-radius: 20upx;
	font-weight: bold;
	padding: 10upx;
	width: 55vw;
	height: 6vh;
	margin: auto;
	display: inline-block;
}

.payBox div.pay {
	background-image: url(/build/static/image/common/goPay.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}
</style>
