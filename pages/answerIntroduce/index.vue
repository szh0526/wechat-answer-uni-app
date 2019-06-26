<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V" v-if="questionsId"><has-pay-head :questionsId="questionsId" /></view>
			<view class="flex-item flex-item-V">
				<view>
					<scroll-view id="scroll" :scroll-y="true" @scroll="scroll">
						<view v-for="(item, index) in imgList" :key="index"><v-lazyLoad :src="item.src" mode="widthFix"></v-lazyLoad></view>
					</scroll-view>
				</view>
			</view>
			<view><button class="targetBtn" hover-class="none" @touchstart="handlePay">立即购买</button></view>
		</view>
	</view>
</template>

<script>
import util from '../../common/util.js';
import hasPayHead from '../component/hasPayHead/hasPayHead.vue';
import lazyLoad from '../../components/pocky-lazyLoad/lazyLoad.js';
import VLazyLoad from '../../components/pocky-lazyLoad/lazyLoad.vue';

export default {
	data() {
		return {
			questionsId: null,
			showImg: false,
			imgList: []
		};
	},
	//监听页面初次渲染完成
	onReady() {
		//初始化图片懒加载 生命周期必须为 onReady http://ask.dcloud.net.cn/question/62163
		lazyLoad.setConfig(
			{
				// loading: '/static/image/common/loading3x.png', // 加载完成之前的替代图片
				error: '/static/image/common/error3x.png', // 加载错误的替代图片，
				preLoadHeight: 100 // 距离底部多少高度预加载图片
			},
			() => {
				this.$store
					.dispatch('getIntroducePage', {})
					.then(temp => {
						this.imgList = temp.data || [];
						lazyLoad.init('#scroll');
					})
					.catch(e => {
						uni.showToast({
							icon: 'none',
							title: e.message,
							duration: 2000
						});
					});
			}
		);
	},
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
		},
		scroll: function(e) {
			lazyLoad.scroll(); // 监听滚动条事件
		}
	},
	components: {
		hasPayHead,
		VLazyLoad
	}
};
</script>
<style>
#scroll {
	height: 1400upx; /* 需要给scroll-view设置高度 */
}
</style>
