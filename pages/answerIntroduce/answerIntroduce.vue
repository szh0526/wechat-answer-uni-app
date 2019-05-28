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
	onLoad () {
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
