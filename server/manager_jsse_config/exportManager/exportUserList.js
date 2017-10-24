/**
 * 描 述：
 * 		导出用户列表
 * 走 向：
 * 		
 * 规 则：
 * 		
 * 时 机：
 *
 * @author niuxiaojie
 */
(function(request, header) {
	var lo = createLogic();
	var userName = request.userName; //用户姓名
	var phoneNO = request.phoneNO; //手机号
	var licenseNO = request.licenseNO; //常用车牌号
	var userStatus = request.userStatus; //用户状态,	(1正常  2灰度	  3黑名单)
	var registDateStart = request.registDateStart; //注册日期开始
	var registDateEnd = request.registDateEnd; //注册日期结束
	var sortFieldName = request.sortFieldName; //排序字段（registDate注册日期）
	var sortDir = request.sortDir || 'DESC'; //排序 （ASC升序  DESC降序）

	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000);
		return;
	}
	
	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//用户列表
	var userList = UserDomain.listUser(sqlExecute, userName, phoneNO, licenseNO, userStatus, registDateStart, registDateEnd, sortFieldName, sortDir);

	var fileName = lo.getFileName();
	logger.debug("生成的报表文件名：" + fileName);
	require("ymt.jsse.jexcel");
	var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
	lo.setHead(jexcelExecute);

	var user;
	for (var i = 0; i < userList.length; i++) {
		user = userList[i];
		jexcelExecute.writeData({
			type: "content",
			data: [
				user.userName || '',
				user.phoneNO || '',
				user.registDate || '',
				user.licenseNO || '',
				userStatusMap[user.userStatus]
			]
		});
	}

	jexcelExecute.close();
	$_response_$ = {
		errorCode: 0,
		data: {
			reportUrl: String(reportUrlPre + fileName + ".xls")
		}
	};
})($_request_param_$, $_request_header_$);



function createLogic() {
	load("/common/_errorCode.js");
	load("/domain/DBUtils.js");
	load("/exportManager/uuid.js");
	load("/common/_importConfig.js");
	load("/exportManager/_statusContant.js");
	load("/exportDomain/UserDomain.js");
	load("/lib/authCheck.js");
	load("/orderManager/common.js");
	var lo = {
		//生成报表文件名
		getFileName: function() {
			var curDate = new Date().Format('yyyyMMdd');
			var curTime = new Date().Format('yyyyMMddHHmmss');
			return curDate + "/" + "userReport" + "/" + "用户查询" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["用户姓名", "用户手机号", "注册日期", "常用车牌号", "用户状态"]
			});
			// 设置列号
			jexcelExecute.setColumnWidth(0, 30);
			jexcelExecute.setColumnWidth(1, 30);
			jexcelExecute.setColumnWidth(2, 20);
			jexcelExecute.setColumnWidth(3, 20);
			jexcelExecute.setColumnWidth(4, 20);
		}
	};
	return lo;
}