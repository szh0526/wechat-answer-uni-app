//公共action 异步修改store
import {
	getSignature,
	getUserQuestionsPayInfo
} from 'api.js';

const getSignatureInfo = function({
	dispatch,
	commit,
	state
}, params) {
	return getSignature(params);
}

const initUserQuestionsPayInfo = function({
	dispatch,
	commit,
	state
}, params) {
	return getUserQuestionsPayInfo(params);
}

export default {
	getSignatureInfo,
	initUserQuestionsPayInfo
}
