<template>
	<view class="uni-flex uni-column commentWrap">
		<view class="flex-item flex-item-V">
			<div class="userinfo">
				<div class="info">
					<text style="font-size: 1.2em;">{{ title }}</text>
					<text style="font-size: 1.2em;">{{ name }}</text>
					<text>{{ date }}</text>
				</div>
				<div class="img"><view class="cu-avatar lg round" :style="[{ margin: '26upx' }, { backgroundImage: 'url(' + img + ')' }]"></view></div>
			</div>
			<div class="evaluation">
				<view class="score">
					<text>题目易用性</text>
					<uni-rate max="5" :value="easyuseScore" @change="onRateChange('easyuseScore', $event)" color="#cecece" activeColor="#f5aa4c" margin="10"></uni-rate>
				</view>
				<view class="score">
					<text>结果准确性</text>
					<uni-rate max="5" :value="accuracyScore" @change="onRateChange('accuracyScore', $event)" color="#cecece" activeColor="#f5aa4c" margin="10"></uni-rate>
				</view>
				<view class="score" style="border-bottom-width: 0;">
					<text>建议实用性</text>
					<uni-rate max="5" :value="practicabilityScore" @change="onRateChange('practicabilityScore', $event)" color="#cecece" activeColor="#f5aa4c" margin="10"></uni-rate>
				</view>
				<view class="uni-textarea">
					<textarea :value="commentStr" @blur="bindTextAreaBlur" @input="bindTextAreaInput" placeholder="请留下您的反馈意见" maxlength="200" />
					<div class="tip">剩余 {{ remainCount }} 字</div>
				</view>
				<view class="questionBox">
					<view v-if="showSubmit">
						<div
							class="submit"
							:style="{
								'pointer-events': disableSubmit ? 'none' : '',
								'background-image': 'url(/build/static/image/common/' + (disableSubmit ? 'disableSubmit2x' : 'submit2x') + '.png)'
							}"
							@click="handleSubmit"
						/>
					</view>
					<view v-if="true"><wx-share-button title="去分享" /></view>
				</view>
			</div>
		</view>
	</view>
</template>

<script>
import uniRate from '../../components/uni-rate/uni-rate.vue';
import wxShareButton from '../component/wxShareButton/index.vue';
export default {
	data() {
		return {
			showSubmit: false,
			disableSubmit: false,
			accuracyScore: '',
			practicabilityScore: '',
			easyuseScore: '',
			title: '',
			name: '',
			img: '',
			date: '',
			commentStr: '',
			remainCount: 200
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
		const _self = this;
		this.$store.commit('setCurrentPage', 'userComment');
		const { is_comment, title, userinfo } = initUserQuestionsPayInfo;
		this.showSubmit = true; //是否评论 0-未评论,1-已评论
		this.disableSubmit = is_comment == 1 ? true : false; //已评论过的禁用按钮
		this.title = title;
		this.name = userinfo.name;
		this.img = userinfo.img;
		this.date = userinfo.date;

		//已评论的调用接口请求数据
		if (is_comment == 1) {
			this.$store
				.dispatch('getUserComment', {})
				.then(data => {
					const { accuracyScore, practicabilityScore, easyuseScore, commentStr } = data;
					_self.accuracyScore = accuracyScore;
					_self.practicabilityScore = practicabilityScore;
					_self.easyuseScore = easyuseScore;
					_self.commentStr = commentStr;
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
	methods: {
		bindTextAreaBlur: function(e) {
			const value = e.detail.value;
			this.commentStr = value;
		},
		bindTextAreaInput: function(e) {
			const value = e.detail.value;
			this.remainCount = 200 - value.length;
		},
		onRateChange: function(type, event) {
			this[type] = event.value;
		},
		handleSubmit: function() {
			const _self = this;
			const { accuracyScore, practicabilityScore, easyuseScore, commentStr } = this;

			if (!easyuseScore) {
				uni.showToast({
					icon: 'none',
					title: '请对题目易用性进行评分!',
					duration: 1000
				});
				return;
			}
			if (!accuracyScore) {
				uni.showToast({
					icon: 'none',
					title: '请对结果准确性进行评分!',
					duration: 1000
				});
				return;
			}
			if (!practicabilityScore) {
				uni.showToast({
					icon: 'none',
					title: '请对建议实用性进行评分!',
					duration: 1000
				});
				return;
			}
			if (!commentStr) {
				uni.showToast({
					icon: 'none',
					title: '请填写反馈意见!',
					duration: 1000
				});
				return;
			}

			this.$store
				.dispatch('saveUserComment', {
					accuracyScore,
					practicabilityScore,
					easyuseScore,
					commentStr
				})
				.then(data => {
					_self.disableSubmit = true;
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
		uniRate,
		wxShareButton
	}
};
</script>

<style>
.commentWrap {
	height: 100vh;
	width: 100vw;
	background-image: url(/build/static/image/common/coment.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.userinfo {
	height: 17vh;
	margin: 0 30upx 0 30upx;
	padding: 30upx 0;
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

.evaluation {
	padding: 32upx 16upx 40upx 16upx;
	margin: auto;
	height: 66vh;
	width: 88vw;
	color: #78747e;
	font-size: 1em;
	background-color: #fcffff;
	overflow: hidden;
	overflow-y: auto;
	border-radius: 20upx;
	box-shadow: 0 12upx 20upx #ccc;
}

.evaluation uni-view {
	display: inline-flex;
}

.evaluation .score > uni-text {
	float: left;
	line-height: 60upx;
	margin-right: 60upx;
}

.evaluation .score {
	margin-bottom: 10px;
	padding: 3px 15px 8px 15px;
	width: 100%;
	border-bottom: 1px solid #e1e1e1;
}

.evaluation .uni-textarea {
	position: relative;
	padding: 10upx;
	height: 37vh;
	background-color: #d6f7f7;
	border-radius: 10upx;
}
.evaluation .uni-textarea uni-textarea {
	height: 100%;
}

.evaluation .uni-textarea .tip {
	bottom: 20upx;
	position: absolute;
	right: 28upx;
}

.cu-avatar.lg {
	width: 23vw;
	height: 15vh;
}

.evaluation .questionBox {
	margin: auto;
	position: absolute;
	left: 0;
	width: 62vw;
	/* top: 0; */
	bottom: 30upx;
	right: 0;
}

.evaluation .questionBox div {
	width: 30vw;
	height: 8vh;
	margin: auto;
	display: inline-block;
}

.evaluation .questionBox div.submit {
	margin-right: 20upx;
	background-image: url(/build/static/image/common/submit2x.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.evaluation .questionBox div.share {
	margin-left: 20upx;
}
</style>
