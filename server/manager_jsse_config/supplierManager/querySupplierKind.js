/**
 * 	功能：查询供应商险别代码
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
	//供应商ID
	var supplierID = param.supplierID;
	
	
	try {
		if(!supplierID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var supplierKindList = SupplierKindDomain.querySupplierKind(sqlAdapter,supplierID);
		
		$_response_$={
			errorCode:0,
			data:supplierKindList			
		};
	} catch (e) {
		logger.error("获取供应商险别代码失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
