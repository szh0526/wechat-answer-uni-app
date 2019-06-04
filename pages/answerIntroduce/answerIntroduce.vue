<template>
	<view>
		<view class="uni-flex uni-column">
			<view class="flex-item flex-item-V">
				<div>{{ currentPage }}</div>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';

export default {
	data() {
		return {
			title: '我的测评'
		};
	},
	//监听页面初次渲染完成
	onReady() {
		this.$store.commit('setCurrentPage',"answerIntroduce");
		
		this.$store.dispatch("getAnswerIntroduce",{
			searchParam:""
		}).then(res => {
			console.log(res);
		}).catch(e=>{
			uni.showToast({
				icon:"none",
				title: e.message,
				duration: 2000
			});
		})
	},
	//监听页面加载
	onLoad:function(option) {
		console.log(option);
	},
	//监听页面卸载
	onUnload (){
		
	},
	computed: {
		currentPage:function () {
      return this.$store.state.currentPage
		}
	},
	methods: {
	},
	components: {}
};
</script>
<style></style>
