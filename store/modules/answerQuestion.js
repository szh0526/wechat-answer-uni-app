import { getNextQuestion,getPreviousQuestion  } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getNextQuestion:function({
			dispatch,
			commit,
			state
		},params){
		return getNextQuestion(params);
	},
	getPreviousQuestion:function({
			dispatch,
			commit,
			state
		},params){
		return getPreviousQuestion(params);
	}
}

export default {
	state,
	mutations,
	actions
}
