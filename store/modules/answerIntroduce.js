import { 
	getIntroducePage,
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
