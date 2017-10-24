/**
 * 	功能： 供应商交易按日统计
 *  
 *  @author chenjun
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/CountTurnoverAddDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if(!this._verifyRequestParam(param)){
		return ;
	}
	
	var sumAmount = "0" ; //交易总额
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var amountListArray = CountTurnoverAddDomain.queryTurnoverListByDay(sqlAdapter, {supplierID:param.supplierID,businessStartDate:param.businessStartDate,businessEndDate:param.businessEndDate});
		
		logger.debug("tradeStatisticsForSupplierDay.js amountListArray \n" + JSON.stringify(amountListArray));
		
		var amountList = new Array();
		if(amountListArray.length > 0){
			yesterdayNewOrder = amountListArray[0].count ;
			for(var i = 0 ; i < amountListArray.length; i++){
				amountList.push(
					{
						supplierID : amountListArray[i].supplierID ,
						supplierName : (!amountListArray[i].supplierName)? " " : amountListArray[i].supplierName ,
						amount : amountListArray[i].amount
					}
				);
			}
		}
		
		var sumAmount = CountTurnoverAddDomain.queryCountTurnoverByDay(sqlAdapter, {supplierID:param.supplierID,businessStartDate:param.businessStartDate,businessEndDate:param.businessEndDate})[0].sumAmount;
		logger.debug("tradeStatisticsForSupplierDay.js sumAmount \n" + JSON.stringify(sumAmount));
		
		$_response_$={
			errorCode:0 ,
			data: {
				sumAmount : sumAmount ,
				amountList :　amountList
			}
		};
	} catch (e) {
		logger.error(e.toString());
	    errorResponse(9999);
	}
})($_request_param_$, $_request_header_$);



/**
 * 描述：请求参数校验
 * 
 * @param param
 * @returns {Boolean}
 */
function _verifyRequestParam(param) {
	
	var errorMsg=[];
	
	/*if(!param.supplierID){
		errorMsg.push('body中supplierID为空');
	}*/
	
	if(!param.businessStartDate){
		errorMsg.push('body中businessStartDate为空');
	}

	if(!param.businessEndDate){
		errorMsg.push('body中businessEndDate为空');
	}
	
	if(errorMsg.length>0){
		errorResponse(-1,{},errorMsg.join(';').toString());
		return false;
	}else{
		return true;
	}
}