<template>
	<view class="uni-flex uni-column answerquestion">
		<view class="flex-item flex-item-V">
			<view class="countdown">
				<view class="flex p-xs mb-sm">
					<view class="flex" style="padding: 10upx 20upx 0 20upx;">
						<text>
							<b style="font-size: 1.2em;">{{ qid }}</b>
							/{{ total }}
						</text>
					</view>
					<view class="flex-twice" style="padding-top: 24upx;">
						<view class="cu-progress striped radius"><view class="bg-yellow" :style="[{ width: percent + '%' }]"></view></view>
					</view>
					<view class="flex padding-sm">
						<view class="cu-item" style="margin-right: 10upx;"><text class="lg text-gray cuIcon-time"></text></view>
						<text>{{ timeStr }}</text>
						<view class="cu-item" style="margin-left: 20upx;" v-if="0"><text class="lg text-gray cuIcon-question"></text></view>
					</view>
				</view>
			</view>
		</view>
		<view class="flex-item flex-item-V">
			<div class="evaluation">
				<view class="flex-item tip">
					<text>{{ question_str }}</text>
				</view>
				<view class="uni-list">
					<radio-group @change="onAnswerChange">
						<label class="uni-list-cell" v-for="(item, index) in items" :key="index">
							<view>{{ item.name }}</view>
							<view><radio :value="item.value" :checked="item.checked" /></view>
						</label>
					</radio-group>
				</view>
			</div>
		</view>
		<view v-if="1">
			<button hover-class="none" type="primary" class="fixedLeftBtn" @click="handlePrevQuestion">上一题</button>
			<button hover-class="none" type="primary" class="fixedRightBtn" @click="handleNewxQuestion">下一题</button>
		</view>
	</view>
</template>

<script>
import uniRate from '../../components/uni-rate/uni-rate.vue';
import { dateUtils } from '../../common/util.js';
export default {
	data() {
		return {
			qid:0,
			currentQuestionId: 0,
			answersId: 0,
			question_str: '', //问题描述
			items: [],
			total: 0,
			percent: 0,
			timer: null,
			timeStr: '00:00',
			countDownTime: ''
		};
	},
	//监听页面加载
	onLoad: function(option) {
		this.$store.commit('setCurrentPage', 'answerQuestion');
		const { question_id, countDownTime } = this.$store.state.initUserQuestionsPayInfo;
		this.currentQuestionId = question_id;
		this.countDownTime = countDownTime || "";
		this.timerun(countDownTime);
		//初始化先获取上一题
		this.getPrevQuestion();
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
			uni.showLoading({
				title: '加载中...'
			});
			this.$store
				.dispatch('getPreviousQuestion', {
					currentQuestionId: this.currentQuestionId,
					answersId: this.answersId
				})
				.then(data => {
					uni.hideLoading();
					const { question, answer, total } = data;
					_self.total = total;
					_self.percent = (question.qid / total) * 100;
					_self.qid = question.qid;
					_self.currentQuestionId = question.id;
					_self.question_str = question.question_str;
					_self.items = !!answer
						? answer.map(x => {
								if (x.isCheck) {
									_self.answersId = x.id;
								}
								return {
									value: String(x.id),
									name: x.answer_str,
									checked: !!x.isCheck
								};
						  })
						: [];
				})
				.catch(e => {
					uni.hideLoading();
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					});
				});
		},
		getNextQuestion: function() {
			const _self = this;
			uni.showLoading({
				title: '加载中...'
			});
			this.$store
				.dispatch('getNextQuestion', {
					currentQuestionId: this.currentQuestionId,
					answersId: this.answersId,
					countDownTime: this.countDownTime
				})
				.then(data => {
					if(data.isEnd == 1){
						window.document.title = '个人评测报告';
						const url = _self.$pageConfig[3];
						uni.navigateTo({ url });
					}else{
						uni.hideLoading();
						const { question, answer, total } = data;
						_self.total = total;
						_self.percent = (question.qid / total) * 100;
						_self.qid = question.qid;
						_self.currentQuestionId = question.id;
						_self.question_str = question.question_str;
						_self.items = !!answer
							? answer.map(x => {
									if (x.isCheck) {
										_self.answersId = x.id;
									}
									return {
										value: String(x.id),
										name: x.answer_str,
										checked: !!x.isCheck
									};
								})
							: [];
						}
				})
				.catch(e => {
					uni.hideLoading();
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
		handleNewxQuestion: function() {
			this.items = [];
			this.getNextQuestion();
		}
	},
	computed: {},
	components: {
		uniRate
	}
};
</script>

<style>
.answerquestion {
	background: #ffffff;
	height: -webkit-fill-available;
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
	margin: 0 30upx 0 30upx;
	padding: 30upx 0;
}

.evaluation .tip {
	display: block;
	font-weight: 700;
	font-size: 1.17em;
	margin-bottom: 20upx;
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
	padding: 30upx;
	border: 2upx solid #d3d3d3;
	border-radius: 20upx;
	margin: 20upx 0 20upx 0;
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
</style>
