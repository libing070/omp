/**
 * 	功能：查询供应商信息
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SupplierDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	//供应商ID
	var supplierID = param.supplierID;
	//状态
	var status = param.status;
	
	try {
		
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var supplierList = SupplierDomain.querySupplierList(sqlAdapter,supplierID,status);
		
		$_response_$={
			errorCode:0,
			data:supplierList
			
		};
	} catch (e) {
		logger.error("获取供应商信息失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
