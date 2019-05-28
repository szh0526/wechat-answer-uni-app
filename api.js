//接口请求配置
const $apiUrl = 'http://localhost:3999/api/';

const success = (res, resolve, reject) => {
	if (res && res.statusCode == 200) {
		if (res.data && res.data.code == 200) {
			resolve(res.data.data);
		} else {
			reject(new Error(res.data && res.data.message ? res.data.message : "接口异常!"));
		}
	} else {
		reject(new Error(res.errorMsg));
	}
}

let apiUrl = {
	getAnswerIntroduce: 'index/index',
}

for (let [key, value] of Object.entries(apiUrl)) {
	apiUrl[key] = `${$apiUrl}${value}`;
}

const getAnswerIntroducePromise = async function(params) {
	return await new Promise((resolve, reject) => {
		uni.request({
			url: apiUrl["getAnswerIntroduce"],
			method: 'POST',
			data: params,
			success: (res) => {
				success(res, resolve, reject);
			},
			fail: () => {
				reject(new Error("接口异常!"));
			}
		});
	})
}

export default {
	getAnswerIntroducePromise
}
