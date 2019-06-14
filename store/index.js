import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import mutations from './mutations'
import actions from './actions'
import answerIntroduce from './modules/answerIntroduce'
import preparePage from './modules/preparePage'
import answerQuestion from './modules/answerQuestion'
import reportResult from './modules/reportResult'
import reportShow from './modules/reportShow'
import userComment from './modules/userComment'
import userShare from './modules/userShare'

Vue.use(Vuex);

//根初始化状态
const state = {
	questionsId: "",
	currentPage: "",
	initUserQuestionsPayInfo:null
}

const store = new Vuex.Store({
	state,
	mutations,
	actions,
	modules: {
		answerIntroduce,
		preparePage,
		answerQuestion,
		reportResult,
		reportShow,
		userComment,
		userShare
	},
	plugins: [createLogger()],
	strict: process.env.NODE_ENV !== 'production',
})

if (module.hot) {
	// 使 action 和 mutation 成为可热重载模块
	module.hot.accept([
		'./mutations',
		'./modules/answerIntroduce',
		'./modules/preparePage',
		'./modules/answerQuestion',
		'./modules/reportResult',
		'./modules/reportShow',
		'./modules/userComment',
		'./modules/userShare'
	], () => {
		// 获取更新后的模块
		// 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`
		const $mutations = require('./mutations').default
		const $answerIntroduce = require('./modules/answerIntroduce').default
		const $preparePage = require('./modules/preparePage').default
		const $answerQuestion = require('./modules/answerQuestion').default
		const $reportResult = require('./modules/reportResult').default
		const $reportShow = require('./modules/preparePage').default
		const $userComment = require('./modules/userComment').default
		const $userShare = require('./modules/userShare').default
		
		// 加载新模块
		store.hotUpdate({
			mutations: $mutations,
			modules: {
				answerIntroduce:$answerIntroduce,
				preparePage:$preparePage,
				answerQuestion:$answerQuestion,
				reportResult:$reportResult,
				reportShow:$reportShow,
				userComment:$userComment,
				userShare:$userShare
			}             
		})
	})
}

export default store
