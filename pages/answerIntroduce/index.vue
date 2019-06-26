<template>
	<view>
		<view class="uni-flex uni-column">
			<view id="has-pay-head" class="flex-item flex-item-V" v-if="questionsId"><has-pay-head :questionsId="questionsId" /></view>
			<view>
				<scroll-view id="scroll" scroll-y>
					<view v-for="(item, index) in imgList" :key="index"><image :src="item.introduce_content" mode="widthFix"></image></view>
				</scroll-view>
			</view>
			<view><div class="goButton" :style="{ 'background-image': 'url(/build/static/image/common/' + backgroundImage + ')' }" @touchstart="handlePay"></div></view>
		</view>
	</view>
</template>

<script>
import util from '../../common/util.js';
import hasPayHead from '../component/hasPayHead/hasPayHead.vue';

export default {
	data() {
		return {
			questionsId: null,
			backgroundImage: 'goPay2x.png', //支付goPay2x.png
			imgList: []
		};
	},
	//监听页面初次渲染完成
	onReady() {},
	//监听页面加载
	onLoad: function(option) {
		const _self = this;
		this.$store.commit('setCurrentPage', 'answerIntroduce');

		const questionsId = util.getQueryString('id');
		const channel = util.getQueryString('channel');
		this.$store.commit('setQuestionsId', questionsId);

		this.$store
			.dispatch('initUserQuestionsPayInfo', {
				channel
			})
			.then(data => {
				const { questions_id, user_id, is_answered, question_id, title } = data;
				_self.questionsId = questions_id;
				_self.$store.commit('setQuestionsId', questions_id);
				_self.$store.commit('setUserId', user_id);
				_self.$store.commit('initUserQuestionsPayInfo', data);

				if (is_answered) {
					//是否答完 0-没有答完 1-已答完 如果答完题则跳转到报告页第一页
					window.document.title = '个人测评报告';
					const url = _self.$pageConfig[4];
					uni.redirectTo({ url });
				} else if (!is_answered && question_id) {
					//question_id > 0 调转到对应题
					window.document.title = title;
					const url = _self.$pageConfig[2];
					uni.redirectTo({ url });
				} else {
					_self.$store
						.dispatch('getIntroducePage', {})
						.then(data => {
							_self.imgList = data || [];
						})
						.catch(e => {
							uni.showToast({
								icon: 'none',
								title: e.message,
								duration: 2000
							});
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
	//监听页面卸载
	onUnload() {},
	computed: {},
	methods: {
		handlePay: function() {
			if (this.$wechat && this.$wechat.isWechat()) {
				const url = this.$pageConfig[1];
				this.$wechat.pay(
					{
						title: '测试说明',
						url: url
					},
					() => {
						//支付成功回调
					}
				);
			}
		}
	},
	components: {
		hasPayHead
	}
};
</script>
<style>
#scroll {
	height: 1400upx; /* 需要给scroll-view设置高度 */
}

#scroll image {
	margin-bottom: -20upx;
	width: 100%;
}

.goButton {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	margin: auto;
	height: 120upx;
	width: 600upx;
	/* background-image: url(/build/static/image/common/goPay2x.png); */
	background-repeat: no-repeat;
	background-size: 100% 100%;
}
</style>
