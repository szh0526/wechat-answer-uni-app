import { getAnswerIntroduce } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getAnswerIntroduce:function({
			dispatch,
			commit,
			state
		},params){
		return getAnswerIntroduce(params);
	}
}

export default {
	state,
	mutations,
	actions
}
