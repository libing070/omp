/**
 * 	功能：查询保障方案详情
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
	//保障方案ID
	var protectPlanID = param.protectPlanID;
	
	try {
		if(!protectPlanID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var planDetailList = ProtectPlanDomain.queryProtectPlanDetail(sqlAdapter,protectPlanID);
		
		$_response_$={
			errorCode:0,
			data:planDetailList
		};
	} catch (e) {
		logger.error("获取保障方案详情失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
