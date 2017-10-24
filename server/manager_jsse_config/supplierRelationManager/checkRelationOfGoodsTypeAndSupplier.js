/**
 * 	功能：判断产品与供应商关系在“商品管理”中是否有维护
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
	
	//产品与供应商、城市的关系ID
	var goodsTypeCitySupplierRelID	= param.goodsTypeCitySupplierRelID; 

	try {
		if(!goodsTypeCitySupplierRelID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		//判断该产品与供应商关系已在“商品管理”中是否有维护，如果有维护，则提示是否需要删除
		//只用于提示，如果还是确认删除，则允许删除
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var flag = SupplierDomain.checkRelOfGTypeSup(sqlAdapter,goodsTypeCitySupplierRelID);
		
		$_response_$={
			errorCode:0,
			data:flag
		};
	} catch (e) {
		logger.error("判断产品与供应商关系在“商品管理”中是否有维护");
		throw e;
	}
})($_request_param_$, $_request_header_$);
