<template>
	<view class="uni-flex uni-column answerquestion">
		<view class="flex-item flex-item-V">
			<div class="headWrap">
				<view class="flex p-xs mb-sm" style="padding-top:80upx;">
					<view class="flex total">
						<text>{{ qid }}/{{ total }}</text>
					</view>
					<view class="flex-twice" style="padding-top: 26upx;">
						<view class="cu-progress striped radius"><view class="bg-white" :style="[{ width: percent + '%' }]"></view></view>
					</view>
					<view class="flex" style="padding: 26upx 36upx 0 20upx">
						<!-- <view class="cu-item" style="margin-right: 10upx;"><text class="lg text-gray cuIcon-time"></text></view> -->
						<text>{{ timeStr }}</text>
						<!-- <view class="cu-item" style="margin-left: 20upx;" v-if="0"><text class="lg text-gray cuIcon-question"></text></view> -->
					</view>
				</view>
				<p>您经常在孩子就餐的时候做以下事情吗?</p>
			</div>
		</view>
		<view class="flex-item flex-item-V">
			<div class="evaluation">
				<view class="flex-item tip">
					<p class="qtitle">{{ question_str }}</p>
					<p class="example">{{ example_str }}</p>
				</view>
				<view class="uni-list">
					<radio-group @change="onAnswerChange">
						<view v-for="(item, index) in items" :key="index">
							<ol>
								<li class="uni-list-cell" :style="{ background: item.background }">
									<view style="margin-left: 30upx;font-size: 32upx;">{{ item.sortDesc }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.name }}</view>
									<view><radio color="#ff6671" :value="item.value" :checked="item.checked" /></view>
								</li>
							</ol>
						</view>
					</radio-group>
				</view>
			</div>
		</view>
		<view class="flex-item flex-item-V">
			<view class="questionBox">
				<div @click="handlePrevQuestion"></div>
				<div @click="handleNextQuestion"></div>
			</view>
		</view>
		<view><report-result-popup :show="showReport" /></view>
	</view>
</template>

<script>
import uniRate from '../../components/uni-rate/uni-rate.vue';
import reportResultPopup from '../component/reportResultPopup/index.vue';
import { dateUtils } from '../../common/util.js';

