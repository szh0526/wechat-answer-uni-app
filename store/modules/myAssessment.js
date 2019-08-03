import { getAssessment } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getAssessment:function({
			dispatch,
			commit,
			state
		},params){
		return getAssessment(params);
	}
}

export default {
	state,
	mutations,
	actions
}
