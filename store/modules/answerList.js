import { getCategorys,getScales } from 'api.js';

const state = {}

const mutations = {
}

const actions = {
	getCategorys:function({
			dispatch,
			commit,
			state
		},params){
		return getCategorys(params);
	},
	getScales:function({
			dispatch,
			commit,
			state
		},params){
		return getScales(params);
	}
}

export default {
	state,
	mutations,
	actions
}
