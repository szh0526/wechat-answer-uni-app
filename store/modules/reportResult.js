import { getUserReportPage,createUserReport } from 'api.js';

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
	},
	createUserReport:function({
			dispatch,
			commit,
			state
		},params){
		return createUserReport(params);
	},
}

export default {
	state,
	mutations,
	actions
}
