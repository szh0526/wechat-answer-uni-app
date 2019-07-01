<template>
	<view v-show="show" class="reportPopup">
		<div class="masker" catchtouchmove="ture"></div>
		<div class="showMsg">
			<div class="begin">
				<p>亲爱的家长朋友,</p>
				<p>您已经成功完成了儿童喂养方式评估专业测试。</p>
				<p style="font-weight: bold;font-size: 1.1em;">本报告将由三部分给您进行全面的现状分析及面临问题的科学指导建议 :</p>
				<ul>
					<li><p>您当前在孩子喂养方面的方式正确吗? (初步全面诊断)</p></li>
					<li><p>哪些环节是做的好的、哪些环节是需要马上改善的?</p></li>
					<li><p>针对面临的问题,如何具体做最有效?</p></li>
				</ul>
				<div class="goButton" @click="handleGo"></div>
			</div>
		</div>
	</view>
</template>

<script>
export default {
	name: 'report-result-popup',
	props: {
		show: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {};
	},
	//监听页面加载
	onLoad: function(option) {},
	//监听页面卸载
	onUnload() {},
	computed: {},
	methods: {
		handleGo: function() {
			const _self = this;
			this.$store
				.dispatch('createUserReport', {})
				.then(data => {
					window.document.title = '个人测评报告';
					const url = _self.$pageConfig[4];
					uni.redirectTo({ url });
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
	components: {}
};
</script>
<style>
.reportPopup{
	
}	

.reportPopup .masker {
	pointer-events: none;
	background-color: black;
	left: 0;
	opacity: 0.7;
	position: fixed;
	top: 0;
	z-index: 9999;
	height: 100%;
	width: 100%;
}

.reportPopup .showMsg {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 15px;
	top: 0;
	margin: auto;
	height: 90vh;
	width: 91vw;
	background-image: url(/build/static/image/common/report2x.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	z-index: 9999;
}

.reportPopup .goButton {
	position: fixed;
	left: 0;
	right: 0;
	bottom: 22upx;
	margin: auto;
	/* height: 120upx;
	width: 600upx; */
	height: 9vh;
	width: 79vw;
	background-image: url(/build/static/image/common/showReport2x.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
	z-index: 9999;
}

.reportPopup .goButton:active {
/* 	opacity: 0.4; */
}

.reportPopup .begin {
	padding: 30upx;
	font-size: 1em;
	color: #75737c;
	background-color: #fff;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 156upx;
	margin: auto;
	height: 50vh;
	width: 77vw;
	overflow: hidden;
	overflow-y: auto;
	border-radius: 20upx;
	box-shadow: 0 12upx 20upx #ccc;
}

.reportPopup .begin p {
}

.reportPopup .begin ul {
	list-style-type: upper-roman;
	padding: 40upx 20upx 20upx 40upx;
}

.reportPopup .begin ul > li {
	margin-left: 0;
	margin-bottom: 10upx;
}

.reportPopup .begin .part1 {
	height: 8vh;
	width: 17vw;
	background-image: url(/build/static/image/common/part1.png);
	background-repeat: no-repeat;
	background-size: 88% 46%;
}

.reportPopup .begin .part2 {
	height: 8vh;
	width: 17vw;
	background-image: url(/build/static/image/common/part2.png);
	background-repeat: no-repeat;
	background-size: 88% 46%;
}

.reportPopup .begin .part3 {
	height: 8vh;
	width: 17vw;
	background-image: url(/build/static/image/common/part3.png);
	background-repeat: no-repeat;
	background-size: 88% 46%;
}
</style>
