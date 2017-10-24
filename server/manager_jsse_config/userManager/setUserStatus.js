/**
 * 	功能：设置用户状态
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/UserDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var userID = request.userID; //用户ID
	var userStatus = request.userStatus; //用户状态， (1正常  2灰度	  3黑名单)
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if (!userID || !userStatus || ['1', '2', '3'].indexOf(userStatus) == -1) {
		errorResponse(-1);
		return;
	}

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//设置用户状态
	UserDomain.updateUserStatus(sqlExecute, userID, userStatus);

	$_response_$ = {
		errorCode: 0
	};
})($_request_param_$, $_request_header_$);