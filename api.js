import $ajax from './common/ajax.js';

//接口请求配置
const BASEURL = "http://www.lianaijiazu.com";
const $apiUrl = `${BASEURL}/api`;
const $wxjssdkUrl = `${BASEURL}/wxjssdk`;;
const normalMsg = "接口异常!";

let apiUrl = {
	//介绍
	getIntroducePage: '/introducePage/getIntroducePage',
	clickTest: '/introducePage/clickTest',
	getIntroduceQRCode: '/introducePage/getIntroduceQRCode',

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
	getUserReportPage: '/userReport/getUserReportPage',

	//支付
	userPay: '/questions/userPay',
	unifiedOrder: '/orders/unifiedOrder'
}

for (let [key, value] of Object.entries(apiUrl)) {
	apiUrl[key] = `${$apiUrl}${value}`;
}

const fetch = async function(url, params, method = "GET") {
	const commonParams = {
		questionsId: window.wxanswer.questionsId,
		userId: window.wxanswer.userId,
		page: window.wxanswer.page,
	}
	params = Object.assign({}, params, commonParams);
	return await new Promise((resolve, reject) => {
		$ajax.get(url, params).then(res => {
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
	})
}

const getIntroducePage = function(params) {
	return fetch(apiUrl["getIntroducePage"], params);
}

const clickTest = function(params) {
	return fetch(apiUrl["clickTest"], params);
}

const getIntroduceQRCode = function(params) {
	return fetch(apiUrl["getIntroduceQRCode"], params);
}
const getPreparePage = function(params) {
	return fetch(apiUrl["getPreparePage"], params);
}
const getQuestionsTitles = function(params) {
	return fetch(apiUrl["getQuestionsTitles"], params);
}
const getNextQuestion = function(params) {
	return fetch(apiUrl["getNextQuestion"], params);
}
const getPreviousQuestion = function(params) {
	return fetch(apiUrl["getPreviousQuestion"], params);
}
const getUserPayAmount = function(params) {
	return fetch(apiUrl["getUserPayAmount"], params);
}
const userShare = function(params) {
	return fetch(apiUrl["userShare"], params);
}
const getUserComment = function(params) {
	return fetch(apiUrl["getUserComment"], params);
}
const saveUserComment = function(params) {
	return fetch(apiUrl["saveUserComment"], params);
}
const getUserPayInfo = function(params) {
	return fetch(apiUrl["getUserPayInfo"], params);
}
const getUserQuestionsPayInfo = function(params) {
	return fetch(apiUrl["getUserQuestionsPayInfo"], params);
}
const getUserInfo = function(params) {
	return fetch(apiUrl["getUserInfo"], params);
}
const getNextUserReport = function(params) {
	return fetch(apiUrl["getNextUserReport"], params);
}
const getPreviousUserReport = function(params) {
	return fetch(apiUrl["getPreviousUserReport"], params);
}
const createUserReport = function(params) {
	return fetch(apiUrl["createUserReport"], params);
}
const getUserReportPage = function(params) {
	return fetch(apiUrl["getUserReportPage"], params);
}
const getSignature = function(params) {
	return fetch(`${$wxjssdkUrl}/getSignature`, params);
}
const userPay = function(params) {
	return fetch(apiUrl["userPay"], params);
}
const unifiedOrder = function(params) {
	return fetch(apiUrl["unifiedOrder"], params);
}

export {
	getIntroducePage,
	clickTest,
	getIntroduceQRCode,
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
	getUserReportPage,
	getSignature,
	userPay,
	unifiedOrder
}
