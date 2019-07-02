<template>
	<view v-if="imgs.length">
		<uni-nav-bar :border="false" backgroundColor="#ffbb2e" height="110upx">
			<view class="title">
				<view class="container">
					<view class="title-text">
						<view class="cu-avatar-group" style="padding: 0 10px 0 5px;">
							<view class="cu-avatar round margin-left" v-for="(item,index) in imgs" :key="index" :style="[{marginLeft:'-5px'},{backgroundImage:'url(' + item + ')' }]"></view>
						</view>
						<view class="text-box" style="color: #000000;">
							<text>{{ counts }}人已测</text>
						</view>
					</view>
				</view>
			</view>
		</uni-nav-bar>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import { getUserPayInfo } from '../../../api.js';
export default {
	name: 'has-pay-head',
	props: {
		questionsId: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			imgs: [],
			counts: 0
		};
	},
	mounted: function() {
		const _self = this;
		if (_self.questionsId) {
			getUserPayInfo({
				questionsId: _self.questionsId
			})
				.then(data => {
					_self.imgs = data.imgs ? data.imgs.split(',') : [];
					_self.counts = data.counts || 0;
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
	methods: {
	},
	components: {
		uniNavBar
	}
};
</script>

<style>
.title {
	position: relative;
	z-index: 2;
	margin-bottom: -1.28rem;
	height: 2.3rem;
	line-height: 2.1rem;
	color: #4c4b58;
	transition: all 0.5s;
	transition-property: all;
	transition-duration: 0.5s;
	transition-timing-function: ease;
	transition-delay: 0s;
}
.container {
	transition: all 0.5s;
	box-sizing: border-box;
	/* width: 10rem; */
	height: 2.3rem;
	padding: 0 0.4rem;
	display: flex;
	z-index: 2;
	align-items: center;
	background-color: #ffbb2e;
	/* background: hsla(0, 0%, 100%, 0.95); */
}

.title-text {
	flex: 1 1 0;
	position: relative;
	/* padding-left: 1.8rem; */
	line-height: 1.8;
	color: #4c4b58;
	font-weight: 700;
	display: -webkit-box !important;
	word-break: break-all;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
	overflow: hidden;
	text-overflow: ellipsis;
}

.logoContainer {
	box-sizing: border-box;
	position: absolute;
	left: 0;
	top: 1px;
	width: 25px;
	height: 25px;
	border-radius: 50%;
	background: #4c4b58;
	/* border: 0.02667rem solid #fff; */
	overflow: hidden;
	margin-right: 20px;
}
.text-box {
	display: inline-flex;
	line-height: 32px;
	font-weight: 400;
}
.cu-avatar-group .cu-avatar{
	border: 0;
}
</style>
