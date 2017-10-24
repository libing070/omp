/**
 * 	功能：编辑供应商份额
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
	
	var relList = param.relList;
	
	try {
		if(!relList) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		SupplierDomain.editShareOfSupplier(sqlAdapter,relList);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("编辑供应商份额失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
