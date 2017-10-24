/**
 * 	功能：删除城市 
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/CityDomain.js");
(function(param, header) {
	
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//城市ID
	var cityID = param.cityID;
	
	
	try {
		if(!cityID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		//查询城市是否与供应商存在关联关系，如果存在，则不允许删除。
		var cityRelCount = CityDomain.findCityRel(sqlAdapter,cityID);
		if(cityRelCount>0) {
			logger.error("当选中的城市记录在“产品与供应商关系”里有维护，不允许删除");
			errorResponse(7002);
			return;
		}
		
		//查询用户车辆行驶城市是否存在关联关系
		var carRelCount = CityDomain.findCarRel(sqlAdapter,cityID);
		if(carRelCount>0) {
			logger.error("该城市已存在用户车辆记录，不允许删除");
			errorResponse(7022);
			return;
		}
		
		//删除城市
		CityDomain.delCity(sqlAdapter,cityID);
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
	    logger.error("删除城市失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
