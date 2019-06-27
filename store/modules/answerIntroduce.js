import { 
	getIntroducePage,
	clickTest,
	getIntroduceQRCode
} from 'api.js';

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
	},
	clickTest:function({
			dispatch,
			commit,
			state
		},params){
		return clickTest(params);
	},
	getIntroduceQRCode:function({
			dispatch,
			commit,
			state
		},params){
		return getIntroduceQRCode(params);
	},
}

export default {
	state,
	mutations,
	actions
}
