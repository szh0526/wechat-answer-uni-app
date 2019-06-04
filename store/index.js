import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import mutations from './mutations'
import actions from './actions'
import answerIntroduce from './modules/answerIntroduce'

Vue.use(Vuex);

//根初始化状态
const state = {
	access_code:null,
	access_state:"",
	currentPage: "",
	openid: null
}

const store = new Vuex.Store({
	state,
	mutations,
	actions,
	modules: {
		answerIntroduce
	},
	plugins: [createLogger()],
	strict: process.env.NODE_ENV !== 'production',
})

if (module.hot) {
	// 使 action 和 mutation 成为可热重载模块
	module.hot.accept([
		'./mutations',
		'./modules/answerIntroduce',
	], () => {
		// 获取更新后的模块
		// 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`
		const newMutations = require('./mutations').default
		const newAnswerIntroduce = require('./modules/answerIntroduce').default
		// 加载新模块
		store.hotUpdate({
			mutations: newMutations,
			modules: {
				answerIntroduce:newAnswerIntroduce
			}
		})
	})
}

export default store
