/**
 * 	功能：查询活动名称
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/ActivityDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	var activityID = param.activityID;
	
	try {
		if(!activityID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var activityName = ActivityDomain.queryActivityName(sqlAdapter,activityID);
		//获取活动图片
		var imageFlag;
		var imageList = ActivityDomain.getResourceOfActivity(sqlAdapter,activityID);
		if(imageList.length > 0) {
			imageFlag = "Y";
		}else {
			imageFlag = "N";
		}
		$_response_$={
			errorCode:0,
			data:{
				activityName:activityName,
				imageFlag:imageFlag
			}
		};
	} catch (e) {
		logger.error("获取活动名称失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
