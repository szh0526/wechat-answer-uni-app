<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V">
				<view class="bg-gradual-pink">
					<view class="padding">
						<view class="cu-avatar xl round margin-left" :style="[{ backgroundImage: 'url(' + logo + ')' }]"></view>
						<text class="margin-left-sm text-white text-bold">欢迎回来,{{name}}！</text>
					</view>
				</view>
				<view class="VerticalBox">
					<scroll-view scroll-x class="bg-white nav">
						<view class="flex text-center">
							<view class="cu-item flex-sub" :class="index==tabCur?'text-green cur':''" v-for="(item,index) in tabList" :key="index"
							 @tap="tabSelect" :data-id="item.id">
								{{item.title}}
							</view>
						</view>
					</scroll-view>
					<scroll-view class="VerticalMain" scroll-x scroll-with-animation>
						<view class="padding-lr-xxs padding-bottom-sm">
							<view class="cu-list menu-avatar">
								<view class="cu-item solid-bottom" @click="onItemClick(item)"  v-for="(item, index) in dataList" :key="index">
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
		<!-- <view><bottom-bar status="my"/></view> -->
	</view>
</template>

<script>
	import bottomBar from '../component/bottomBar/bottomBar.vue';
	export default {
		data() {
			return {
				logo:"",
				name:"",
				tabList: [{
					id: "0",
					title: "未完成"
				}, {
					id: "1",
					title: "已完成"
				}],
				tabCur: 0,
				dataList: []
			};
		},
		onLoad() {
			const { initUserQuestionsPayInfo } = this.$store.state;
			if (Object.prototype.toString.call(initUserQuestionsPayInfo) !== '[object Object]') {
				//当全局接口数据为空时 返回首页
				const url = this.$pageConfig[0];
				uni.redirectTo({ url });
				return;
			}
			const {userinfo} = initUserQuestionsPayInfo;
			this.name = userinfo.name;
			this.logo = userinfo.img;
			this.getAssessment();
		},
		methods: {
			tabSelect(e) {
				this.tabCur = e.currentTarget.dataset.id;
				this.getAssessment();
			},
			imageError: function(e) {
				console.error('image发生error事件，携带值为' + e.detail.errMsg);
			},
			getAssessment() {
				const status = this.tabCur;
				const origin = window.location.origin;
				this.$store
					.dispatch('getAssessment', {
						status
					})
					.then(data => {
						this.dataList = data ? data.filter((x, index) => {
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
			},
			onItemClick:function(item){
				const url = `${this.$pageConfig[0]}?id=${item.questions_id}&channel=${item.channel}&page=${item.page}`;
				uni.redirectTo({ url });
			},
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
		/* display: flex; */
	}

	.VerticalMain {
		background-color: #f1f1f1;
		flex: 1;
	}
</style>
