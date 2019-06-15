import { getNextUserReport,getPreviousUserReport  } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getNextUserReport:function({
			dispatch,
			commit,
			state
		},params){
		return getNextUserReport(params);
	},
	getPreviousUserReport:function({
			dispatch,
			commit,
			state
		},params){
		return getPreviousUserReport(params);
	}
}

export default {
	state,
	mutations,
	actions
}
