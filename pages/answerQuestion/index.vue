<template>
	<view class="uni-flex uni-column answerquestion">
		<view class="flex-item flex-item-V">
			<view class="countdown">
				<view class="flex p-xs mb-sm">
					<view class="flex" style="padding: 10upx 20upx 0 20upx;">
						<text>
							<b style="font-size: 1.2em;">{{ currentQuestionId }}</b>
							/{{ total }}
						</text>
					</view>
					<view class="flex-twice" style="padding-top: 24upx;">
						<view class="cu-progress striped radius"><view class="bg-yellow" :style="[{ width: percent + '%' }]"></view></view>
					</view>
					<view class="flex padding-sm">
						<view class="cu-item" style="margin-right: 10upx;"><text class="lg text-gray cuIcon-time"></text></view>
						<text>24:45</text>
						<view class="cu-item" style="margin-left: 20upx;"><text class="lg text-gray cuIcon-question"></text></view>
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
			<button hover-class="none" type="primary" class="fixedLeftBtn" @click="handleQuestion">上一题</button>
			<button hover-class="none" type="primary" class="fixedRightBtn" @click="handleQuestion">下一题</button>
		</view>
	</view>
</template>

<script>
import uniRate from '../../components/uni-rate/uni-rate.vue';
export default {
	data() {
		return {
			currentQuestionId: 0,
			previousQuestionId: 0,
			answersId: 0,
			question_str: '', //问题描述
			items: [],
			total: 0,
			percent: 0
		};
	},
	//监听页面加载
	onLoad: function(option) {
		this.$store.commit('setCurrentPage', 'answerQuestion');
		const { question_id } = this.$store.state.initUserQuestionsPayInfo;
		this.currentQuestionId = question_id;
		this.getQuestion();
	},
	methods: {
		getQuestion: function() {
			const _self = this;
			//将当前题设置为上一题
			this.previousQuestionId = this.currentQuestionId;
			uni.showLoading({
				title: '加载中...'
			});
			this.$store
				.dispatch('getNextQuestion', {
					currentQuestionId: this.currentQuestionId,
					answersId: this.answersId
				})
				.then(data => {
					const { question, answer, total } = data;
					_self.total = total;
					_self.percent = (question.id / total) * 100;
					_self.currentQuestionId = question.id;
					console.log('当前题', _self.currentQuestionId, '上一题', _self.previousQuestionId);
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
					uni.hideLoading();
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
		handle: function() {
			window.document.title = '个人评测报告';
			const url = this.$pageConfig[6];
			uni.navigateTo({ url });
		},
		// handlePreviousQuestion: function() {
		// 	this.getQuestion();
		// },
		handleQuestion: function() {
			this.getQuestion();
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
