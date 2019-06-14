import { getUserReportPage } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getUserReportPage:function({
			dispatch,
			commit,
			state
		},params){
		return getUserReportPage(params);
	}
}

export default {
	state,
	mutations,
	actions
}
