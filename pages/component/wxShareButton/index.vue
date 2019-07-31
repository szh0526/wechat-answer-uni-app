<template>
	<view>
		<div class="share" @click="handleShare">分享给朋友</div>
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
			if (this.$wechat && this.$wechat.isWechat()) {
				this.$wechat.share(null,() => {
					_self.showShare = true;
				});
			}
		}
	}
};
</script>
<style>
.share {
	margin: 10px 25px 5px 25px;
	width: 32vw;
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
	width: 300px;
	max-width: 80%;
}
</style>
