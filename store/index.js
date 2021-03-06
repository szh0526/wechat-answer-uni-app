import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import mutations from './mutations'
import actions from './actions'
import answerList from './modules/answerList'
import myAssessment from './modules/myAssessment'
import answerIntroduce from './modules/answerIntroduce'
import preparePage from './modules/preparePage'
import answerQuestion from './modules/answerQuestion'
import reportResult from './modules/reportResult'
import reportShow from './modules/reportShow'
import userComment from './modules/userComment'
import userShare from './modules/userShare'
import schedule from './modules/schedule'

Vue.use(Vuex);

//根初始化状态
const state = {
	channel:"",
	userId:"",
	questionsId: "",
	currentPage: "",
	page:"",
	initUserQuestionsPayInfo:null
}

const store = new Vuex.Store({
	state,
	mutations,
	actions,
	modules: {
		answerList,
		myAssessment,
		answerIntroduce,
		preparePage,
		answerQuestion,
		reportResult,
		reportShow,
		userComment,
		userShare,
		schedule
	},
	plugins: [createLogger()],
	strict: process.env.NODE_ENV !== 'production',
})

if (module.hot) {
	// 使 action 和 mutation 成为可热重载模块
	module.hot.accept([
		'./mutations',
		'./modules/answerList',
		'./modules/myAssessment',
		'./modules/answerIntroduce',
		'./modules/preparePage',
		'./modules/answerQuestion',
		'./modules/reportResult',
		'./modules/reportShow',
		'./modules/userComment',
		'./modules/userShare',
		'./modules/schedule'
	], () => {
		// 获取更新后的模块
		// 因为 babel 6 的模块编译格式问题，这里需要加上 `.default`
		const $mutations = require('./mutations').default
		const $answerList = require('./modules/answerList').default
		const $myAssessment = require('./modules/myAssessment').default
		const $answerIntroduce = require('./modules/answerIntroduce').default
		const $preparePage = require('./modules/preparePage').default
		const $answerQuestion = require('./modules/answerQuestion').default
		const $reportResult = require('./modules/reportResult').default
		const $reportShow = require('./modules/preparePage').default
		const $userComment = require('./modules/userComment').default
		const $userShare = require('./modules/userShare').default
		const $schedule = require('./modules/schedule').default
		
		// 加载新模块
		store.hotUpdate({
			mutations: $mutations,
			modules: {
				answerList:$answerList,
				myAssessment:$myAssessment,
				answerIntroduce:$answerIntroduce,
				preparePage:$preparePage,
				answerQuestion:$answerQuestion,
				reportResult:$reportResult,
				reportShow:$reportShow,
				userComment:$userComment,
				userShare:$userShare,
				schedule:$schedule
			}             
		})
	})
}

export default store
