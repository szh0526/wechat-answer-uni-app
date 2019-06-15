import { getUserComment,saveUserComment } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getUserComment:function({
			dispatch,
			commit,
			state
		},params){
		return getUserComment(params);
	},
	saveUserComment:function({
			dispatch,
			commit,
			state
		},params){
		return saveUserComment(params);
	}
}

export default {
	state,
	mutations,
	actions
}
