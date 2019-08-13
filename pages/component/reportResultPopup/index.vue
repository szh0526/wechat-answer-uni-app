<template>
	<view v-show="show" class="reportPopup">
		<div class="masker" catchtouchmove="ture"></div>
		<div class="showMsg">
			<div class="begin">
				<!-- <p>亲爱的家长朋友,</p>
				<p>您已经成功完成了儿童喂养方式评估专业测试。</p>
				<p style="font-weight: bold;font-size: 1.1em;">本报告将由三部分给您进行全面的现状分析及面临问题的科学指导建议 :</p>
				<ul>
					<li><p>您当前在孩子喂养方面的方式正确吗? (初步全面诊断)</p></li>
					<li><p>哪些环节是做的好的、哪些环节是需要马上改善的?</p></li>
					<li><p>针对面临的问题,如何具体做最有效?</p></li>
				</ul> -->

				<!-- <rich-text :nodes="report_introduce_content"></rich-text> -->
				<rich-text :nodes="first"></rich-text>
				<rich-text :nodes="second"></rich-text>
				<rich-text :nodes="third"></rich-text>
				<view v-if="showPay">
					<view class="questionBox">
						<div class="submit" style="width:65%" @click="handlePay">支付{{payAmount}}查看报告</div>
						<div class="submit" style="width:35%" @click="handleFree">免费查看</div>
					</view>
				</view>
				<view v-if="!showPay">
					<div class="goButton" @click="handleGo">好的，GO!</div>
				</view>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		name: 'report-result-popup',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			initUserQuestionsPayInfo: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				first: "",
				second: "",
				third: "",
				report_introduce_content: "",
				showPay: false,
				payAmount: 0,
			};
		},
		mounted: function(option) {
			const {
				payAmount
			} = this.initUserQuestionsPayInfo;
			this.$store
				.dispatch('getUserReportPage', {})
				.then(data => {
					const {
						first,
						second,
						third,
						report_introduce_content,
						must_pay
					} = data;
					this.first = `<p>${first}</p>`;
					this.second = `<p style='font-weight: bold;font-size: 1.1em;'>${second}</p>`;
					this.third = `<p><br>${third}</p>`;
					this.report_introduce_content = report_introduce_content;
					this.payAmount = payAmount;
					this.showPay = must_pay == 1;
				})
				.catch(e => {
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					});
				});
		},
		//监听页面卸载
		onUnload() {},
		computed: {},
		methods: {
			handlePay: function() {
				const _self = this;
				_self.$store
					.dispatch('getUserPayAmountInfo', {})
					.then(data => {
						if (_self.$wechat && _self.$wechat.isWechat()) {
							_self.$wechat.pay(() => {
								//支付完直接跳转
								_self.handleGo();
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
			handleFree: function() {
				window.document.title = '妈妈测';
				const url = this.$pageConfig[7];
				uni.navigateTo({
					url
				});
			},
			handleGo: function() {
				const _self = this;
				this.$store
					.dispatch('createUserReport', {})
					.then(data => {
						window.document.title = '个人测评报告';
						const url = _self.$pageConfig[4];
						uni.navigateTo({
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
			}
		},
		components: {}
	};
</script>
<style>
	.reportPopup {}

	.reportPopup .masker {
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

	.reportPopup .showMsg {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 4vh;
		top: 0;
		margin: auto;
		height: 90vh;
		width: 91vw;
		background-image: url(/build/static/image/common/report2x.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		z-index: 9999;
	}

	.reportPopup .goButton {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 3vh;
		margin: auto;
		height: 8vh;
		width: 65vw;
		background-image: url(/build/static/image/common/redbutton.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		z-index: 9999;
		font-size: 1.3em;
		line-height: 8vh;
		letter-spacing: 2px;
		border-radius: 5px;
		text-align: center;
		color: #fff;
	}

	.reportPopup .goButton:active {
		/* 	opacity: 0.4; */
	}

	.reportPopup .begin {
		padding: 15px;
		font-size: 1em;
		color: #75737c;
		background-color: #fff;
		position: relative;
		left: 0;
		right: 0;
		bottom: 0;
		top: 29vh;
		margin: auto;
		height: 50vh;
		width: 71vw;
		overflow: hidden;
		overflow-y: auto;
		border-radius: 10px;
		box-shadow: 0 6px 10px #ccc;
	}

	.reportPopup .begin p {}

	.reportPopup .begin ul {
		list-style-type: upper-roman;
		padding: 20px 10px 10px 20px;
	}

	.reportPopup .begin ul>li {
		margin-left: 0;
		margin-bottom: 1vh;
	}

	.reportPopup .begin .part1 {
		height: 8vh;
		width: 17vw;
		background-image: url(/build/static/image/common/part1.png);
		background-repeat: no-repeat;
		background-size: 88% 46%;
	}

	.reportPopup .begin .part2 {
		height: 8vh;
		width: 17vw;
		background-image: url(/build/static/image/common/part2.png);
		background-repeat: no-repeat;
		background-size: 88% 46%;
	}

	.reportPopup .begin .part3 {
		height: 8vh;
		width: 17vw;
		background-image: url(/build/static/image/common/part3.png);
		background-repeat: no-repeat;
		background-size: 88% 46%;
	}

	.reportPopup .questionBox {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 3vh;
		margin: auto;
		display: inline-flex;
		width: 80vw;
		text-align: center;
		margin-left: 10%;
		margin-right: 10%;
		/* margin: auto;
	position: fixed;
	left: 0;
	bottom: 1vh;
	right: 0; */
	}

	.reportPopup .questionBox div {
		width: 32vw;
		margin: auto;
		display: inline-block;
	}

	.reportPopup .questionBox div.submit {
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

	.reportPopup .questionBox div.share {}
</style>
