/**
 * @author nongjinmei
 * @description 装机量与用户转化率查询
 * 
 */
load('/common/_errorCode.js');
load('/lib/authCheck.js');
load('/domain/DBUtils.js');
load('/dataManager/StaticsUtil.js');
load('/domain/UserDomain.js');
(function(request,header){
	//登录校验
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//获取基本参数
	var period=request.period||"0";//时间区间  0昨天1一周2一月3一年
	if(!period) {
		logger.error("参数缺失");
		errorResponse(-1);
		return;
	}
	
	try {
		var sqlExecute=sqlAdpterHandler.getInstance(false);
		//新增用户统计
		var userCountList = UserDomain.queryUserCountByPeriod(sqlExecute, period);
		userCountList = StaticsUtil.getStandardData(userCountList, period);
		//求和
		if(userCountList.length>0){
			var s=parseInt(userCountList[0].count);
			for(var i=1;i<userCountList.length;i++){
				s=parseInt(userCountList[i].count)+s;
				userCountList[i].count=(String)(s);
			}
		}
		
		//装机量统计
		var conversionList = UserDomain.queryConversionByPeriod(sqlExecute, period);
		conversionList = StaticsUtil.getStandardData(conversionList, period);
		//求和
		if(conversionList.length>0){
			var s=parseInt(conversionList[0].count);
			for(var i=1;i<conversionList.length;i++){
				s=parseInt(conversionList[i].count)+s;
				conversionList[i].count=(String)(s);
			}
		}
		
		var resultList = new Array();
		var userCount;
		var conversion;
		var result;
		for(var i=0; i < userCountList.length; i++) {
				userCount = userCountList[i];
			for(var j=0; j < conversionList.length; j++) {
				conversion = conversionList[j];
				if(userCount.businessTime == conversion.businessTime) {
					result = new Object();
					result["countTime"] = userCount.businessTime; //统计时间 
					result["deviceCount"] = conversion.count; //装机量
					result["registerCount"] = userCount.count; //注册用户量
					resultList.push(result);
				}
			}
		}
		
		$_response_$={
			errorCode:0,
			data:resultList
		};
		
	} catch (e) {
		logger.error(e);
		$_response_$={
				errorCode:-100,
				errMsg:e
		};
	}
	
})($_request_param_$,$_request_header_$);

