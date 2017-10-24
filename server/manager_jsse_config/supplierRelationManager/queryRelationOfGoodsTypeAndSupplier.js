/**
 * 	功能：查询产品与供应商的关系列表
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
	//产品线ID
	var goodsTypeID = param.goodsTypeID;
	//城市ID
	var cityID	= param.cityID;
	//供应商ID
	var supplierID	= param.supplierID;	

	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var relList = SupplierDomain.queryRelOfGTypeSup(sqlAdapter,goodsTypeID,cityID,supplierID);
		
		$_response_$={
			errorCode:0,
			data:relList
		};
	} catch (e) {
		logger.error("获取产品与供应商的关系列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
