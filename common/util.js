function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}

function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDay()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	formatTimeToStr: function(time) {
		let date = new Date(time);
		var o = {
			h: date.getHours(), //小时
			m: date.getMinutes(), //分
			s: date.getSeconds() //秒
		};
		var _h = o.h >= 1; //如果大于1小时则展示小时
		return (
			(_h ? ((o.h < 10 ? '0' + o.h : o.h) + ':') : "") +
			(o.m < 10 ? '0' + o.m : o.m) + ':' +
			(o.s < 10 ? '0' + o.s : o.s)
		);
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};

let json2ParStr = (obj, bol = true) => {
	let query = [];
	for (let [k, v] of Object.entries(obj)) {
		if (v.constructor == Array) {
			v.map((value, index, array) => {
				if (typeof value == 'object') {
					for (let [e, f] of Object.entries(value)) {
						query.push(`${k}[${index}][${e}]=${bol ? encodeURIComponent(f) : f}`);
					}
				} else {
					query.push(`${k}[${index}]=${bol ? encodeURIComponent(value) : value}`);
				}
			});
		} else {
			query.push(`${k}=${bol ? encodeURIComponent(v) : v}`);
		}
	}
	return query.join('&');
}

let getQueryString = (name) => {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return unescape(decodeURIComponent(r[2]));
	} else return null;
}

let urlParamToObj = (url) => {
	var arr1 = url.split("?");
	var params = arr1[1].split("&");
	var obj = {}; //声明对象
	for (var i = 0; i < params.length; i++) {
		var param = params[i].split("=");
		obj[param[0]] = param[1]; //为对象赋值
	}
	return obj;
}

module.exports = {
	formatTime: formatTime,
	formatLocation: formatLocation,
	dateUtils: dateUtils,
	getQueryString,
	json2ParStr,
	urlParamToObj
}
