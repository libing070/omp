/**
 * 	功能：查询代码定义
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
	
	var codeType = param.codeType;

	try {
		if(!codeType) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		
		var codeTypeList = SystemDomain.queryBaseCode(sqlAdapter,codeType);
		
		$_response_$={
			errorCode:0,
			data:codeTypeList
		};
	} catch (e) {
		logger.error("获取代码定义失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