const colors = {
	1: {
		color: '#f696ad',
		sortDesc: 'A、'
	},
	2: {
		color: '#f799a2',
		sortDesc: 'B、'
	},
	3: {
		color: '#f6928d',
		sortDesc: 'C、'
	},
	4: {
		color: '#f6847f',
		sortDesc: 'D、'
	},
	5: {
		color: '#f1786c',
		sortDesc: 'E、'
	}
};
export default {
	data() {
		return {
			qid: 0,
			currentQuestionId: 0,
			answersId: 0,
			question_str: '', //问题描述
			example_str: '', //举例描述
			items: [],
			total: 0,
			percent: 0,
			timer: null,
			timeStr: '00:00',
			countDownTime: '',
			cellBackground: '#fff',
			showReport: false
		};
	},
	//监听页面加载
	onLoad: function(option) {
		const { initUserQuestionsPayInfo } = this.$store.state;
		if (Object.prototype.toString.call(initUserQuestionsPayInfo) !== '[object Object]') {
			//当全局接口数据为空时 返回首页
			const url = this.$pageConfig[0];
			uni.redirectTo({ url });
			return;
		}

		this.$store.commit('setCurrentPage', 'answerQuestion');
		const { question_id, countDownTime } = initUserQuestionsPayInfo;
		this.currentQuestionId = question_id;
		this.countDownTime = countDownTime || '';
		this.timerun(countDownTime);
		//初始化先获取上一题
		this.getNextQuestion();
	},
	destroyed: function() {
		clearInterval(this.timer);
	},
	methods: {
		timerun: function(initTime) {
			const _self = this;
			var isInit = false;
			_self.timer = setInterval(function() {
				var date = null;
				if (!isInit) {
					if (initTime) {
						date = new Date(initTime);
					} else {
						date = new Date();
						date.setHours(0);
						date.setMinutes(0);
						date.setSeconds(0);
					}
					isInit = true;
				} else {
					date = new Date(_self.countDownTime);
					var hour = date.getHours();
					var minutes = date.getMinutes();
					var sec = date.getSeconds();
					sec++;
					if (sec > 0 && sec % 60 == 0) {
						sec = 0;
						minutes = minutes + 1;
					}
					if (minutes > 0 && minutes % 60 == 0) {
						minutes = 0;
						hour = hour + 1;
					}
					if (hour > 0 && hour % 24 == 0) {
						sec = 0;
						minutes = 0;
						hour = 0;
					}
					date.setHours(hour);
					date.setMinutes(minutes);
					date.setSeconds(sec);
				}
				_self.timeStr = dateUtils.formatTimeToStr(date);
				_self.countDownTime = date.toString();
			}, 1000);
		},
		getPrevQuestion: function() {
			const _self = this;
			// uni.showLoading({
			// 	title: '加载中...'
			// });
			this.$store
				.dispatch('getPreviousQuestion', {
					currentQuestionId: this.currentQuestionId,
					answersId: this.answersId
				})
				.then(data => {
					//uni.hideLoading();
					const { question, answer, total } = data;
					_self.total = total;
					_self.percent = (question.qid / total) * 100;
					_self.qid = question.qid;
					_self.currentQuestionId = question.id;
					_self.question_str = question.question_str;
					_self.example_str = question.example_str;

					_self.items = !!answer
						? answer.map(x => {
								if (x.isCheck) {
									_self.answersId = x.id;
								}
								return {
									value: String(x.id),
									name: x.answer_str,
									background: colors[x.sort_code].color || colors['1'].color,
									sortDesc: colors[x.sort_code].sortDesc || colors['1'].sortDesc,
									checked: !!x.isCheck
								};
						  })
						: [];
				})
				.catch(e => {
					//uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					});
				});
		},
		getNextQuestion: function() {
			const _self = this;
			// uni.showLoading({
			// 	title: '加载中...'
			// });
			this.$store
				.dispatch('getNextQuestion', {
					currentQuestionId: this.currentQuestionId,
					answersId: this.answersId,
					countDownTime: this.countDownTime
				})
				.then(data => {
					//调用完接口清空选项
					this.answersId = null;
					
					// uni.hideLoading();
					if (data.isEnd == 1) {
						this.showReport = true;
					} else {
						const { question, answer, total } = data;
						_self.total = total;
						_self.percent = (question.qid / total) * 100;
						_self.qid = question.qid;
						_self.currentQuestionId = question.id;
						_self.question_str = question.question_str;
						_self.example_str = question.example_str;
						_self.items = !!answer
							? answer.map(x => {
									if (x.isCheck) {
										_self.answersId = x.id;
									}
									return {
										value: String(x.id),
										name: x.answer_str,
										background: colors[x.sort_code].color || colors['1'].color,
										sortDesc: colors[x.sort_code].sortDesc || colors['1'].sortDesc,
										checked: !!x.isCheck
									};
							  })
							: [];
					}
				})
				.catch(e => {
					// uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					});
				});
		},
		onAnswerChange: function(event) {
			this.answersId = event.target.value;
		},
		handlePrevQuestion: function() {
			this.items = [];
			this.getPrevQuestion();
		},
		handleNextQuestion: function() {
			if(this.answersId == null){
				uni.showToast({
					icon: 'none',
					title: "请选择一个选项!",
					duration: 1000
				});
				return;
			}
			this.items = [];
			this.getNextQuestion();
		}
	},
	computed: {},
	components: {
		reportResultPopup,
		uniRate
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

.headWrap {
	color: #fff;
	height: 22vh;
	width: 100%;
	background-image: url(/build/static/image/common/userInfo.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.headWrap .total {
	font-size: 1.2em;
	padding: 20upx 48upx 12upx 48upx;
	color: #ff6671;
	background-image: url(/build/static/image/common/total2x.png);
	background-repeat: no-repeat;
	background-size: 86% 100%;
}

.headWrap .cu-progress {
	border: 4upx solid #f1f1f1;
	border-radius: 10upx;
	background-color: unset;
}

.headWrap p {
	margin: 6upx 84upx 20upx 90upx;
	font-size: 15px;
}

.answerquestion {
	height: 100vh;
	background: #ffffff;
}
.title {
	height: 80upx;
	margin: 0 30upx 0 30upx;
	padding: 30upx 0;
	border-bottom: 1upx solid #dcdcdc;
}

.title uni-text {
	font-size: 18px;
	font-weight: 500;
	float: left;
	line-height: 80upx;
	margin-right: 40upx;
}

.evaluation {
	margin: 0upx 20upx 0 20upx;
	padding: 20upx 0 30upx 0;
	-webkit-animation-name: fadeIn; /*动画名称*/
	-webkit-animation-duration: 1500ms; /*动画持续时间*/
	-webkit-animation-iteration-count: 1; /*动画次数*/
	-webkit-animation-delay: 0s; /*延迟时间*/
}

.evaluation .tip {
	text-align: center;
	display: block;
	/* margin-bottom: 10upx; */
}

.evaluation .qtitle {
	color: #787380;
	font-size: 1.2em;
	margin: 0 40upx 0 40upx;
}

.evaluation .example {
	color: #38b6c0;
	font-size: 1.05em;
}

.evaluation uni-view {
	display: inline-flex;
}

.evaluation .score > uni-text {
	font-size: 14px;
	float: left;
	line-height: 50upx;
	margin-right: 40upx;
}

.uni-list-cell {
	font-size: 14px;
	color: #fff;
	width: 82vw;
	height: 3vh;
	padding: 30upx;
	border-radius: 22upx;
	margin: 18upx 18upx 0px 18upx;
}

.uni-list ol {
	margin-top: 10upx;
	padding-inline-start: 0px;
}

.uni-list::before {
	left: unset;
}
.uni-list::after {
	left: unset;
}
.uni-list-cell::after {
	left: unset;
}
.fixedLeftBtn {
	display: inline-block;
	position: fixed;
	bottom: 10px;
	left: 25%;
}
.fixedRightBtn {
	display: inline-block;
	position: fixed;
	right: 25%;
	bottom: 10px;
}

.countdown {
	padding: 10upx;
	border-bottom: 2upx solid #d3d3d3;
	box-shadow: 4upx 0 14upx -2upx #d3d3d3;
}

.questionBox {
	margin: 5upx;
	text-align: center;
}

.questionBox div {
	display: inline-block;
	height: 8vh;
	width: 22vw;
}

.questionBox div:active {
	opacity: 0.4;
}

.questionBox div:first-child {
	margin-right: 100upx;
	background-image: url(/build/static/image/common/prevQuestion.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.questionBox div:last-child {
	margin-left: 100upx;
	background-image: url(/build/static/image/common/nextQuestion.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}
</style>
