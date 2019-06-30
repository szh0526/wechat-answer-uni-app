<template>
	<view>
		<view><button hover-class="none" @click="handleSharePYQ">分享到朋友圈</button></view>
		<view><button hover-class="none" @click="handleSharePY">分享给朋友</button></view>
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
	onLoad: function(option) {
		const { initUserQuestionsPayInfo } = this.$store.state;
		if (Object.prototype.toString.call(initUserQuestionsPayInfo) !== '[object Object]') {
			//当全局接口数据为空时 返回首页
			const url = this.$pageConfig[0];
			uni.redirectTo({ url });
			return;
		}
	},
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
							'onMenuShareTimeline', //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
							'onMenuShareAppMessage' //获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
						] // 必填，需要使用的JS接口列表
					});
					//config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，
					wx.ready(() => {
						//分享操作 可以用按钮click触发
						//this.setWechatConfig();
						this.setWechatConfig('py', this.config);
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
		handleSharePYQ: function() {
			this.setWechatConfig('pyq');
		},
		handleSharePY: function() {
			this.setWechatConfig('py');
		},
		onComplete: function() {
			this.$store
				.dispatch('userShare', {})
				.then(data => {
					console.log(data);
				})
				.catch(e => {
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					});
				});
		},
		setWechatConfig(way, data) {
			const _self = this;
			console.log(way, data);
			const { title, link, imgUrl, desc } = data;
			if (way == 'pyq') {
				wx.updateTimelineShareData({
					title,
					link,
					imgUrl,
					success: function() {
						console.log('分享给朋友圈成功!');
						_self.onComplete();
					},
					cancel: function() {
						console.log('用户取消分享!');
					},
					fail: function(res) {
						console.log('分享给朋友圈失败\r\n', JSON.stringify(res));
					},
					complete: function() {
						console.log('分享给朋友圈完成!');
					}
				});
			}
			if (way == 'py') {
				console.log(wx);
				wx.onMenuShareTimeline({
					title,
					link,
					imgUrl,
					success: function() {
						console.log('分享给朋友成功!');
						_self.onComplete();
					},
					cancel: function() {
						console.log('用户取消分享!');
					},
					fail: function(res) {
						console.log('分享给朋友失败\r\n', JSON.stringify(res));
					},
					complete: function() {
						console.log('分享给朋友完成!');
					}
				});
				// wx.updateAppMessageShareData({
				// 	title,
				// 	desc,
				// 	link,
				// 	imgUrl,
				// 	success: function() {
				// 		console.log('分享给朋友成功!');
				// 		_self.onComplete();
				// 	},
				// 	cancel: function() {
				// 		console.log('用户取消分享!');
				// 	},
				// 	fail: function(res) {
				// 		console.log("分享给朋友失败\r\n",JSON.stringify(res));
				// 	},
				// 	complete: function() {
				// 		console.log('分享给朋友完成!');
				// 	}
				// });
			}
		}
	},
	computed: {
		config() {
			const questionsId = this.$store.state.questionsId;
			const url = window.location.href.split('#')[0];
			const urlPrefix = window.location.origin;
			return {
				title: '测试标题', // 分享标题
				imgUrl: `${urlPrefix}/build/static/image/logo.jpg`, // 分享图标
				link: encodeURI(url), // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				desc: '快来试试吧' //分享描述
			};
		}
	},
	components: {}
};
</script>
<style></style>
