/**
 * 	功能：查询已有的城市列表 
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
	//状态
	var status = param.status;
	
	try {
		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var cityList = CityDomain.queryCityList(sqlAdapter,cityID,status);
		
		$_response_$={
			errorCode:0,
			data:cityList
			
		};
	} catch (e) {
		logger.error("获取城市列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
