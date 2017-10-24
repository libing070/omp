/**
 * 	功能：查询平台险别列表
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/ProtectPlanDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	try {
		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var returnResultList = ProtectPlanDomain.queryPlatKindCodeList(sqlAdapter);
		
		$_response_$={
			errorCode:0,
			data: returnResultList

		};
	} catch (e) {
		logger.error("获取保障方案列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
