/**
 * 	功能：查询用户基本详情
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/UserDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var userID = request.userID; //用户ID
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if (!userID) {
		errorResponse(-1);
		return;
	}

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//用户基本详情
	var userDetail = UserDomain.findUserDetailByID(sqlExecute, userID);

	$_response_$ = {
		errorCode: 0,
		data: userDetail
	};
})($_request_param_$, $_request_header_$);