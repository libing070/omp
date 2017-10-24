/**
 * 	功能：查询平台险别下拉列表
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SupplierKindDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var kindList = SupplierKindDomain.queryAllKind(sqlAdapter);
		
		$_response_$={
			errorCode:0,
			data:kindList
		};
	} catch (e) {
		logger.error("获取平台险别下拉列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
