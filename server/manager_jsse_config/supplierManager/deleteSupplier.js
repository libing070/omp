/**
 * 	功能：删除供应商
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
	
	try {
		if(!supplierID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		//判断产品是否存在关联
		var supRelCount = SupplierDomain.findSupplierRel(sqlAdapter,supplierID);
		if(supRelCount > 0) {
			logger.error("当选中的供应商在“产品与供应商关系”里有维护，不允许删除");
			errorResponse(7005);
			return;
		}
		
		//判断支付订单是否存在关联
		var orderRelCount = SupplierDomain.findPayOrderRel(sqlAdapter,supplierID);
		if(orderRelCount > 0) {
			logger.error("该供应商已存在订单记录，不允许删除");
			errorResponse(7023);
			return;
		}
		
		//删除供应商
		SupplierDomain.delSupplier(sqlAdapter,supplierID);
		
		sqlAdapter.commitAndClose();//提交事务

		$_response_$={
			errorCode:0
		};
	} catch (e) {
	    logger.error("删除供应商失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
