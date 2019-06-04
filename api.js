//接口请求配置
const $apiUrl = 'http://localhost:6188/api';
const normalMsg = "接口异常!";

let apiUrl = {
	getAnswerIntroduce: '/index/index',
}

for (let [key, value] of Object.entries(apiUrl)) {
	apiUrl[key] = `${$apiUrl}${value}`;
}

const fetch = async function(apiName, params, method = "GET") {
	return await new Promise((resolve, reject) => {
		uni.request({
			url: apiUrl[apiName],
			method,
			data: params,
			success: (res) => {
				if (res && res.statusCode == 200) {
					if (res.data && res.data.code == 200) {
						resolve(res.data.data);
					} else {
						reject(new Error(res.data && res.data.message ? res.data.message : normalMsg));
					}
				} else {
					reject(new Error(res.errorMsg || normalMsg));
				}
			},
			fail: () => {
				reject(new Error(normalMsg));
			}
		});
	})
}

const getAnswerIntroduce = function(params) {
	return fetch("getAnswerIntroduce", params);
}

export {
	getAnswerIntroduce
}
