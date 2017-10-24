/**
 * 	功能：删除供应商险别代码
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
	
	//供应商险别代码ID
	var supplierKindID = param.supplierKindID;
	
	try {
		if(!supplierKindID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		SupplierKindDomain.delSupplierKind(sqlAdapter,supplierKindID);
		sqlAdapter.commitAndClose();//提交事务

		$_response_$={
			errorCode:0
		};
	} catch (e) {
	    logger.error("删除供应商险别代码失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
