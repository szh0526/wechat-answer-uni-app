<template>
	<view>
		<view class="uni-flex uni-column"><view class="flex-item flex-item-V"></view></view>
		<view><button class="targetBtn" hover-class="none" @click="handleShare">让朋友也测测吧</button></view>
	</view>
</template>

<script>
import loadExternalAssetMixin from '../../common/loadExternalAssetMixin.js';

export default {
	mixins: [loadExternalAssetMixin],
	data() {
		return {};
	},
	onReady: function() {},
	//监听页面加载
	onLoad: function(option) {},
	mounted: function() {
		const _self = this;
		_self.$store.commit('setCurrentPage', 'userShare');

		this.loadScript('http://res.wx.qq.com/open/js/jweixin-1.4.0.js', () => {
			console.log('initialize jssdk successful!');
			//url必须是当前网址的url，不包含‘#’后面部分，不能是本地地址http://localhost:8080/之类的，而且url的domain必须在微信安全域名之中。
			let url = window.location.href.split('#')[0];
			_self.$store
				.dispatch('getSignatureInfo', {
					url
				})
				.then(data => {
					const { appId, timestamp, nonceStr, signature } = data;
					wx.config({
						debug: false, //生产时必须false 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: appId, // 必填，公众号的唯一标识
						timestamp: timestamp, // 必填，生成签名的时间戳
						nonceStr: nonceStr, // 必填，生成签名的随机串
						signature: signature, // 必填，签名
						jsApiList: [
							'updateAppMessageShareData', //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
							'updateTimelineShareData', //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
							'onMenuShareAppMessage',
							'onMenuShareTimeline'
						] // 必填，需要使用的JS接口列表
					});
					//config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
					wx.ready(() => {
						//分享操作 可以用按钮click触发
						//this.setWechatConfig();
					});
					wx.error(function(res) {
						console.log('异常：', res);
					});
				})
				.catch(e => {
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					});
				});
		});
	},
	methods: {
		handleShare: function() {
			this.setWechatConfig();
		},
		setWechatConfig() {
			const { title, link, imgUrl, desc } = {
				title: '测试标题', // 分享标题
				imgUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eqfnf9LqWC9KpLX3qiaLZI3nAajepAVJFcLGiaDtnlbEGLCjCiccZP0LBicLRZgWHxGUMGwr1WRgccuVA/132', // 分享图标
				link: 'http://t8h92d.natappfree.cc/pages/answerIntroduce/index?id=abc', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				desc: '快来试试吧' //分享描述
			};
			// wx.updateAppMessageShareData({
			// 	title,
			// 	desc,
			// 	link,
			// 	imgUrl,
			// 	success: function() {
			// 		console.log('分享给朋友成功回调!');
			// 	},
			//      cancel: function () {
			// 		console.log('用户取消转发!');
			//      }
			// });
			wx.onMenuShareTimeline({
				title,
				link,
				imgUrl,
				success: function() {
					console.log('分享给朋友成功回调!');
				},
			     cancel: function () {
					console.log('用户取消转发!');
			     },
					 fail:function (res) {
					console.log(JSON.stringify(res));
			     },
			});

			// wx.onMenuShareAppMessage({
			// 	title: '', // 分享标题
			// 	desc: '', // 分享描述
			// 	link: '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
			// 	imgUrl: '', // 分享图标
			// 	type: '', // 分享类型,music、video或link，不填默认为link
			// 	dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			// 	success: function () {
			// 	// 用户点击了分享后执行的回调函数
			// 	}
			// });
			// wx.updateTimelineShareData({
			// 	title,
			// 	link,
			// 	imgUrl,
			// 	success: function() {
			// 		console.log('分享到朋友圈成功回调!');
			// 	},
			// 	//用户取消转发后调用的函数
			//      cancel: function () {
			// 		console.log('用户取消转发!');
			//      }
			// });
		}
	},
	components: {}
};
</script>
<style></style>
