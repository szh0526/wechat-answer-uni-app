<template>
	<view>
		<view>
			<button hover-class="none" @click="handleShare">{{ title }}</button>
		</view>
		<view v-show="showShare">
			<div id="share">
				<img src="/build/static/image/common/guide_point.png" />
				<img src="/build/static/image/common/guide_btn.png" @click="handleCancel" />
			</div>
		</view>
	</view>
</template>

<script>
export default {
	name: 'wx-share-button',
	props: {
		title: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			showShare: false
		};
	},
	mounted: function() {},
	methods: {
		handleShare: function() {
			this.showShare = true;
			//this.setWechatConfig();
		},
		handleCancel: function() {
			this.showShare = false;
		},
		setWechatConfig: function() {
			const _self = this;
			const url = window.location.href.split('#')[0];
			const urlPrefix = window.location.origin;
			const config = {
				title: '测试标题', // 分享标题
				imgUrl: `${urlPrefix}/build/static/image/logo.jpg`, // 分享图标
				link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				desc: '快来试试吧' //分享描述
			};
			if (this.$wechat && this.$wechat.isWechat()) {
				this.$wechat.share(config,() => {
					_self.showShare = true;
				});
			}
		}
	}
};
</script>
<style>
#share {
	-webkit-user-select: none;
	position: absolute;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.65);
	text-align: center;
	top: 0;
	left: 0;
	z-index: 105;
}
#share img {
	float: right;
	width: 600upx;
	max-width: 100%;
}
</style>
