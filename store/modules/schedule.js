import { getUserShareInfo } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getUserShareInfo:function({
			dispatch,
			commit,
			state
		},params){
		return getUserShareInfo(params);
	},
}

export default {
	state,
	mutations,
	actions
}
