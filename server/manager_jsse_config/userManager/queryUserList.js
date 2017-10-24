/**
 * 	功能：查询用户列表
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/UserDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var userName = request.userName; //用户姓名
	var phoneNO = request.phoneNO; //手机号
	var licenseNO = request.licenseNO; //常用车牌号
	var userStatus = request.userStatus; //用户状态,	(1正常  2灰度	  3黑名单)
	var registDateStart = request.registDateStart; //注册日期开始
	var registDateEnd = request.registDateEnd; //注册日期结束
	var sortFieldName = request.sortFieldName || 'registDate'; //排序字段（registDate注册日期）
	var sortDir = request.sortDir || 'DESC'; //排序 （ASC升序  DESC降序）
	var pageNumber = request.pageNumber || 1; //页码
	var pageSize = request.pageSize || 10; //页大小

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//用户总条数
	var userCount = UserDomain.getUserCount(sqlExecute, userName, phoneNO, licenseNO, userStatus, registDateStart, registDateEnd);
	//用户列表
	var userList = UserDomain.listUser(sqlExecute, userName, phoneNO, licenseNO, userStatus, registDateStart, registDateEnd, sortFieldName, sortDir, pageNumber, pageSize);

	$_response_$ = {
		errorCode: 0,
		data: {
			totalCount: userCount,
			userList: userList
		}
	};
})($_request_param_$, $_request_header_$);