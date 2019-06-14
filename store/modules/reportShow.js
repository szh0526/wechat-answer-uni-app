import { getPreparePage } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getPreparePage:function({
			dispatch,
			commit,
			state
		},params){
		return getPreparePage(params);
	}
}

export default {
	state,
	mutations,
	actions
}
