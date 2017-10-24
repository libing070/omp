/**
 * @author yanglin
 * @description 查询用户交易数和用户转换率的统计
 * 
 */
(function(request,header){
	//获取基本参数
	var period=request.period||"0";//时间区间  0昨天1一周2一月3一年
	var lo = createLogic();
	//登录校验
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	var sqlExecute=sqlAdpterHandler.getInstance(false);
	try {
		var result=lo.getResult(sqlExecute,period);
		$_response_$={
				errorCode:0,
				amountList:result
		};
		
	} catch (e) {
		logger.error(e);
		$_response_$={
				errorCode:-100,
				errMsg:e
		};
	}
	
})($_request_param_$,$_request_header_$);
function createLogic () {
	load('/common/_errorCode.js');
	load('/lib/authCheck.js');
	load('/domain/DBUtils.js');
	load('/domain/CountUserOrderAddDomain.js');
	load('/domain/UserDomain.js');
	load('/dataManager/StaticsUtil.js');
	var lo={
		getResult:function(sqlExecute,period){
			//交易数
			var jys=CountUserOrderAddDomain.queryUserOrderByPeriod(sqlExecute, period);
			logger.debug("=====jys before==="+JSON.stringify(jys));
			jys=StaticsUtil.getStandardData(jys, period);
			logger.debug("=====jys after==="+JSON.stringify(jys));
			//用户注册数
			var userCount=UserDomain.queryUserCountByPeriod(sqlExecute, period);
			logger.debug("=====userCount before==="+JSON.stringify(userCount));
			userCount=StaticsUtil.getStandardData(userCount, period);
			logger.debug("=====userCount after==="+JSON.stringify(userCount));
			//求其和
			if(jys.length>0){
				var s=parseInt(jys[0].count);
				for(var i=1;i<jys.length;i++){
					s=parseInt(jys[i].count)+s;
					jys[i].count=(String)(s);
				}
			}
			if(userCount.length>0){
				var s=parseInt(userCount[0].count);
				for(var i=1;i<userCount.length;i++){
					s=parseInt(userCount[i].count)+s;
					userCount[i].count=(String)(s);
				}
			}
			logger.debug("=====userCount sum==="+JSON.stringify(userCount));
			logger.debug("=====jys sum==="+JSON.stringify(jys));
			//合并
			for(var i=0;i<jys.length;i++){
				var t=jys[i];
				if(userCount[i].count==0){
					t.rate="0";
				}else{
					t.rate=(String)(t.count/userCount[i].count);
				}
			}
			return jys;
		}
	};
	return lo;
}
