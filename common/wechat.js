import $ajax from './ajax.js';
import {
	getSignature,
	userShare
} from 'api.js';
const jweixin = require('jweixin-module');

export default {
	//判断是否在微信中  
	isWechat: function() {
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true;
		} else {
			return false;
		}
	},
	//初始化sdk配置  
	initJssdk: function(callback, url) {
		//服务端进行签名 ，可使用uni.request替换。 签名算法请看文档  
		getSignature({
				url: url
			})
			.then(data => {
				const {
					appId,
					timestamp,
					nonceStr,
					signature
				} = data;
				jweixin.config({
					debug: false, //生产时必须false 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: appId, // 必填，公众号的唯一标识
					timestamp: timestamp, // 必填，生成签名的时间戳
					nonceStr: nonceStr, // 必填，生成签名的随机串
					signature: signature, // 必填，签名
					jsApiList: [
						'checkJsApi',
						'updateAppMessageShareData', //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
						'updateTimelineShareData', //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
						'onMenuShareTimeline', //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
						'onMenuShareAppMessage', //获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
					] // 必填，需要使用的JS接口列表
				});

				//配置完成后，再执行分享等功能  
				if (callback) {
					callback();
				}

				// jweixin.checkJsApi({
				// 	jsApiList: [
				// 		'checkJsApi',
				// 		'updateAppMessageShareData', //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
				// 		'updateTimelineShareData', //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
				// 		'onMenuShareTimeline', //获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
				// 		'onMenuShareAppMessage', //获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
				// 	],
				// 	success: function(res) {
				// 		console.log(JSON.stringify(res));
				// 		// 以键值对的形式返回，可用的api值true，不可用为false
				// 		// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
				// 	}
				// });
				jweixin.error(function(res) {
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
	},
	//在需要自定义分享的页面中调用  
	share: function(data, url,callback) {
		//url必须是当前网址的url，不包含‘#’后面部分，不能是本地地址http://localhost:8080/之类的，而且url的domain必须在微信安全域名之中。
		url = url ? url : window.location.href.split('#')[0];
		if (!this.isWechat()) {
			return;
		}
		//每次都需要重新初始化配置，才可以进行分享  
		this.initJssdk(function() {
			jweixin.ready(function() {
				const {
					title,
					link,
					imgUrl,
					desc
				} = data;
				const shareData = {
					title,
					desc,
					link,
					imgUrl,
					type: '', // 分享类型,music、video或link，不填默认为link
				  dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function(res) {
						//用户点击分享后的回调，这里可以进行统计，例如分享送金币之类的  
						userShare({})
							.then(data => {
								console.log('分享给朋友圈成功!');
							})
							.catch(e => {
								uni.showToast({
									icon: 'none',
									title: e.message,
									duration: 2000
								});
							});
					},
					cancel: function() {
						console.log('用户取消分享!');
					},
					fail: function(res) {
						console.log("分享失败\r\n", JSON.stringify(res));
					},
					complete: function() {
						console.log('分享完成!');
					}
				};
				//分享给朋友接口  
				jweixin.onMenuShareAppMessage(shareData);
				//分享到朋友圈接口 
				//jweixin.updateTimelineShareData(shareData);
				jweixin.onMenuShareTimeline(shareData);
				
				if(callback){
					callback();
				}
			});
		}, url);
	}
}
