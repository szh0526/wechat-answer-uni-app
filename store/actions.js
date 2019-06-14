//公共action 异步修改store
import {
	getUserQuestionsPayInfo
} from 'api.js';

const initUserQuestionsPayInfo = function({
	dispatch,
	commit,
	state
}, params) {
	return getUserQuestionsPayInfo(params);
}

export default {
	initUserQuestionsPayInfo
}
