/**
 * 	功能：发布推荐区海报
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/GoodsDomain.js");
load("/domain/RecommendDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//推荐区海报列表
	var posterList = param.posterList;
	
	try {
		if(!posterList) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var resObj;
		var recommendID;
		var resourceIDOld;
		var httpUrl;
		var groupName;
		var remoteFileName;
		var maxWidth;	
		var maxHeight;
		var maxSize;
		var recommendObj;
		var recommendationStatus="1"; //发布状态，（1，发布，2未发布）
		for(var i=0; i<posterList.length;i++) {
			recommendID = posterList[i].recommendID
			groupName = posterList[i].groupName
			remoteFileName = posterList[i].remoteFileName
			httpUrl = "/" + groupName + "/" + remoteFileName;
			maxWidth = posterList[i].maxWidth;
			maxHeight = posterList[i].maxHeight;
			maxSize = posterList[i].maxSize;
			
			if(groupName) {
					//新增资源图片
					resObj = {
						httpUrl:httpUrl,
						groupName:groupName,
						remoteFileName:remoteFileName,
						maxWidth:maxWidth,
						maxHeight:maxHeight,
						maxSize:maxSize
					};
					
					var resourceID = GoodsDomain.addResource(sqlAdapter,resObj);
					
					resourceIDOld = RecommendDomain.queryImageOfRecommend(sqlAdapter,recommendID);
					
					recommendObj = {
						recommendID:recommendID,
						resourceID:resourceID,
						recommendationStatus:recommendationStatus
					};
					//更新推荐区的海报信息
					RecommendDomain.publishPosterOfRecommend(sqlAdapter,recommendObj);
					//删除旧的图片资源ID
					GoodsDomain.delResource(sqlAdapter,resourceIDOld);
			}
			
		}
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
		};
	} catch (e) {
		logger.error("发布推荐区海报图片失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
