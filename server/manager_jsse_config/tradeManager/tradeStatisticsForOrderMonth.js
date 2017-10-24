/**
 * 	功能：订单交易  按月统计
 *  
 *  @author chenjun
 */
load("/common/cusTools.js");
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/CountOrderAddDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var queryObj = {
				goodsID:param.goodsID
			,	supplierID:param.supplierID
			,	cityID:param.cityID
			,   type : "2"  //1-按日  2-按月
		} ;
	
	var sumAmount = 0;
	var sumOrderNumber = 0 ;
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var orderListArray = CountOrderAddDomain.queryOrderAddByMonth(sqlAdapter, queryObj);
		
		var orderList = new Array();
		var supplierList = new Array();
		if(orderListArray.length > 0){
			/*for(var i = 0 ; i < orderListArray.length; i++){
				orderList.push(
					{
						supplierID : orderListArray[i].supplierID ,
						supplierName : (!orderListArray[i].supplierName)? " " : orderListArray[i].supplierName ,
						businessDate : orderListArray[i].countDate ,
						orderNumber : orderListArray[i].sumAmount
					}
				);
			}*/
			
			for(var i = 0 ; i < orderListArray.length; i++){
				supplierList.push(orderListArray[i].supplierID);
				if(orderListArray[i].supplierID == "all"){
					sumOrderNumber += ( new Number(orderListArray[i].sumAmount) ) ;
				}
			}
			logger.info("-------------------- sumOrderNumber : " + sumOrderNumber)
			//去重
			supplierList = TOOLS.unique(supplierList);
			//数值倒序
			supplierList.reverse();
			for(var i = 0 ; i < supplierList.length; i++){
				var supplierID = supplierList[i] ;
				var supplierName = "" ;
				var months = new Array();
				for(var j = 0 ; j < orderListArray.length; j++){
					if(orderListArray[j].supplierID == supplierID){
						supplierName = (!orderListArray[j].supplierName)? " " : orderListArray[j].supplierName ;
						months.push({
							businessDate : orderListArray[j].countDate,
							orderNumber : orderListArray[j].sumAmount
						});
					}
				}
				orderList.push({
					supplierID : supplierID ,
					supplierName : supplierName ,
					months : months
				});
			}
		}
		
		var sumAmount = CountOrderAddDomain.queryCountOrderATurnover(sqlAdapter, queryObj)[0].sumAmount;
		
		$_response_$={
			errorCode:0 ,
			data: {
				sumAmount : sumAmount ,
				sumOrderNumber :　JSON.stringify(sumOrderNumber) ,
				orderList:orderList
			}
		};
	} catch (e) {
		logger.error(e.toString());
	    errorResponse(9999);
	}
})($_request_param_$, $_request_header_$);