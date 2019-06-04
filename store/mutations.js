//公共mutation 同步修改store
const setCode = function(state, access_code) {
	state.access_code = access_code
}
const setState = function(state, access_state) {
	state.access_state = access_state
}
const setOpenid = function(state, openid) {
	state.openid = openid
}
const setCurrentPage = function(state, currentPage) {
	console.log("公共:",state,currentPage);
	state.currentPage = currentPage
}

export default {
	setState,
	setCode,
	setOpenid,
	setCurrentPage
}