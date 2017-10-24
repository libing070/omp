/**
 * 	功能： 供应商交易按月统计
 *  
 *  @author chenjun
 */
load("/common/cusTools.js");
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
	
	var sumAmount = "0" ; //交易总额
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var amountListArray = CountTurnoverAddDomain.queryTurnoverListByMonth(sqlAdapter, {supplierID:param.supplierID});
		
		logger.debug("tradeStatisticsForSupplierMonth.js amountListArray \n" + JSON.stringify(amountListArray));
		
		var amountList = new Array();
		var supplierList = new Array();
		var allSupplierList = new Array();
		if(amountListArray.length > 0){
			/*
			for(var i = 0 ; i < amountListArray.length; i++){
				amountList.push(
					{
						supplierID : amountListArray[i].supplierID ,
						supplierName : amountListArray[i].supplierName ,
						businessMonth : amountListArray[i].businessMonth,
						amount : amountListArray[i].amount
					}
				);
			}
			*/
			
			for(var i = 0 ; i < amountListArray.length; i++){
				supplierList.push(amountListArray[i].supplierID);
			}
			//去重
			supplierList = TOOLS.unique(supplierList);
			//数值倒序
			supplierList.reverse();
			for(var i = 0 ; i < supplierList.length; i++){
				var supplierID = supplierList[i] ;
				var supplierName = "" ;
				var months = new Array();
				for(var j = 0 ; j < amountListArray.length; j++){
					if(amountListArray[j].supplierID == supplierID){
						supplierName = (!amountListArray[j].supplierName)? " " : amountListArray[j].supplierName ;
						months.push({
							businessMonth : amountListArray[j].businessMonth,
							amount : amountListArray[j].amount
						});
					}
				}
				amountList.push({
					supplierID : supplierID ,
					supplierName : supplierName ,
					months : months 
				});
			}
			
		}
		
		var sumAmount = CountTurnoverAddDomain.queryCountTurnoverByMonth(sqlAdapter, {supplierID:param.supplierID})[0].sumAmount;
		logger.debug("tradeStatisticsForSupplierMonth.js sumAmount \n" + JSON.stringify(sumAmount));
		
		$_response_$ = {
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

