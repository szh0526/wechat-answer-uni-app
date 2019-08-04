import $ajax from './ajax.js'
import {
	getSignature,
	unifiedOrder,
	userPay,
	userShare
} from 'api.js'
import util from './util.js'
const jweixin = require('jweixin-module')

export default {
	// 判断是否在微信中  
	isWechat: function() {
		var ua = window.navigator.userAgent.toLowerCase()
		if (ua.match(/micromessenger/i) == 'micromessenger') {
			return true
		} else {
			return false
		}
	},
	// 初始化sdk配置  
	initJssdk: function(callback, url, way = 'share') {
		const jsApiList = way == 'share' ? [
			'checkJsApi', // 检查api是否可用
			'updateAppMessageShareData', // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
			'updateTimelineShareData', // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
			'onMenuShareTimeline', // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
			'onMenuShareAppMessage', // 获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
		] : [
			'checkJsApi', // 检查api是否可用
			'chooseWXPay', // 微信支付
		]

		// 服务端进行签名 ，可使用uni.request替换。 签名算法请看文档  
		getSignature({
				url: url
			})
			.then(data => {
				jweixin.config({
					debug: false, // 生产时必须false 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					appId: data.appId, // 必填，公众号的唯一标识
					timestamp: data.timestamp, // 必填，生成签名的时间戳
					nonceStr: data.nonceStr, // 必填，生成签名的随机串
					signature: data.signature, // 必填，签名
					jsApiList: jsApiList // 必填，需要使用的JS接口列表
				})

				// 配置完成后，再执行分享等功能  
				if (callback) {
					callback()
				}

				jweixin.checkJsApi({
					jsApiList: jsApiList,
					success: function(res) {
						console.log(JSON.stringify(res))
						// 以键值对的形式返回，可用的api值true，不可用为false
						// 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
					}
				})
				jweixin.error(function(res) {
					console.log('异常：', res)
				})
			})
			.catch(e => {
				uni.showToast({
					icon: 'none',
					title: e.message,
					duration: 2000
				})
			})
	},
	// 在需要自定义分享的页面中调用  
	share: function(data, callback) {
		if (!this.isWechat()) {
			return
		}
		const {
			origin,
			pathname,
			search
		} = window.location
		let url = `${origin}${pathname}`
		let params = util.urlParamToObj(search);
		let uid = '';
		// 清除url参数code , state , from, isappinstalled
		// delete params.from;
		// delete params.isappinstalled;
		// delete params.code;
		// delete params.state;
		if(params && !util.isEmptyObject(params)){
			uid = params.uid ? params.uid : '';
			params = util.json2ParStr(params);
			url = `${url}?${params}`;
		}
		
		data = Object.assign({}, {
			title: '90%宝妈都在犯的错误，快去测一测', // 分享标题
			imgUrl: `${origin}/build/static/image/logo.jpeg`, // 分享图标
			// url必须是当前网址的url，不包含‘#’后面部分，不能是本地地址http://localhost:8080/之类的，而且url的domain必须在微信安全域名之中。
			link: url,
			desc: '欧美家长都在用的专业问卷，现在可以免费领取了，点击查看详情' // 分享描述
		}, data)

		console.log('当前分享配置', data)

		// 每次都需要重新初始化配置，才可以进行分享  
		this.initJssdk(function() {
			jweixin.ready(function() {
				const shareData = {
					title: data.title,
					desc: data.desc,
					link: data.link,
					imgUrl: data.imgUrl,
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function(res) {
						// 用户点击分享后的回调，这里可以进行统计，例如分享送金币之类的  
						userShare({
								uid
							})
							.then(data => {
								console.log('分享给朋友圈成功!')
								if (callback) {
									callback()
								}
							})
							.catch(e => {
								uni.showToast({
									icon: 'none',
									title: e.message,
									duration: 2000
								})
							})
					},
					cancel: function() {
						uni.showToast({
							icon: 'none',
							title: '已取消分享!',
							duration: 2000
						})
					},
					fail: function(res) {
						console.log('分享失败\r\n', JSON.stringify(res))
						uni.showToast({
							icon: 'none',
							title: '分享失败!',
							duration: 2000
						})
					},
					complete: function() {
						console.log('操作完成!')
					}
				}
				// 分享给朋友接口  
				jweixin.onMenuShareAppMessage(shareData)
				// 分享到朋友圈接口 
				// jweixin.updateTimelineShareData(shareData)
				jweixin.onMenuShareTimeline(shareData)
			})
		}, url, 'share')
	},
	pay: function(callback) {
		if (!this.isWechat()) {
			return
		}

		// url必须是当前网址的url，不包含‘#’后面部分，不能是本地地址http://localhost:8080/之类的，而且url的domain必须在微信安全域名之中。
		const url = window.location.href.split('#')[0]

		// 每次都需要重新初始化配置，才可以进行支付
		this.initJssdk(function(data) {
			jweixin.ready(function() {
				unifiedOrder({})
					.then(data => {
						const payData = {
							timestamp: data['timeStamp'], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
							nonceStr: data['nonceStr'], // 支付签名随机串，不长于 32 位
							'package': data['package'], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
							signType: data['signType'], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
							paySign: data['paySign'], // 支付签名
							success: function(res) {
								console.log(res)
								userPay({})
									.then(data => {
										console.log('支付成功!')
										if (callback) {
											callback()
										}
									})
									.catch(e => {
										uni.showToast({
											icon: 'none',
											title: e.message,
											duration: 2000
										})
									})
							},
							cancel: function() {
								uni.showToast({
									icon: 'none',
									title: '已取消支付!',
									duration: 2000
								})
							},
							fail: function(res) {
								console.log('支付失败\r\n', JSON.stringify(res))
								uni.showToast({
									icon: 'none',
									title: '支付失败,请尝试重新支付!',
									duration: 2000
								})
							},
							complete: function() {
								console.log('操作完成!')
							}
						}

						// 呼起微信内置支付窗口
						// 微信公众号H5支付 https://www.jianshu.com/p/6a540cbc2bdd
						jweixin.chooseWXPay(payData)
					})
					.catch(e => {
						uni.showToast({
							icon: 'none',
							title: e.message,
							duration: 2000
						})
					})
			})
		}, url, 'pay')
	}
}
