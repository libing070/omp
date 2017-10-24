/**
 * 	功能：常规工作时间设置
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
	var workingStart = param.workingStart;//常规工作时间开始
	var workingEnd = param.workingEnd;//常规工作时间结束
	
	try {
		if(!workingStart || !workingEnd) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		
		SchedulingDomain.setWorkingTime(sqlAdapter,workingStart,workingEnd);
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
		};
	} catch (e) {
		logger.error("常规工作时间设置失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
