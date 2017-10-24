/**
 * 	功能：删除产品与供应商的关系
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
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		
		//获取城市供应商ID
		var citySupplierID = SupplierDomain.getCitySupplierID(sqlAdapter,goodsTypeCitySupplierRelID);
		//查询城市供应商是否有其他产品线配置,排除自身的产品线
		var relCount = SupplierDomain.checkRelOfCitySup(sqlAdapter,goodsTypeCitySupplierRelID,citySupplierID)
		
		//删除产品与城市供应商的关系
		SupplierDomain.delRelOfGTypeSup(sqlAdapter,goodsTypeCitySupplierRelID);
		
		//如果改城市供应商没有其他产品线的配置，则同时删除 城市与供应商的关联关系
		if(relCount == 0) {
			SupplierDomain.delRelOfCitySup(sqlAdapter,goodsTypeCitySupplierRelID);
		}
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("删除产品与供应商的关系失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
