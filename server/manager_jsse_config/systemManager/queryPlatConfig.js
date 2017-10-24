/**
 * 	功能：查询平台属性
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SystemDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}

	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		
		var platConfigObj = SystemDomain.queryPlatConfig(sqlAdapter);
		
		$_response_$={
			errorCode:0,
			data:platConfigObj
		};
	} catch (e) {
		logger.error("获取平台属性失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
