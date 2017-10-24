/**
 * 	功能：查询活动列表
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/ActivityDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var activityList = ActivityDomain.queryActivityList(sqlAdapter);
		
		$_response_$={
			errorCode:0,
			data:activityList
		};
	} catch (e) {
		logger.error("获取活动列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
