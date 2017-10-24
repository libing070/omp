/**
 * 功能：商品交易按月统计
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
	
	var queryObj = {
		goodsID : param.goodsID ,
		cityID : param.cityID 
	}
	
	var sumAmount = "0" ; //交易总额
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var amountListArray = CountTurnoverAddDomain.queryGoodsByMonth(sqlAdapter, queryObj);
		
		var amountList = new Array();
		if(amountListArray.length > 0){
			for(var i = 0 ; i < amountListArray.length; i++){
				amountList.push(
					{
						businessMonth : amountListArray[i].businessMonth ,
						amount : amountListArray[i].amount
					}
				);
			}
		}
		
		var sumAmount = CountTurnoverAddDomain.queryCountGoodsByMonth(sqlAdapter, queryObj)[0].sumAmount;
		
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

