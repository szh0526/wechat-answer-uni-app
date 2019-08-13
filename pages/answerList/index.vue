<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V">
				<view class="VerticalBox">
					<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh)">
						<view class="padding-lr-xxs padding-bottom-sm">
							<view class="cu-list menu-avatar">
								<view class="cu-item solid-bottom" @click="onItemClick(item)" v-for="(item, index) in cuBarList" :key="index">
									<view>
										<image class="cu-avatar radius xxl" mode="scaleToFill" lazy-load :src="item.src" @error="imageError"></image>
									</view>
									<view class="content contentleft">
										<view class="text-black">
											<text class="text-cut text-bold">{{ item.shortDescribe }}</text>
										</view>
										<!-- <view class="text-gray text-sm flex">
											<text class="text-cut">{{ item.shortDescribe }}</text>
										</view> -->
										<view class="text-gray margin-top">
											<text class="text-price text-yellow text-bold">{{ item.discountPrice }}</text>
											<text class="padding-left-xs text-xs line-through">{{ item.originalPrice }}</text>
											<text class="text-sm countDesc">{{ item.countDesc }}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- <view><bottom-bar status="home"/></view> -->
	</view>
</template>

<script>
	import {
		getQueryString,
		json2ParStr,
		urlParamToObj,
		isEmptyObject
	} from '../../common/util.js';
	import bottomBar from '../component/bottomBar/bottomBar.vue';
	export default {
		data() {
			return {
				cuBarList: [],
				load: true
			};
		},
		onReady: function() {},
		onLoad: function() {
			this.init();
		},
		methods: {
			imageError: function(e) {
				console.error('image发生error事件，携带值为' + e.detail.errMsg);
			},
			//动态修改url参数需要刷新页面  否则分享失败
			redirectFn: function(url, _params, user_id) {
				let params = { ..._params
				};
				let result = false; //是否需要跳转 
				let {
					id,
					page,
					channel,
					uid,
					code,
					state,
					isappinstalled,
					pages
				} = params;
				const _from = params['from'];
				channel = channel || "123";
				this.$store.commit('setChannel', channel);
				if (!uid || (uid != undefined && uid != user_id) || (pages && pages == "2") || _from || isappinstalled || code ||
					state || ((id && channel) || (id && page && channel))) {
					//清除uid
					if (params.uid) {
						delete params.uid;
					}
					if (params.from) {
						delete params.from;
					}
					if (params.isappinstalled) {
						delete params.isappinstalled;
					}
					if (params.code) {
						delete params.code;
					}
					if (params.state) {
						delete params.state;
					}

					if (params.id) {
						delete params.id;
					}
					if (params.channel) {
						delete params.channel;
					}
					if (params.page) {
						delete params.page;
					}

					if (params.pages) {
						//推送链接 保存pages 并删除url参数 
						uni.setStorageSync('push_pages', pages);
						delete params.pages;
					}

					let uid = user_id; //谁分享的  第一次分享为空 第二次为第一次的userId
					params = Object.assign({}, params, {
						uid,
						channel
					})
					params = json2ParStr(params);
					url = `${url}${isEmptyObject(params) ? '' : '?'}${params}`;
					window.location.href = url;
					result = true;
				}
				return result;
			},
			init: function() {
				const _self = this;
				this.$store.commit('setCurrentPage', 'answerList');
				//进首页
				const {
					origin,
					pathname,
					search
				} = window.location;
				let url = `${origin}${pathname}`;
				let params = urlParamToObj(search);
				let {
					id,
					page,
					uid,
					pages
				} = params;
				//没有id则为首页
				if (!id) {
					this.$store
						.dispatch('initUserQuestionsPayInfo', {
							uid: uid || ''
						})
						.then(data => {
							const {
								user_id
							} = data;
							const redirectFnResult = _self.redirectFn(url, params, user_id);
							if (!redirectFnResult) {
								_self.$store.commit('setUserId', user_id);
								_self.$store.commit('initUserQuestionsPayInfo', data);
								_self.getScales();
							}
						})
						.catch(e => {
							uni.showToast({
								icon: 'none',
								title: e.message,
								duration: 2000
							});
						});
				} else {
					this.$store
						.dispatch('initUserQuestionsPayInfo', {})
						.then(data => {
							const {
								questions_id,
								user_id,
							} = data;

							const redirectFnResult = _self.redirectFn(url, params, user_id);
							if (!redirectFnResult) {
								params = json2ParStr(params);
								const url = `${_self.$pageConfig[0]}${isEmptyObject(params) ? '' : '?'}${params}`;
								uni.navigateTo({
									url
								});
							}
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
			onItemClick: function(item) {
				const url = `${this.$pageConfig[0]}?id=${item.questions_id}&channel=${item.channel}`;
				uni.navigateTo({
					url
				});
			},
			getScales: function() {
				const origin = window.location.origin;
				this.$store
					.dispatch('getScales', {})
					.then(data => {
						this.cuBarList = data ? data.map((x, index) => {
							x.id = index;
							x.src = `${origin}${x.introPicture}`;
							return x;
						}) : [];
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
			bottomBar
		}
	};
</script>
<style>
	.cu-list.menu-avatar>.cu-item .content {
		position: absolute;
		left: 30upx;
		width: calc(100% - 96upx - 120upx - 20upx);
		line-height: 1.6em;
	}

	.cu-list.menu-avatar>.cu-item .countDesc {
		float: right;
		right: 10upx;
		line-height: 2.3em;
	}

	.cu-list.menu-avatar>.cu-item {
		padding-right: 20upx;
	}

	.VerticalNav.nav .cu-item.cur {
		background-color: #fff;
	}

	.VerticalNav.nav .cu-item.cur::after {
		content: '';
		width: 8upx;
		height: 30upx;
		border-radius: 10upx 0 0 10upx;
		position: absolute;
		background-color: currentColor;
		top: 0;
		right: 0upx;
		bottom: 0;
		margin: auto;
	}

	.VerticalBox {
		display: flex;
	}

	.VerticalMain {
		background-color: #FFFFFF;
		flex: 1;
	}
</style>
