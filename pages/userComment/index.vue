<template>
	<view class="uni-flex uni-column">
		<view class="flex-item flex-item-V" style="background: #FFFFFF;">
			<div class="title">
				<view class="cu-avatar lg radius" :style="[{backgroundImage:'url(' + titleImg + ')' }]"></view>
				<text>{{ title }}</text>
			</div>
		</view>
		<view class="flex-item flex-item-V" style="background: #FFFFFF;">
			<div class="evaluation">
				<view class="flex-item tip"><text>该评测对你有帮助吗?</text></view>
				<view class="score">
					<text>题目易用性</text>
					<uni-rate max="5" :value="easyuseScore" @change="onRateChange('easyuseScore', $event)"></uni-rate>
				</view>
				<view class="score">
					<text>结果准确性</text>
					<uni-rate max="5" :value="accuracyScore" @change="onRateChange('accuracyScore', $event)"></uni-rate>
				</view>
				<view class="score">
					<text>建议实用性</text>
					<uni-rate max="5" :value="practicabilityScore" @change="onRateChange('practicabilityScore', $event)"></uni-rate>
				</view>
			</div>
		</view>
		<view class="flex-item flex-item-V" style="margin-top: 40upx;">
			<view class="uni-textarea"><textarea :value="commentStr" @blur="bindTextAreaBlur" placeholder="说说你的反馈建议" maxlength="150" style="height:550upx;" /></view>
		</view>
		<view v-if="showSubmit"><button hover-class="none" :loading="loadingSubmit" :disabled="disableSubmit" class="fixedBottomBtn" @click="handleSubmit">提交</button></view>
		<view v-if="showShare"><button hover-class="none" class="fixedBottomBtn" @click="handleShare">去分享</button></view>
	</view>
</template>

<script>
import uniRate from '../../components/uni-rate/uni-rate.vue';
export default {
	data() {
		return {
			showShare: false,
			showSubmit: false,
			disableSubmit: false,
			loadingSubmit: false,
			accuracyScore: '',
			practicabilityScore: '',
			easyuseScore: '',
			title: '',
			titleImg: '',
			commentStr: ''
		};
	},
	//监听页面加载
	onLoad: function(option) {
		const _self = this;
		this.$store.commit('setCurrentPage', 'userComment');
		const { is_comment, title, titleImg } = this.$store.state.initUserQuestionsPayInfo;
		this.showSubmit = is_comment == 0 ? true : false; //是否评论 0-未评论,1-已评论
		this.showShare = is_comment == 1 ? true : false;
		this.title = title;
		this.titleImg = titleImg;

		//已评论的调用接口请求数据
		if (is_comment == 1) {
			uni.showLoading({
				title: '加载中...'
			});
			this.$store
				.dispatch('getUserComment', {})
				.then(data => {
					const { accuracyScore, practicabilityScore, easyuseScore, commentStr } = data;
					_self.accuracyScore = accuracyScore;
					_self.practicabilityScore = practicabilityScore;
					_self.easyuseScore = easyuseScore;
					_self.commentStr = commentStr;
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
		}
	},
	methods: {
		bindTextAreaBlur: function(e) {
			this.commentStr = e.detail.value;
		},
		onRateChange: function(type, event) {
			this[type] = event.value;
		},
		handleShare: function() {
			window.document.title = "分享测评";
			const url = this.$pageConfig[6];
			uni.navigateTo({ url });
		},
		handleSubmit: function() {
			const _self = this;
			const { accuracyScore, practicabilityScore, easyuseScore, commentStr } = this;

			if (!easyuseScore) {
				uni.showToast({
					icon: 'none',
					title: '请对题目易用性进行评分!',
					duration: 2000
				});
				return;
			}
			if (!accuracyScore) {
				uni.showToast({
					icon: 'none',
					title: '请对结果准确性进行评分!',
					duration: 2000
				});
				return;
			}
			if (!practicabilityScore) {
				uni.showToast({
					icon: 'none',
					title: '请对建议实用性进行评分!',
					duration: 2000
				});
				return;
			}
			if (!commentStr) {
				uni.showToast({
					icon: 'none',
					title: '请填写反馈建议!',
					duration: 2000
				});
				return;
			}
			this.disableSubmit = true;
			this.loadingSubmit = true;

			this.$store
				.dispatch('saveUserComment', {
					accuracyScore,
					practicabilityScore,
					easyuseScore,
					commentStr
				})
				.then(data => {
					setTimeout(function() {
						_self.loadingSubmit = false;
						_self.handleShare();
					}, 1000);
				})
				.catch(e => {
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					});
				});
		},
		imageError: function(e) {
			console.error('image发生error事件，携带值为' + e.detail.errMsg);
		}
	},
	components: {
		uniRate
	}
};
</script>

<style>
.title {
	height: 80upx;
	margin: 0 30upx 0 30upx;
	padding: 30upx 0;
	border-bottom: 1upx solid #dcdcdc;
}

.title uni-text {
	font-size: 18px;
	font-weight: 500;
/* 	float: left; */
	line-height: 96upx;
	margin-left: 40upx;
}

.evaluation {
	margin: 0 30upx 0 30upx;
	padding: 30upx 0;
}

.evaluation .tip {
	display: block;
	font-weight: 400;
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

.evaluation .score {
	margin: 10upx 0;
}

.logoContainer {
	box-sizing: border-box;
	width: 80upx;
	height: 80upx;
	float: left;
	background: #4c4b58;
	/* border: 0.02667rem solid #fff; */
	overflow: hidden;
	margin-right: 30upx;
}
</style>
