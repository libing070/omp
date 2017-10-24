/**
 * 	功能：查询精友库DB文件列表
 *  @author niuxiaojie
 */
load("/common/_importConfig.js");
load("/domain/DBUtils.js");
load("/domain/JYKCarfileDomain.js");
load("/lib/authCheck.js");
load("/common/_errorCode.js");
(function(request, header) {
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var sqlExecute = sqlAdpterHandler.getInstance(false);
	
	//查询精友库DB文件列表
	var jykCarList = JYKCarfileDomain.listjykCar(sqlExecute);
	
	$_response_$ = {
		errorCode: 0,
		data: jykCarList
	};
})($_request_param_$, $_request_header_$);