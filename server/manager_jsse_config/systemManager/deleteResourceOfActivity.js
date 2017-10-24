/**
 * 	功能：删除活动图片
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/GoodsDomain.js");
load("/domain/ActivityDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//活动ID
	var activityID	= param.activityID;
	//活动图片ID
	var activityImagesRelID = param.activityImagesRelID;	

	
	try {
		if(!activityID || !activityImagesRelID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		//删除资源图片
		var sqlAdapter=sqlAdpterHandler.getInstance(true);
		var imagesID = ActivityDomain.getRelOfActivityResource(sqlAdapter,activityImagesRelID);
		GoodsDomain.delResource(sqlAdapter,imagesID);
		
		//删除活动资源关系
		ActivityDomain.delRelOfActivityResource(sqlAdapter,activityImagesRelID);
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("删除活动图片失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
