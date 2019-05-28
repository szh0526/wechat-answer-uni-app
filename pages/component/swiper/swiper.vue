<template>
	<view>
		<swiper
			class="card-swiper"
			:class="dotStyle ? 'square-dot' : 'round-dot'"
			:indicator-dots="true"
			:circular="true"
			:autoplay="true"
			interval="5000"
			duration="500"
			@change="cardSwiper"
			indicator-color="#8799a3"
			indicator-active-color="#0081ff"
		>
			<swiper-item v-for="(item, index) in swiperList" :key="index" :class="cardCur == index ? 'cur' : ''">
				<view class="swiper-item">
					<image :src="item.url" mode="aspectFill" v-if="item.type == 'image'"></image>
					<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type == 'video'"></video>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cardCur: 0,
			swiperList: [],
			dotStyle: true
		};
	},
	mounted: function() {
		uni.request({
			url: 'http://localhost:3999/api/service/getHomePageBannerData',
			method: 'GET',
			data: {},
			success: res => {
				if (res.statusCode == '200' && res.data.code == '200') {
					const { data } = res.data;
					// 初始化towerSwiper 传已有的数组名即可
					this.swiperList = data.map(x => {
						return {
							id: x.scalePoolId,
							type: 'image',
							url: x.introPicture
						};
					});
					this.TowerSwiper('swiperList');
				} else {
					//console.log("接口异常");
				}
			},
			fail: () => {},
			complete: () => {}
		});
	},
	methods: {
		// cardSwiper
		cardSwiper(e) {
			this.cardCur = e.detail.current;
		},
		// towerSwiper
		// 初始化towerSwiper
		TowerSwiper(name) {
			let list = this[name];
			for (let i = 0; i < list.length; i++) {
				list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2));
				list[i].mLeft = i - parseInt(list.length / 2);
			}
			this.swiperList = list;
		}
	}
};
</script>

<style>
.tower-swiper .tower-item {
	transform: scale(calc(0.5 + var(--index) / 10));
	margin-left: calc(var(--left) * 100upx - 150upx);
	z-index: var(--index);
}
</style>
