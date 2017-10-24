/**
 * 	功能：回显活动图片
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
	//活动ID
	var activityID	= param.activityID;
	
	try {
		if(!activityID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var imageList = ActivityDomain.getResourceOfActivity(sqlAdapter,activityID);
		
		$_response_$={
			errorCode:0,
			data:imageList
		
		};
	} catch (e) {
		logger.error("回显活动图片失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
