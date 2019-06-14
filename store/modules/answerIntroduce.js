import { getIntroducePage } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getIntroducePage:function({
			dispatch,
			commit,
			state
		},params){
		return getIntroducePage(params);
	}
}

export default {
	state,
	mutations,
	actions
}
