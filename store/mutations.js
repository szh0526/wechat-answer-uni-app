//公共mutation 同步修改store
const setOpenid = function(state, openid) {
	state.openid = openid
}
const setCurrentPage = function(state, currentPage) {
	console.log("公共:",state,currentPage);
	state.currentPage = currentPage
}

export default {
	setOpenid,
	setCurrentPage
}