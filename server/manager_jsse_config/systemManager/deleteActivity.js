/**
 * 	功能：删除活动
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/GoodsDomain.js");
load("/domain/ActivityDomain.js");
load("/domain/RecommendDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//活动ID
	var activityID = param.activityID;
	
	try {
		if(!activityID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter=sqlAdpterHandler.getInstance(true);
		
		var recommendType = "2";//活动
		//校验该活动是否在推荐区海报中有关联
		var reCount = RecommendDomain.checkRecommendExits(sqlAdapter,recommendType,activityID);
		if(reCount > 0) {
			logger.error("该活动已经关联了推荐区海报，不允许删除");
			errorResponse(7018);
			return;
		}
		//删除活动基本信息
		ActivityDomain.delActivity(sqlAdapter,activityID);
		
		var imageList = ActivityDomain.getResourceOfActivity(sqlAdapter,activityID);
		var activityImagesRelID;
		var imgsID;
		for(var i=0; i < imageList.length;i++) {
			activityImagesRelID = imageList[i].activityImagesRelID;	//活动图片ID
			imgsID = imageList[i].imgsID;		//资源ID
			
			//删除资源图片
			GoodsDomain.delResource(sqlAdapter,imgsID);
			
			//删除活动资源关系
			ActivityDomain.delRelOfActivityResource(sqlAdapter,activityImagesRelID);
		}
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("删除活动失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
