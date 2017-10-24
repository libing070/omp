/**
 * 	功能：获取常规工作时间设置
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SchedulingDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		
		var workingTimeObj = SchedulingDomain.getWorkingTime(sqlAdapter);
		
		$_response_$={
			errorCode:0,
			data:workingTimeObj
		};
	} catch (e) {
		logger.error("获取常规工作时间设置失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
