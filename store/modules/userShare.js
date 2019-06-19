import { userShare } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	userShare:function({
			dispatch,
			commit,
			state
		},params){
		return userShare(params);
	},
}

export default {
	state,
	mutations,
	actions
}
