/**
 * 	功能：新增城市 
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
	
	//城市编码
	var cityNumber = param.cityNumber;
	//城市名称
	var cityName = param.cityName;
	//经度
	var lon = param.lon;
	//维度
	var lat = param.lat;
	//城市在地图中的ID 
	var mapCityID = param.mapCityID;
	
	try {
		if(!cityName || !cityNumber) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		//校验录入的城市名编码是否已经存在
		var sqlAdapter=sqlAdpterHandler.getInstance(true); 
		var cityNumberCount = CityDomain.checkCityByNumber(sqlAdapter,cityNumber);
		if(cityNumberCount >0) {
			logger.error("该城市编码已经存在，请重新填写");
			errorResponse(7020);
			return;
		}
		
		//校验录入的城市名称是否已经存在
		var cityCount = CityDomain.checkCityByName(sqlAdapter,cityName);
		if(cityCount>0) {
			logger.error("该城市已存在，请重新输入");
			errorResponse(7001);
			return;
		}
		
		var cityObj={
					cityName:cityName,
					cityNumber:cityNumber,
					lon: lon,
					lat: lat,
					mapCityID: mapCityID,
					status: 'N'
			};
			
				
		var cityID = CityDomain.addCity(sqlAdapter,cityObj);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0,
			data:{
				cityID:cityID
			}
			
		};
		
	} catch (e) {
		logger.error("新增城市失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
