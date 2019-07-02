<template>
	<uni-nav-bar>
		<view class="title">
			<view class="container">
				<view class="title-text">
					<a @click="onSwitchTab">
						<image class="logoContainer" src="/static/image/logo.jpeg" @error="imageError"></image>
						妈妈测
					</a>
				</view>
				<view class="serach"><mSearch @search="search($event)" :onInputClick="onInputClick" :show="false" placeholder="搜索"></mSearch></view>
			</view>
		</view>
	</uni-nav-bar>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import mSearch from '@/components/mehaotian-search/mehaotian-search.vue';
export default {
	name: 'page-head',
	props: {},
	data() {
		return {};
	},
	methods: {
		imageError: function(e) {
			console.error('image发生error事件，携带值为' + e.detail.errMsg);
		},
		onSwitchTab: function(e) {
			const url = this.$pageConfig[100];
			uni.switchTab({url});
		},
		search: function(e) {
			console.log(e);
		},
		onInputClick: function() {
			const url = this.$pageConfig[101];
			uni.redirectTo(url);
		}
	},
	components: {
		uniNavBar,
		mSearch
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
	width: 10rem;
	height: 2.3rem;
	padding: 0 0.4rem;
	display: flex;
	z-index: 2;
	align-items: center;
	background: hsla(0, 0%, 100%, 0.95);
}

.title-text {
	flex: 1 1 0;
	position: relative;
	padding-left: 1.8rem;
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
	border: 0.02667rem solid #fff;
	overflow: hidden;
}

.serach {
	position: absolute;
	right: 0px;
	width: 150px;
}
</style>
