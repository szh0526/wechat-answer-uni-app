import api from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getAnswerIntroduce:function({
			dispatch,
			commit,
			state
		},params){
		return api.getAnswerIntroducePromise(params);
	}
}

export default {
	state,
	mutations,
	actions
}
