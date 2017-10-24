/**
 * @author nongjinmei
 * @description 供应商用户量对比查询
 * 
 */
load('/common/_errorCode.js');
load('/lib/authCheck.js');
load('/domain/DBUtils.js');
load('/dataManager/StaticsUtil.js');
load('/domain/UserDomain.js');
load('/domain/CountUserAddDomain.js');
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
		//累计用户数量
		var sumUserNum = UserDomain.queryUserSumCountByPeriod(sqlExecute, period);
		//供应商用户量比对
		var userList = CountUserAddDomain.queryRegistUserForSupplier(sqlExecute, period);
		
		$_response_$={
			errorCode:0 ,
			data: {
				sumUserNum : sumUserNum,
				userList : userList
			}
		};
		
	} catch (e) {
		logger.error(e);
		$_response_$={
				errorCode:-100,
				errMsg:e
		};
	}
	
})($_request_param_$,$_request_header_$);

