<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V"><page-head /></view>
			<view class="flex-item flex-item-V">
				<view class="VerticalBox">
					<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" style="height:calc(100vh)">
						<view class="cu-item" :class="index == tabCur ? 'text-green cur' : ''" v-for="(item, index) in cuItemList" :key="index" @tap="TabSelect" :data-id="index">
							{{ item.name }}
						</view>
					</scroll-view>
					<scroll-view class="VerticalMain" scroll-y scroll-with-animation style="height:calc(100vh)" :scroll-into-view="'main-' + mainCur" @scroll="VerticalMain">
						<view class="padding-lr-xxs padding-bottom-sm" v-for="(temp, index) in cuItemList" :key="index" :id="'main-' + index">
							<view class="cu-bar solid-bottom bg-white">
								<view class="action">
									<text class="cuIcon-title text-green"></text>
									{{ temp.name }}
								</view>
							</view>
							<view class="cu-list menu-avatar">
								<view class="cu-item solid-bottom" v-for="(item, index) in cuBarList[temp.name]" :key="index">
									<view><image class="cu-avatar radius xxl" mode="scaleToFill" lazy-load :src="item.introPicture" @error="imageError"></image></view>
									<view class="content contentleft">
										<view class="text-black">
											<text class="text-cut text-bold">{{ item.name }}</text>
										</view>
										<view class="text-gray text-sm flex">
											<text class="text-cut">{{ item.shortDescribe }}</text>
										</view>
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
	</view>
</template>

<script>
export default {
	data() {
		return {
			cuItemList: [], //左侧菜单
			cuBarList: [], //右侧内容
			tabCur: 0,
			mainCur: 0,
			verticalNavTop: 0,
			load: true
		};
	},
	mounted: function() {
		uni.showLoading({
			title: '加载中...',
			mask: true
		});

		Promise.all([this.getScalesPromise(), this.getCategorysPromise()])
			.then(result => {
				const result1 = result[0];
				const result2 = result[1];

				if (result1.statusCode == '200' && result1.data.code == '200') {
					const { scales } = result1.data.data;
					this.cuBarList = scales || {};
				}
				if (result2.statusCode == '200' && result2.data.code == '200') {
					const _data = result2.data.data || [];
					this.cuItemList = _data.map((x, index) => {
						x.id = index;
						return x;
					});
				}
				uni.hideLoading();
			})
			.catch(e => {
				console.log(e);
			});
	},
	methods: {
		imageError: function(e) {
			console.error('image发生error事件，携带值为' + e.detail.errMsg);
		},
		getScalesPromise() {
			const url = `${this.$apiUrl}/service/getScales`;
			return new Promise((resolve, reject) => {
				uni.request({
					url,
					method: 'GET',
					data: {},
					success: res => {
						resolve(res);
					},
					fail: () => {
						reject(new Error(`${url}接口异常!`));
					},
					complete: () => {}
				});
			});
		},
		getCategorysPromise() {
			const url = `${this.$apiUrl}/service/getCategorys`;
			return new Promise((resolve, reject) => {
				uni.request({
					url,
					method: 'GET',
					data: {},
					success: res => {
						resolve(res);
					},
					fail: () => {
						reject(new Error(`${url}接口异常!`));
					},
					complete: () => {}
				});
			});
		},
		TabSelect(e) {
			this.tabCur = e.currentTarget.dataset.id;
			this.mainCur = e.currentTarget.dataset.id;
			this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50;
		},
		VerticalMain(e) {
			let that = this;
			let tabHeight = 0;
			if (this.load) {
				for (let i = 0, len = this.cuItemList.length; i < len; i++) {
					let view = uni.createSelectorQuery().select('#main-' + this.cuItemList[i].id);
					view
						.fields(
							{
								size: true
							},
							data => {
								this.cuItemList[i].top = tabHeight;
								tabHeight = tabHeight + data.height;
								this.cuItemList[i].bottom = tabHeight;
							}
						)
						.exec();
				}
				this.load = false;
			}
			let scrollTop = e.detail.scrollTop + 10;
			for (let i = 0, len = this.cuItemList.length; i < len; i++) {
				if (scrollTop > this.cuItemList[i].top && scrollTop < this.cuItemList[i].bottom) {
					this.verticalNavTop = (this.cuItemList[i].id - 1) * 50;
					this.tabCur = this.cuItemList[i].id;
					return false;
				}
			}
		}
	},
	components: {}
};
</script>
<style>
.VerticalNav.nav {
	width: 148upx;
	white-space: initial;
}

.VerticalNav.nav .cu-item {
	width: 100%;
	text-align: center;
	background-color: #f1f1f1;
	margin: 0;
	border: none;
	height: 49px;
	line-height: 51px;
	position: relative;
}

.cu-list.menu-avatar > .cu-item .content {
	position: absolute;
	left: 30upx;
	width: calc(100% - 96upx - 120upx - 20upx);
	line-height: 1.6em;
}

.cu-list.menu-avatar > .cu-item .countDesc {
	float: right;
	right: 10upx;
	line-height: 2.3em;
}

.cu-list.menu-avatar > .cu-item {
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
