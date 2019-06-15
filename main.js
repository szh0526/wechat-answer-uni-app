import Vue from 'vue'
import App from './App'

//注册公共页面组件
import pageHead from './pages/component/pageHead/pageHead.vue';

import store from './store'

window.wxanswer = {};

Vue.config.productionTip = false;

Vue.prototype.$store = store;
Vue.prototype.$pageConfig = {
	0:"/pages/answerIntroduce/index", //测评介绍页
  1:"/pages/preparePage/index" ,//测评准备页
	2:"/pages/answerQuestion/index",//测评进行中
	3:"/pages/reportResult/index",//测试完成弹窗页
	4:"/pages/reportShow/index",//报告展示页
	5:"/pages/userComment/index",//用户评价页
	6:"/pages/userShare/index",//用户分享页
	100:"/pages/index/index",//首页
	101:"/pages/serachTag/serachTag",//搜索页
	102:"/pages/category/category",//分类页
	103:"/pages/myAssessment/myAssessment",//我的测评页
}
Vue.prototype.$apiUrl = 'http://localhost:3999/api';

Vue.component('pageHead',pageHead);

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
