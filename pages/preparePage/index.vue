<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V">
				<uni-popup :show="showPopup" type="middle" customClass="popup-wrap" :h5Top="h5Top" mode="fixed" button-mode="right">
					<view class="uni-center center-box" style="height: 92%;">
						<view class="uni-common-mt">
							<div class="html-wrap">
								<div style="margin-top: 20upx;margin-bottom: 20upx;"><rich-text :nodes="htmlStr"></rich-text></div>
							</div>
						</view>
					</view>
					<view><button class="targetBtn" hover-class="none" type="default" size="default" @click="handleGo">好的,GO!</button></view>
				</uni-popup>
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
	onReady() {
		uni.showLoading({
			title: '加载中...'
		});
	},
	//监听页面加载
	onLoad: function(option) {
		const { initUserQuestionsPayInfo } = this.$store.state;
		
		if(Object.prototype.toString.call(initUserQuestionsPayInfo) !== "[object Object]"){
			//当全局接口数据为空时 返回首页
			const url = this.$pageConfig[0];
			uni.redirectTo({ url });
			return;
		}
		
		this.$store.commit('setCurrentPage', 'preparePage');

		this.$store
			.dispatch('getPreparePage', {})
			.then(data => {
				uni.hideLoading();
				const { prepare_content } = data;
				this.htmlStr = prepare_content || '<h2>测前须知</h2><div>暂无</div>';
				this.showPopup = true;
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
		handleGo: function() {
			const { initUserQuestionsPayInfo } = this.$store.state;
			window.document.title = initUserQuestionsPayInfo.title || "一心理测评";
			const url = this.$pageConfig[2];
			uni.redirectTo({ url });
		}
	},
	components: {
		uniPopup
	}
};
</script>
<style></style>
