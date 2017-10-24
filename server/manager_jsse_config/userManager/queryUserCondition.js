/**
 * 	功能：用户属性分析查询
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/UserDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var period = request.period || "0"; //0  昨天    1一周    2一月     3一年
	if(!period) {
		logger.error("参数缺失");
		errorResponse(-1);
		return;
	}
	
	var sqlExecute = sqlAdpterHandler.getInstance(false);
	
	var agePeriod=new Object() ;
	var sexPeriod=new Object();
	var devicePeriod=new Object();
	var cityList=new Array();
	
	if(period =="0") {
		//前一天
		//用户年龄分布
		var agePeriodList = UserDomain.queryUserAgePeriod(sqlExecute, "DAY");
		for(var m=0; m < agePeriodList.length; m++){
			var yb_level = agePeriodList[m].yb_level;
			var count = agePeriodList[m].count;
			var sumCount = agePeriodList[m].sumCount;
//			if(yb_level =="period_0") {
//				var period_0 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
//				agePeriod["period_0"] = period_0;
//			}
			if(yb_level =="period_1") {
				var period_1 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_1"] = period_1;
			}
			if(yb_level =="period_2") {
				var period_2 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_2"] = period_2;
			}
			if(yb_level =="period_3") {
				var period_3 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_3"] = period_3;
			}
			if(yb_level =="period_4") {
				var period_4 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_4"] = period_4;
			}
			if(yb_level =="period_5") {
				var period_5 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_5"] = period_5;
			}
			if(yb_level =="period_6") {
				var period_6 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_6"] = period_6;
			}
		}
		
		//用户性别分布
		var sexPeriodList = UserDomain.queryUserSexPeriod(sqlExecute, "DAY");
		for(var i=0; i < sexPeriodList.length; i++){
			var ownerSex = sexPeriodList[i].ownerSex;
			var count = sexPeriodList[i].count;
			var sumCount = sexPeriodList[i].sumCount;
			if(ownerSex =="M") {
				var male = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				sexPeriod["male"] = male;
			}
			if(ownerSex =="F") {
				var female = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				sexPeriod["female"] = female;
			}
		}
		
		//设备分布
		var devicePeriodList = UserDomain.queryUserDevicePeriod(sqlExecute, "DAY");
		for(var j=0; j < devicePeriodList.length; j++){
			var deviceType = devicePeriodList[j].deviceType;
			var count = devicePeriodList[j].count;
			var sumCount = devicePeriodList[j].sumCount;
			if(deviceType =="ios") {
				var ios = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				devicePeriod["ios"] = ios;
			}
			if(deviceType =="android") {
				var android = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				devicePeriod["android"] = android;
			}
		}
		
		//地域分布
		var cityPeriodList = UserDomain.queryUserCityPeriod(sqlExecute, "DAY");
		for(var k=0; k < cityPeriodList.length; k++){
			var cityPeriod = new Object();
			var cityID = cityPeriodList[k].cityID;
			var cityName = cityPeriodList[k].cityName;
			var citycount = cityPeriodList[k].count;
			var citysumCount = cityPeriodList[k].sumCount;
			var cityrate = (String)(Math.round(citycount / citysumCount * 10000) / 100.00 + "%");
			cityPeriod["cityID"] = cityID;
			cityPeriod["cityName"] = cityName;
			cityPeriod["rate"] = cityrate;
			cityList.push(cityPeriod);
		}
		
	}else if(period =="1") {
		//最近一周
		//用户年龄分布
		var agePeriodList = UserDomain.queryUserAgePeriod(sqlExecute, "WEEK");
		for(var m=0; m < agePeriodList.length; m++){
			var yb_level = agePeriodList[m].yb_level;
			var count = agePeriodList[m].count;
			var sumCount = agePeriodList[m].sumCount;
//			if(yb_level =="period_0") {
//				var period_0 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
//				agePeriod["period_0"] = period_0;
//			}
			if(yb_level =="period_1") {
				var period_1 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_1"] = period_1;
			}
			if(yb_level =="period_2") {
				var period_2 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_2"] = period_2;
			}
			if(yb_level =="period_3") {
				var period_3 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_3"] = period_3;
			}
			if(yb_level =="period_4") {
				var period_4 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_4"] = period_4;
			}
			if(yb_level =="period_5") {
				var period_5 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_5"] = period_5;
			}
			if(yb_level =="period_6") {
				var period_6 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_6"] = period_6;
			}
		}
		
		//用户性别分布
		var sexPeriodList = UserDomain.queryUserSexPeriod(sqlExecute, "WEEK");
		for(var i=0; i < sexPeriodList.length; i++){
			var ownerSex = sexPeriodList[i].ownerSex;
			var count = sexPeriodList[i].count;
			var sumCount = sexPeriodList[i].sumCount;
			if(ownerSex =="M") {
				var male = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				sexPeriod["male"] = male;
			}
			if(ownerSex =="F") {
				var female = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				sexPeriod["female"] = female;
			}
		}
		
		//设备分布
		var devicePeriodList = UserDomain.queryUserDevicePeriod(sqlExecute, "WEEK");
		for(var j=0; j < devicePeriodList.length; j++){
			var deviceType = devicePeriodList[j].deviceType;
			var count = devicePeriodList[j].count;
			var sumCount = devicePeriodList[j].sumCount;
			if(deviceType =="ios") {
				var ios = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				devicePeriod["ios"] = ios;
			}
			if(deviceType =="android") {
				var android = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				devicePeriod["android"] = android;
			}
		}
		
		//地域分布
		var cityPeriodList = UserDomain.queryUserCityPeriod(sqlExecute, "WEEK");
		for(var k=0; k < cityPeriodList.length; k++){
			var cityPeriod = new Object();
			var cityID = cityPeriodList[k].cityID;
			var cityName = cityPeriodList[k].cityName;
			var citycount = cityPeriodList[k].count;
			var citysumCount = cityPeriodList[k].sumCount;
			var cityrate = (String)(Math.round(citycount / citysumCount * 10000) / 100.00 + "%");
			cityPeriod["cityID"] = cityID;
			cityPeriod["cityName"] = cityName;
			cityPeriod["rate"] = cityrate;
			cityList.push(cityPeriod);
		}
		
	}else if(period =="2") {
		//最近一个月
		//用户年龄分布
		var agePeriodList = UserDomain.queryUserAgePeriod(sqlExecute, "MONTH");
		for(var m=0; m < agePeriodList.length; m++){
			var yb_level = agePeriodList[m].yb_level;
			var count = agePeriodList[m].count;
			var sumCount = agePeriodList[m].sumCount;
//			if(yb_level =="period_0") {
//				var period_0 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
//				agePeriod["period_0"] = period_0;
//			}
			if(yb_level =="period_1") {
				var period_1 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_1"] = period_1;
			}
			if(yb_level =="period_2") {
				var period_2 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_2"] = period_2;
			}
			if(yb_level =="period_3") {
				var period_3 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_3"] = period_3;
			}
			if(yb_level =="period_4") {
				var period_4 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_4"] = period_4;
			}
			if(yb_level =="period_5") {
				var period_5 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_5"] = period_5;
			}
			if(yb_level =="period_6") {
				var period_6 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_6"] = period_6;
			}
		}
		
		//用户性别分布
		var sexPeriodList = UserDomain.queryUserSexPeriod(sqlExecute, "MONTH");
		for(var i=0; i < sexPeriodList.length; i++){
			ownerSex = sexPeriodList[i].ownerSex;
			count = sexPeriodList[i].count;
			sumCount = sexPeriodList[i].sumCount;
			if(ownerSex =="M") {
				male = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				sexPeriod["male"] = male;
			}
			if(ownerSex =="F") {
				female = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				sexPeriod["female"] = female;
			}
		}
		
		//设备分布
		var devicePeriodList = UserDomain.queryUserDevicePeriod(sqlExecute, "MONTH");
		for(var j=0; j < devicePeriodList.length; j++){
			deviceType = devicePeriodList[j].deviceType;
			count = devicePeriodList[j].count;
			sumCount = devicePeriodList[j].sumCount;
			if(deviceType =="ios") {
				ios = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				devicePeriod["ios"] = ios;
			}
			if(deviceType =="android") {
				android = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				devicePeriod["android"] = android;
			}
		}
		
		//地域分布
		var cityPeriodList = UserDomain.queryUserCityPeriod(sqlExecute, "MONTH");
		for(var k=0; k < cityPeriodList.length; k++){
			var cityPeriod = new Object();
			var cityID = cityPeriodList[k].cityID;
			var cityName = cityPeriodList[k].cityName;
			var citycount = cityPeriodList[k].count;
			var citysumCount = cityPeriodList[k].sumCount;
			var cityrate = (String)(Math.round(citycount / citysumCount * 10000) / 100.00 + "%");
			cityPeriod["cityID"] = cityID;
			cityPeriod["cityName"] = cityName;
			cityPeriod["rate"] = cityrate;
			cityList.push(cityPeriod);
		}
		
	}else if(period =="3") {
		//最近一年
		//用户年龄分布
		var agePeriodList = UserDomain.queryUserAgePeriod(sqlExecute, "YEAR");
		for(var m=0; m < agePeriodList.length; m++){
			var yb_level = agePeriodList[m].yb_level;
			var count = agePeriodList[m].count;
			var sumCount = agePeriodList[m].sumCount;
//			if(yb_level =="period_0") {
//				var period_0 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
//				agePeriod["period_0"] = period_0;
//			}
			if(yb_level =="period_1") {
				var period_1 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_1"] = period_1;
			}
			if(yb_level =="period_2") {
				var period_2 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_2"] = period_2;
			}
			if(yb_level =="period_3") {
				var period_3 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_3"] = period_3;
			}
			if(yb_level =="period_4") {
				var period_4 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_4"] = period_4;
			}
			if(yb_level =="period_5") {
				var period_5 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_5"] = period_5;
			}
			if(yb_level =="period_6") {
				var period_6 = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				agePeriod["period_6"] = period_6;
			}
		}
		
		//用户性别分布
		var sexPeriodList = UserDomain.queryUserSexPeriod(sqlExecute, "YEAR");
		for(var i=0; i < sexPeriodList.length; i++){
			ownerSex = sexPeriodList[i].ownerSex;
			count = sexPeriodList[i].count;
			sumCount = sexPeriodList[i].sumCount;
			if(ownerSex =="M") {
				male = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				sexPeriod["male"] = male;
			}
			if(ownerSex =="F") {
				female = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				sexPeriod["female"] = female;
			}
		}
		
		//设备分布
		var devicePeriodList = UserDomain.queryUserDevicePeriod(sqlExecute, "YEAR");
		for(var j=0; j < devicePeriodList.length; j++){
			deviceType = devicePeriodList[j].deviceType;
			count = devicePeriodList[j].count;
			sumCount = devicePeriodList[j].sumCount;
			if(deviceType =="ios") {
				ios = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				devicePeriod["ios"] = ios;
			}
			if(deviceType =="android") {
				android = (String)(Math.round(count / sumCount * 10000) / 100.00 + "%");
				devicePeriod["android"] = android;
			}
		}
		
		//地域分布
		var cityPeriodList = UserDomain.queryUserCityPeriod(sqlExecute, "YEAR");
		for(var k=0; k < cityPeriodList.length; k++){
			var cityPeriod = new Object();
			var cityID = cityPeriodList[k].cityID;
			var cityName = cityPeriodList[k].cityName;
			var citycount = cityPeriodList[k].count;
			var citysumCount = cityPeriodList[k].sumCount;
			var cityrate = (String)(Math.round(citycount / citysumCount * 10000) / 100.00 + "%");
			cityPeriod["cityID"] = cityID;
			cityPeriod["cityName"] = cityName;
			cityPeriod["rate"] = cityrate;
			cityList.push(cityPeriod);
		}
	}
	
	$_response_$ = {
		errorCode: 0,
		data: {
			agePeriod:agePeriod,
			sexPeriod:sexPeriod,
			devicePeriod:devicePeriod,
			cityPeriod:cityList
		}
	};
})($_request_param_$, $_request_header_$);