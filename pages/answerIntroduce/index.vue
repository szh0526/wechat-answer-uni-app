<template>
	<view>
		<view class="uni-flex uni-column">
			<view id="has-pay-head" class="flex-item flex-item-V" v-if="questionsId">
				<has-pay-head :questionsId="questionsId" />
			</view>
			<view>
				<scroll-view id="scroll" :scroll-y="scrollable">
					<view v-for="(item, index) in imgList" :key="index">
						<image :src="item.introduce_content" mode="widthFix"></image>
					</view>
				</scroll-view>
			</view>
			<view v-show="showGo">
				<div class="goButton" @click="handleGo">立即测试</div>
			</view>
			<view v-show="showHelp">
				<div class="masker" catchtouchmove="ture"></div>
				<div class="showMsg">
					<div class="qrcode">
						<img :src="qrcode" />
					</div>
					<div class="closeMsg" @click="handleClose"></div>
				</div>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		getQueryString,
		json2ParStr,
		urlParamToObj
	} from '../../common/util.js';
	import hasPayHead from '../component/hasPayHead/hasPayHead.vue';

	export default {
		data() {
			return {
				scrollable: true,
				showGo: false,
				showHelp: false,
				questionsId: null,
				qrcode: '',
				imgList: []
			};
		},
		//监听页面初次渲染完成
		onReady() {
			uni.hideTabBar({})
		},
		onLoad: function(option) {
			const {
				id,
				channel,
				page
			} = option;

			this.questionsId = id;
			this.$store.commit('setCurrentPage', 'answerIntroduce');
			this.$store.commit('setQuestionsId', id);
			this.$store.commit('setPage', page);
			this.initPage();
		},
		onShow: function() {
			//this.initPage();
		},
		//监听页面卸载
		onUnload() {},
		computed: {},
		methods: {
			initPage: function() {
				const _self = this;
				_self.$store
					.dispatch('initUserQuestionsPayInfo', {})
					.then(data => {
						const {
							is_test,
							questions_id,
							user_id,
							is_answered,
							question_id,
							questions_title
						} = data;

						_self.$store.commit('setQuestionsId', questions_id);
						_self.$store.commit('setUserId', user_id);
						_self.$store.commit('initUserQuestionsPayInfo', data);

						const pagesStorage = uni.getStorageSync('push_pages');
						//如果hasPagesStorage 为true则为推送
						const hasPagesStorage = pagesStorage && pagesStorage == '2' ? true : false;

						if (is_test && !is_answered && !question_id && !hasPagesStorage) {
							//0未点测试 1已点测试
							window.document.title = '开始问答';
							const url = _self.$pageConfig[1];
							uni.navigateTo({
								url
							});
						} else if (is_test && is_answered && question_id && !hasPagesStorage) {
							//是否答完 0-没有答完 1-已答完 如果答完题则跳转到报告页第一页
							window.document.title = '个人测评报告';
							const url = _self.$pageConfig[4];
							uni.navigateTo({
								url
							});
						} else if (is_test && !is_answered && question_id && !hasPagesStorage) {
							//question_id > 0 调转到对应题
							window.document.title = questions_title;
							const url = _self.$pageConfig[2];
							uni.navigateTo({
								url
							});
						} else {
							if (hasPagesStorage) {
								//服务号推送的消息 直接跳转任务页
								const url = _self.$pageConfig[7];
								uni.navigateTo({
									url,
									success: function() {
										uni.removeStorageSync('push_pages');
									}
								});
							}
						}
						_self.getIntroducePage();
					})
					.catch(e => {
						uni.showToast({
							icon: 'none',
							title: e.message,
							duration: 2000
						});
					});
			},
			getIntroducePage: function() {
				const _self = this;
				const {
					origin,
				} = window.location;
				_self.$store
					.dispatch('getIntroducePage', {})
					.then(data => {
						_self.imgList = data ? data.map(x => {
							x.introduce_content = `${origin}${x.introduce_content}`;
							return x;
						}) : [];
						_self.showGo = true;
					})
					.catch(e => {
						uni.showToast({
							icon: 'none',
							title: e.message,
							duration: 2000
						});
					});
			},
			handleClose: function() {
				this.showHelp = false;
				this.scrollable = true;
			},
			handleGo: function() {
				this.showHelp = true;
				this.scrollable = false;

				this.$store
					.dispatch('clickTest', {})
					.then(data => {
						this.$store
							.dispatch('getIntroduceQRCode', {})
							.then(data => {
								this.qrcode = data;
							})
							.catch(e => {
								uni.showToast({
									icon: 'none',
									title: e.message,
									duration: 2000
								});
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
		components: {
			hasPayHead
		}
	};
</script>
<style>
	#scroll {
		height: 100vh;
		/* 需要给scroll-view设置高度 */
	}

	#scroll image {
		margin-bottom: -10px;
		width: 100%;
	}

	.masker {
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

	.showMsg {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 25px;
		top: 0;
		margin: auto;
		/* 	height: 370px;
	width: 320px; */
		height: 60vh;
		width: 87vw;
		background-image: url(/build/static/image/common/showMsg2x.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		z-index: 9999;
	}

	.showMsg .qrcode {
		/* 	height: 120px;
	width: 120px; */
		height: 20vh;
		width: 34vw;
		left: 0;
		right: 0;
		bottom: 3vh;
		margin: auto;
		position: absolute;
		/* background-image: url(/build/static/image/etwy/code.jpeg);
	background-repeat: no-repeat;
	background-size: 100% 100%; */
	}

	.showMsg .qrcode img {
		width: 100%;
		height: 100%;
	}

	.closeMsg {
		position: absolute;
		left: 0;
		right: 0;
		bottom: -10vh;
		margin: auto;
		/* height: 40px;
	width: 40px; */
		height: 7vh;
		width: 11vw;
		background-image: url(/build/static/image/common/closeMsg2x.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		z-index: 9999;
	}

	.goButton {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 2vh;
		margin: auto;
		height: 45px;
		width: 62vw;
		background-image: url(/build/static/image/common/buttonbg.png);
		background-repeat: no-repeat;
		background-size: 100% 100%;
		font-size: 19px;
		line-height: 41px;
		letter-spacing: 2px;
		border-radius: 5px;
		text-align: center;
		font-weight: bold;
		color: #fff;
	}

	.goButton:active {
		/* opacity: 0.8; */
	}
</style>
