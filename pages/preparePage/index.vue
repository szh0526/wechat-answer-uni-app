<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V">
				<!-- <uni-popup :show="showPopup" type="middle" customClass="popup-wrap" :h5Top="h5Top" mode="fixed" button-mode="right">
					<view class="uni-center center-box" style="height: 92%;">
						<view class="uni-common-mt">
							<div class="html-wrap">
								<div style="margin-top: 10px;margin-bottom: 10px;"><rich-text :nodes="htmlStr"></rich-text></div>
							</div>
						</view>
					</view>
					<view><button class="targetBtn" hover-class="none" type="default" size="default" @click="handleGo">好的,GO!</button></view>
				</uni-popup> -->
				<div class="headWrap"></div>
				<div class="beginTest">
					<ol>
						<li>
							<p>
								测试题一共24题，请尽量在
								<font color="#ff7d77">20</font>
								分钟内完成，否则数据可能无法保存(右上方有时间进度条);
							</p>
						</li>
						<li><p>答案没有对错之分，如实作答即可，若遇到难以抉择的问题，请根据第一感觉作答，你的作答将得到严格保密；</p></li>
						<li><p>如遇电话、死机等导致测试中断，可到公众号找回，系统将保留你的答题记录。</p></li>
					</ol>
					<div class="goButton" @click="handleGo">好的 , GO !</div>
				</div>
			</view>
		</view>
	</view>
</template>

<script>
import uniPopup from '../../components/uni-popup/uni-popup.vue';

export default {
	data() {
		return {
			htmlStr: '',
			h5Top: true,
			showPopup: false
		};
	},
	//监听页面初次渲染完成
	onReady() {},
	//监听页面加载
	onLoad: function(option) {
		this.beginTestHeight = window.document;

		const { initUserQuestionsPayInfo } = this.$store.state;

		if (Object.prototype.toString.call(initUserQuestionsPayInfo) !== '[object Object]') {
			//当全局接口数据为空时 返回首页
			const url = this.$pageConfig[0];
			uni.redirectTo({ url });
			return;
		}

		this.$store.commit('setCurrentPage', 'preparePage');

		this.$store
			.dispatch('getPreparePage', {})
			.then(data => {
				const { prepare_content } = data;
				this.htmlStr = prepare_content || '<h2>测前须知</h2><div>暂无</div>';
				this.showPopup = true;
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
		handleGo: function() {
			const { initUserQuestionsPayInfo } = this.$store.state;
			window.document.title = initUserQuestionsPayInfo.questions_title;
			const url = this.$pageConfig[2];
			uni.redirectTo({ url });
		}
	},
	components: {
		uniPopup
	}
};
</script>
<style>
.headWrap {
	height: 33vh;
	width: 100%;
	background-image: url(/build/static/image/common/chahua.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

.beginTest {
	font-size: 1.1em;
	background-color: #f1f1f1;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 13vh;
	margin: auto;
	height: 60vh;
	width: 87vw;
	border-radius: 10px;
	box-shadow: 0 6px 10px #ccc;
}

.beginTest ol {
	color: #787380;
	padding: 3vh;
	height: -webkit-fill-available;
}

.beginTest ol > li {
	line-height: 4vh;
	margin-left: 25px;
	margin-bottom: 25px;
}

.beginTest ol p {
	letter-spacing: 2px;
}

.goButton {
	position: relative;
	left: 0;
	right: 0;
	bottom: -9px;
	margin: auto;
	height: 8vh;
	width: 71vw;
	background-image: url(/build/static/image/common/redbutton.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	font-size: 1.2em;
	line-height: 8vh;
	letter-spacing:2px;
	border-radius: 5px;
	text-align: center;
	color: #fff;
}

.goButton:active {
	opacity: 0.4;
}
</style>
