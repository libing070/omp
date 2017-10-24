/**
 * 时间格式化
 * @param {Object} fmt
 */
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"H+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

/**
 * 字符串时间，添加月数
 * @param {Object} dtstr
 * @param {Object} n
 */
function addmulMonth(dtstr, n) { // n个月后
	if (n >= 12 || n < 0) {
		return null;
	}
	var s = dtstr.split("-");
	var yy = parseInt(s[0]);
	var mm = parseInt(s[1] - 1);
	var dd = parseInt(s[2]);
	var dt = new Date(yy, mm, dd);
	dt.setMonth(dt.getMonth() + n);
	if ((dt.getYear() * 12 + dt.getMonth()) > (yy * 12 + mm + n)) {
		dt = new Date(dt.getYear(), dt.getMonth(), 0);
	}
	return dt.Format("yyyy-MM-dd HH:mm:ss");
}


/**
 * 字符串时间，添加月数
 * @param {Object} dtstr
 * @param {Object} n
 */
function addmulMonth2(dtstr, n, fomt) { // n个月后
	if (n >= 12 || n < 0) {
		return null;
	}
	var s = dtstr.split("-");
	var yy = parseInt(s[0]);
	var mm = parseInt(s[1] - 1);
	var dd = parseInt(s[2]);
	var dt = new Date(yy, mm, dd);
	dt.setMonth(dt.getMonth() + n);
	if ((dt.getYear() * 12 + dt.getMonth()) > (yy * 12 + mm + n)) {
		dt = new Date(dt.getYear(), dt.getMonth(), 0);
	}
	return dt.Format(fomt);
}
/**
 * 字符串时间,添加天数
 * @param {Object} inDate
 * @param {Object} n
 */
function addmulDate(inDate, n) {
	//可以加上错误处理
	inDate = new Date(inDate.replace(/-/g, "/")).getTime();
	inDate = inDate + n * 24 * 60 * 60 * 1000
	inDate = new Date(inDate);
	return inDate.Format("yyyy-MM-dd HH:mm:ss");
}

/**
 * 字符串时间,添加天数
 * @param {Object} inDate
 * @param {Object} n
 * @param {Object} format
 */
function addmulDate2(inDate, n, format) {
	//可以加上错误处理
	inDate = new Date(inDate.replace(/-/g, "/")).getTime();
	inDate = inDate + n * 24 * 60 * 60 * 1000
	inDate = new Date(inDate);
	return inDate.Format(format);
}
/**
 * 字符串时间,添加小时数
 * @param {Object} inDate
 * @param {Object} n
 */
function addmulHour(inDate, n) {
	//可以加上错误处理
	inDate = new Date(inDate.replace(/-/g, "/")).getTime();
	inDate = inDate + n * 60 * 60 * 1000
	inDate = new Date(inDate);
	return inDate.Format("yyyy-MM-dd HH:mm:ss");
}

/**
 * 字符串时间,添加小时数
 * @param {Object} inDate
 * @param {Object} n
 * @param {Object} format
 */
function addmulHour2(inDate, n, format) {
	//可以加上错误处理
	inDate = new Date(inDate.replace(/-/g, "/")).getTime();
	inDate = inDate + n  * 60 * 60 * 1000
	inDate = new Date(inDate);
	return inDate.Format(format);
}

/**
 * 数字自动补领
 * @param {Object} num
 * @param {Object} n
 */
function pad(num, n) {
	var len = (num+"").length;
	var str = num+"";
	while (len < n) {
		str = "0" + str;
		len++;
	}
	return str;
}

