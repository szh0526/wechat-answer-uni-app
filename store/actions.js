//公共action 异步修改store
import {
	getSignature,
	getUserPayAmount,
	getUserQuestionsPayInfo
} from 'api.js';

const getSignatureInfo = function({
	dispatch,
	commit,
	state
}, params) {
	return getSignature(params);
}

const getUserPayAmountInfo = function({
	dispatch,
	commit,
	state
}, params) {
	return getUserPayAmount(params);
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
	getUserPayAmountInfo,
	initUserQuestionsPayInfo
}
