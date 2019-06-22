<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V" v-if="questionsId"><has-pay-head :questionsId="questionsId"/></view>
			<view class="flex-item flex-item-V">
				<view class="uni-common-mt">
					<div class="html-wrap"><rich-text :nodes="htmlStr"></rich-text></div>
				</view>
			</view>
			<view><button class="targetBtn" hover-class="none" @click="handlePay">立即购买</button></view>
		</view>
	</view>
</template>

<script>
import util from '../../common/util.js';
import hasPayHead from '../component/hasPayHead/hasPayHead.vue';

export default {
	data() {
		return {
			questionsId:null,
			htmlStr: ''
		};
	},
	//监听页面初次渲染完成
	onReady() {
		uni.showLoading({
			title: '加载中...'
		});
	},
	//监听页面加载
	onLoad: function(option) {
		const _self = this;
		this.$store.commit('setCurrentPage', 'answerIntroduce');
		const questionsId = util.getQueryString('id');
		const channel = util.getQueryString('channel');

		this.$store
			.dispatch('initUserQuestionsPayInfo', {
				channel
			})
			.then(data => {
				const { questions_id, user_id, is_answered, question_id,title } = data;
				_self.questionsId = questions_id;
				_self.$store.commit('setQuestionsId', questions_id);
				_self.$store.commit('setUserId', user_id);
				_self.$store.commit('initUserQuestionsPayInfo', data);

				if (is_answered) {
					//是否答完 0-没有答完 1-已答完 如果答完题则跳转到报告页第一页
					window.document.title = "个人测评报告";
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
							const { introduce_content } = data;
							_self.htmlStr = introduce_content || '<div>暂无</div>';
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
	//监听页面卸载
	onUnload() {},
	computed: {},
	methods: {
		handlePay:function(){
			window.document.title = "测试说明";
			const url = this.$pageConfig[1];
			uni.redirectTo({ url });
		}
	},
	components: {
		hasPayHead
	}
};
</script>
<style></style>
