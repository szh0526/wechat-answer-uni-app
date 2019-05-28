//公共action 异步修改store
const getUserOpenId = async function({
	commit,
	state
}) {
	return await new Promise((resolve, reject) => {
		resolve(true)
	})
}

export default {
	getUserOpenId
}
