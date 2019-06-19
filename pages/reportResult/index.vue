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
					<view><button class="targetBtn" hover-class="none" type="default" size="default" @click="handleGo">看结果</button></view>
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
	},
	//监听页面加载
	onLoad: function(option) {
		this.$store.commit('setCurrentPage', 'reportResult');

		this.$store
			.dispatch('getUserReportPage', {})
			.then(data => {
				const { report_introduce_content } = data;
				this.htmlStr = report_introduce_content || '<div>暂无</div>';
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
			const _self = this;
			this.$store
				.dispatch('createUserReport', {})
				.then(data => {
					window.document.title = "个人测评报告";
					const url = _self.$pageConfig[4];
					uni.redirectTo({ url });
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
		uniPopup
	}
};
</script>
<style></style>
