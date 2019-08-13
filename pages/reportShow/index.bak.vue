<template>
	<view>
		<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" @init="mescrollInit">
			<view v-for="(item, index) in dataList" :key="index">
				<view class="uni-common-mt">
					<div class="html-wrap"><rich-text :nodes="item.htmlStr"></rich-text></div>
				</view>
			</view>
		</mescroll-uni>
		<view v-if="showComment"><button hover-class="none" class="fixedBottomBtn" @click="handleComment">去评价</button></view>
	</view>
</template>

<script>
import MescrollUni from '../../components/mescroll-uni/mescroll-uni.vue';
// import uParse from '../../components/gaoyia-parse/parse.vue';

export default {
	components: {
		MescrollUni
		//uParse
	},
	data() {
		return {
			mescroll: null, //mescroll实例对象
			// 下拉刷新的配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: true // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: false, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				isLock: false, // 是否锁定上拉加载 (可用于不触发upCallback,只保留回到顶部按钮的场景)
				page: {
					num: 1, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 1 // 每页数据的数量,默认10
				},
				noMoreSize: 1,
				empty: {
					tip: '暂无相关数据'
				}
			},
			// 列表数据
			dataList: [],
			showComment: false
		};
	},
	onLoad: function() {
		const { initUserQuestionsPayInfo } = this.$store.state;
		if (Object.prototype.toString.call(initUserQuestionsPayInfo) !== '[object Object]') {
			//当全局接口数据为空时 返回首页
			const url = this.$pageConfig[1000];
			uni.navigateTo({ url });
			return;
		}
		this.$store.commit('setCurrentPage', 'reportShow');
	},
	// 必须注册滚动到底部的事件,使上拉加载生效
	onReachBottom() {
		this.mescroll && this.mescroll.onReachBottom();
	},
	// 必须注册列表滚动事件,使下拉刷新生效
	onPageScroll(e) {
		this.mescroll && this.mescroll.onPageScroll(e);
	},
	methods: {
		handleComment: function() {
			window.document.title = '发表评价';
			const url = this.$pageConfig[5];
			uni.navigateTo({ url });
		},
		// mescroll组件初始化的回调,可获取到mescroll对象
		mescrollInit(mescroll) {
			this.mescroll = mescroll;
		},
		/*下拉刷新的回调, 有三种处理方式: */
		downCallback(mescroll) {
			//setTimeout(function(){
			mescroll.resetUpScroll();
			//},500)
		},
		/*上拉加载的回调*/
		upCallback(mescroll) {
			let currentSize = mescroll.size;
			let currentPage = mescroll.num;
			this.$store
				.dispatch('getNextUserReport', {
					currentPage,
					currentSize
				})
				.then(data => {
					// 接口返回的当前页数据列表 (数组)
					let curPageData = data.report_str ? [{ htmlStr: data.report_str }] : [];
					let hasNext = mescroll.num < data.total;
					this.showComment = mescroll.num == data.total;

					//setTimeout(function(){
					mescroll.endSuccess(curPageData.length, hasNext);
					//},1000)

					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(curPageData); //追加新数据
				})
				.catch(e => {
					// 失败隐藏下拉加载状态
					mescroll.endErr();
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					});
				});
		}
	}
};
</script>
<style></style>
