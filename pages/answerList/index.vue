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
		<!-- <view><bottom-bar/></view> -->
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
		onReady:function(){
			// uni.showTabBar({
			// })
		},
		onLoad: function() {
			this.init();
		},
		methods: {
			imageError: function(e) {
				console.error('image发生error事件，携带值为' + e.detail.errMsg);
			},
			init:function(){
				const _self = this;
				this.$store.commit('setCurrentPage', 'answerList');
				//进首页
				const {origin,pathname,search} = window.location;
				let params = urlParamToObj(search);
				if(!params || isEmptyObject(params)){
					this.$store
						.dispatch('initUserQuestionsPayInfo', {
						})
						.then(data => {
							const {user_id} = data;
							_self.$store.commit('setUserId', user_id);
							_self.$store.commit('initUserQuestionsPayInfo', data);
							_self.getScales();
						})
						.catch(e => {
							uni.showToast({
								icon: 'none',
								title: e.message,
								duration: 2000
							});
						});
				}else{
					params = json2ParStr(params)
					const url = `${this.$pageConfig[0]}?${params}`;
					uni.redirectTo({ url });
				}
			},
			onItemClick:function(item){
				const url = `${this.$pageConfig[0]}?id=${item.questions_id}&channel=${item.channel}`;
				uni.redirectTo({ url });
			},
			getScales:function(){
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
		background-color: #f1f1f1;
		flex: 1;
	}
</style>
