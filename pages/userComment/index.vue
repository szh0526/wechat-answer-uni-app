<template>
	<view class="uni-flex uni-column commentWrap">
		<view class="flex-item flex-item-V">
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
			<div class="evaluation">
				<view class="score">
					<text>题目易用性</text>
					<uni-rate max="5" :value="easyuseScore" @change="onRateChange('easyuseScore', $event)" color="#cecece" activeColor="#f5aa4c"
					 margin="10"></uni-rate>
				</view>
				<view class="score">
					<text>结果准确性</text>
					<uni-rate max="5" :value="accuracyScore" @change="onRateChange('accuracyScore', $event)" color="#cecece"
					 activeColor="#f5aa4c" margin="10"></uni-rate>
				</view>
				<view class="score" style="border-bottom-width: 0;">
					<text>建议实用性</text>
					<uni-rate max="5" :value="practicabilityScore" @change="onRateChange('practicabilityScore', $event)" color="#cecece"
					 activeColor="#f5aa4c" margin="10"></uni-rate>
				</view>
				<view class="uni-textarea">
					<textarea :value="commentStr" @blur="bindTextAreaBlur" @input="bindTextAreaInput" placeholder="请留下您的反馈意见"
					 maxlength="200" />
					<div class="tip">剩余 {{ remainCount }} 字</div>
				</view>
			</div>
		</view>
		<view class="flex-item flex-item-V">
			<view class="questionBox">
				<view v-if="showSubmit">
					<div
						class="submit"
						:style="{
							'pointer-events': disableSubmit ? 'none' : ''
						}"
						@click="handleSubmit"
					>提交</div>
				</view>
				<view v-if="true"><wx-share-button title="分享给朋友" /></view>
			</view>
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
	//监听页面初次渲染完成
	onReady() {
		uni.hideTabBar({})
	},
	//监听页面加载
	onLoad: function(option) {
		const { initUserQuestionsPayInfo } = this.$store.state;
		if (Object.prototype.toString.call(initUserQuestionsPayInfo) !== '[object Object]') {
			//当全局接口数据为空时 返回首页
			const url = this.$pageConfig[7];
			uni.navigateTo({ url });
			return;
		}
		//监听窗口大小变化事件 解决弹出软键盘时页面错乱
		window.addEventListener('resize', function() {
			if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
				document.activeElement.scrollIntoView({ behavior: 'smooth' });
			}
		});

		const _self = this;
		this.$store.commit('setCurrentPage', 'userComment');
		const { is_comment, title, userinfo } = initUserQuestionsPayInfo;
		this.showSubmit = true; //is_comment == 1 ? true : false; //是否评论 0-未评论,1-已评论
		//this.disableSubmit = is_comment == 1 ? true : false; //已评论过的禁用按钮
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
		// 解决苹果不回弹页面 解决弹出软键盘时页面错乱
		blurAdjust: function(e) {
			setTimeout(() => {
				if (document.activeElement.tagName !== 'INPUT' || document.activeElement.tagName !== 'TEXTAREA') {
					return;
				}
				let result = 'pc';
				if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
					//判断iPhone|iPad|iPod|iOS
					result = 'ios';
				} else if (/(Android)/i.test(navigator.userAgent)) {
					//判断Android
					result = 'android';
				}

				if ((result = 'ios')) {
					document.activeElement.scrollIntoViewIfNeeded(true);
				}
			}, 100);
		},
		bindTextAreaBlur: function(e) {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
			if (isIOS) {
				this.blurAdjust();
			}
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
			
			_self.disableSubmit = true;

			this.$store
				.dispatch('saveUserComment', {
					accuracyScore,
					practicabilityScore,
					easyuseScore,
					commentStr
				})
				.then(data => {
					_self.disableSubmit = false;
					uni.showToast({
						icon: 'none',
						title: "提交成功!",
						duration: 1000
					});
				})
				.catch(e => {
					_self.disableSubmit = false;
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
	color: #fff;
	height: 19vh;
	width: 100%;
	padding: 2vh 0;
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

.evaluation {
	padding: 16px 8px 20px 8px;
	margin: auto;
	height: 330px;
	/* height: 60vh; */
	width: 88vw;
	color: #78747e;
	font-size: 1em;
	background-color: #fcffff;
	overflow: hidden;
	overflow-y: auto;
	border-radius: 10px;
	box-shadow: 0 6px 10px #ccc;
}

.evaluation uni-view {
	display: inline-flex;
}

.evaluation .score > uni-text {
	float: left;
	line-height: 30px;
	margin-right: 4vh;
}

.evaluation .score {
	height: 38px;
	font-size: 1.1em;
	margin-bottom: 10px;
	padding: 3px 15px 8px 15px;
	width: 100%;
	border-bottom: 1px solid #e1e1e1;
}

.evaluation .uni-textarea {
	position: relative;
	padding: 5px;
	height: 195px;
	/* height: 34vh; */
	background-color: #d6f7f7;
	border-radius: 5px;
}
.evaluation .uni-textarea uni-textarea {
	height: 100%;
}

.evaluation .uni-textarea .tip {
	bottom: 10px;
	position: absolute;
	right: 14px;
}

.questionBox {
	display: inline-flex;
	width: 70vw;
	text-align: center;
	margin-left: 15%;
	margin-right: 15%;
	/* margin: auto;
	position: fixed;
	left: 0;
	bottom: 1vh;
	right: 0; */
}

.questionBox div {
	width: 32vw;
	margin: auto;
	display: inline-block;
}

.questionBox div.submit {
	margin: 10px 0 5px 0;
	background-image: url(/build/static/image/common/buttonbg.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;    
	font-size: 1.2em;
	height: 7vh;
	line-height: 7vh;
	letter-spacing:2px;
	border-radius: 5px;
	text-align: center;
	color: #fff;
}

.questionBox div.share {
}
</style>
