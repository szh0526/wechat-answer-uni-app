import $ajax from './common/ajax.js';

//接口请求配置
const $apiUrl = 'http://pxhwyn.natappfree.cc/api';
const normalMsg = "接口异常!";

let apiUrl = {
	//介绍
	getIntroducePage: '/introducePage/getIntroducePage',
	getPreparePage: '/preparePage/getPreparePage',
	//题库
	getQuestionsTitles: '/questions/getQuestionsTitles',
	getNextQuestion: '/questions/getNextQuestion',
	getPreviousQuestion: '/questions/getPreviousQuestion',
	getUserPayAmount: '/questions/getUserPayAmount',
	userShare: '/questions/userShare',
	//评论
	getUserComment: '/userComment/getUserComment',
	saveUserComment: '/userComment/saveUserComment',
	//用户信息
	getUserPayInfo: '/userInfo/getUserPayInfo',
	getUserQuestionsPayInfo: '/userInfo/getUserQuestionsPayInfo',
	getUserInfo: '/userInfo/getUserInfo',
	//报告页
	getNextUserReport: '/userReport/getNextUserReport',
	getPreviousUserReport: '/userReport/getPreviousUserReport',
	createUserReport: '/userReport/createUserReport',
	getUserReportPage: '/userReport/getUserReportPage'
}

for (let [key, value] of Object.entries(apiUrl)) {
	apiUrl[key] = `${$apiUrl}${value}`;
}

const fetch = async function(apiName, params, method = "GET") {
	return await new Promise((resolve, reject) => {
		$ajax.get(apiUrl[apiName], params).then(res => {
				//console.log(res);
				if (res && res.code == 200) {
					resolve(res.data);
				} else {
					reject(new Error(res.message ? res.message : normalMsg));
				}
			})
			.catch(err => {
				reject(new Error(normalMsg));
			})
		// uni.request({
		// 	url: apiUrl[apiName],
		// 	method,
		// 	data: params,
		// 	success: (res) => {
		// 		if (res.data && res.data.code == 200) {
		// 			resolve(res.data);
		// 		} else {
		// 			reject(new Error(res.message ? res.message : normalMsg));
		// 		}
		// 	},
		// 	fail: () => {
		// 		reject(new Error(normalMsg));
		// 	}
		// });
	})
}

const getIntroducePage = function(params) {
	return fetch("getIntroducePage", params);
}
const getPreparePage = function(params) {
	return fetch("getPreparePage", params);
}
const getQuestionsTitles = function(params) {
	return fetch("getQuestionsTitles", params);
}
const getNextQuestion = function(params) {
	return fetch("getNextQuestion", params);
}
const getPreviousQuestion = function(params) {
	return fetch("getPreviousQuestion", params);
}
const getUserPayAmount = function(params) {
	return fetch("getUserPayAmount", params);
}
const userShare = function(params) {
	return fetch("userShare", params);
}
const getUserComment = function(params) {
	return fetch("getUserComment", params);
}
const saveUserComment = function(params) {
	return fetch("saveUserComment", params);
}
const getUserPayInfo = function(params) {
	return fetch("getUserPayInfo", params);
}
const getUserQuestionsPayInfo = function(params) {
	return fetch("getUserQuestionsPayInfo", params);
}
const getUserInfo = function(params) {
	return fetch("getUserInfo", params);
}
const getNextUserReport = function(params) {
	return fetch("getNextUserReport", params);
}
const getPreviousUserReport = function(params) {
	return fetch("getPreviousUserReport", params);
}
const createUserReport = function(params) {
	return fetch("createUserReport", params);
}
const getUserReportPage = function(params) {
	return fetch("getUserReportPage", params);
}

export {
	getIntroducePage,
	getPreparePage,
	getQuestionsTitles,
	getNextQuestion,
	getPreviousQuestion,
	getUserPayAmount,
	userShare,
	getUserComment,
	saveUserComment,
	getUserPayInfo,
	getUserQuestionsPayInfo,
	getUserInfo,
	getNextUserReport,
	getPreviousUserReport,
	createUserReport,
	getUserReportPage
}
