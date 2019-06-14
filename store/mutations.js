//公共mutation 同步修改store
const setCurrentPage = function(state, currentPage) {
	state.currentPage = currentPage
}

const setQuestionsId = function(state, questionsId) {
	state.questionsId = questionsId
}

const initUserQuestionsPayInfo = function(state, info) {
	state.initUserQuestionsPayInfo = info;
}

export default {
	setCurrentPage,
	setQuestionsId,
	initUserQuestionsPayInfo
}