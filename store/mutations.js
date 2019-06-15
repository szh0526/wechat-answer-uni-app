//公共mutation 同步修改store
const setCurrentPage = function(state, currentPage) {
	state.currentPage = currentPage
}

const setUserId = function(state, userId) {
	window.wxanswer.userId = userId;
	state.userId = userId
}

const setQuestionsId = function(state, questionsId) {
	window.wxanswer.questionsId = questionsId;
	state.questionsId = questionsId
}

const initUserQuestionsPayInfo = function(state, info) {
	state.initUserQuestionsPayInfo = info;
}

export default {
	setCurrentPage,
	setUserId,
	setQuestionsId,
	initUserQuestionsPayInfo
}