/**
 * 	功能：查询推荐区海报列表
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/GoodsDomain.js");
load("/domain/ActivityDomain.js");
load("/domain/SystemDomain.js");
load("/domain/RecommendDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var recommendList = RecommendDomain.queryRecommendList(sqlAdapter);
		var recommendListNew = new Array();
		var recommendObj;
		var recommendID;
		var recommendName;
		var resourcesID;
		var resourcesUrl;
		var groupName;
		var remoteFileName;
		var maxWidth;	
		var maxHeight;
		var maxSize;
		var recommendType;
		var recommendTypeName;
		var valueID;
		var priority;
		var valueName;
		var goodsStatus = "2";//商品状态为：上架
		
		
		for(var i=0; i < recommendList.length;i++) {
			recommendID = recommendList[i].recommendID;
			recommendName = recommendList[i].recommendName;
			resourcesID = recommendList[i].resourcesID;
			resourcesUrl = recommendList[i].resourcesUrl;
			groupName = recommendList[i].groupName;
			remoteFileName = recommendList[i].remoteFileName;
			maxWidth  = recommendList[i].maxWidth;	
			maxHeight = recommendList[i].maxHeight;
			maxSize  = recommendList[i].maxSize;
			recommendType = recommendList[i].recommendType;
			valueID = recommendList[i].valueID;
			priority = recommendList[i].priority;
			
			if(recommendType == "2") {//活动
				//查询活动名称
				valueName = ActivityDomain.getActivityName(sqlAdapter,valueID);
			}else if(recommendType == "1") {//商品
				//查询商品名称
				valueName = GoodsDomain.getGoodsName(sqlAdapter,valueID,goodsStatus);
			}
			//查询推荐类型名称
			var codeType = "publishType";
			var recommendTypeName = SystemDomain.queryBaseCodeName(sqlAdapter,codeType,recommendType);
			
			recommendObj = {
				recommendID:recommendID,
				recommendName:recommendName,
				resourcesID:resourcesID,
				resourcesUrl:resourcesUrl,
				groupName:groupName,
				remoteFileName:remoteFileName,
				maxWidth:maxWidth,
				maxHeight:maxHeight,
				maxSize:maxSize,
				recommendType:recommendType,
				recommendTypeName:recommendTypeName,
				valueID:valueID,
				valueName:valueName,
				priority:priority
			};
			
			recommendListNew.push(recommendObj);
			
		}
		
		$_response_$={
			errorCode:0,
			data:recommendListNew
		};
	} catch (e) {
		logger.error("获取推荐区海报列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
