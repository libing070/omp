/**
 * 	功能：新增活动
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
	//活动名称
	var activityName  = param.activityName ;
	var status = "N";

	try {
		if(!activityName) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var activityObj = {
			activityName:activityName,
			status:status
		};
		var activityID;
		var nameCount = ActivityDomain.checkActivityName(sqlAdapter,activityID,activityName);
		if(nameCount >0) {
			logger.error("活动名称重复");
			errorResponse(7015);
			return;
		}
		var activityID = ActivityDomain.insertActivity(sqlAdapter,activityObj);
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0,
			data:{
				activityID:activityID
			}
		};
	} catch (e) {
		logger.error("新增活动失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
