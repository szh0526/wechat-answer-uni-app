import Vue from 'vue'
import App from './App'

//注册公共页面组件
import pageHead from './pages/component/pageHead/pageHead.vue';

import store from './store'

Vue.config.productionTip = false;

Vue.prototype.$store = store;
Vue.prototype.$apiUrl = 'http://localhost:6188/api';

Vue.component('pageHead',pageHead);

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
