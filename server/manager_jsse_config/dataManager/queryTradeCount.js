/**
 * @author yanglin
 * @description 查询交易次数统计
 * 
 */
(function(request,header){
	//获取基本参数
	var supplierID=request.supplierID; //供应商ID
	var cityID=request.cityID;    //城市ID
	var goodsID=request.goodsID;  //商品ID
	var period=request.period||"0";//时间区间  0昨天1一周2一月3一年
	var lo = createLogic();
	//登录校验
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	var sqlExecute=sqlAdpterHandler.getInstance(false);
	try {
		var result=lo.getResult(sqlExecute,supplierID,cityID,goodsID,period);
		logger.debug("===very out result==="+JSON.stringify(result))
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
	load('/common/common.js');
	load('/lib/authCheck.js');
	load('/domain/DBUtils.js');
	load('/domain/CountOrderAddDomain.js');
	load('/dataManager/StaticsUtil.js');
	var lo={
		getResult:function(sqlExecute,supplierID,cityID,goodsID,period){
			var result=CountOrderAddDomain.queryOrderDataByPeriod(sqlExecute, supplierID, cityID, goodsID, period);
			result=StaticsUtil.getStandardData(result, period);
			return result;
		}
	};
	return lo;
}
