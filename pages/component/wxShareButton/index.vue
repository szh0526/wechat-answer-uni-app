<template>
	<view>
		<div class="share" @click="handleShare"></div>
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
				title: '90%宝妈都在犯的错误，快去测一测', // 分享标题
				imgUrl: `${urlPrefix}/build/static/image/logo.jpeg`, // 分享图标
				link: url, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				desc: '欧美家长都在用的专业问卷，现在可以免费领取了，点击查看详情' //分享描述
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
.share {
	width: 30vw;
	height: 8vh;
	background-image: url(/build/static/image/common/share2x.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}

#share {
	background-color: black;
	left: 0;
	opacity: 0.7;
	position: fixed;
	top: 0;
	z-index: 9999;
	height: 100%;
	width: 100%;
}
#share img {
	float: right;
	width: 600upx;
	max-width: 80%;
}
</style>
