/**
 * 	功能：订单交易按日统计
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
			,   monthDate: param.monthDate 
			,   type : "1"  //1-按日  2-按月
		} ;
	
	var sumAmount = 0;
	var monthOrderNumber = 0;
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var orderListArray = CountOrderAddDomain.queryOrderAddByDay(sqlAdapter, queryObj);
		
		var orderList = new Array();
		var supplierList = new Array();
		if(orderListArray.length > 0){
			/*for(var i = 0 ; i < orderListArray.length; i++){
				monthOrderNumber += parseInt(orderListArray[i].count) ;
				orderList.push(
					{
						supplierID : orderListArray[i].supplierID ,
						businessDate : orderListArray[i].countDate ,
						orderNumber : orderListArray[i].count ,
						supplierName : (!orderListArray[i].supplierName)? " " : orderListArray[i].supplierName ,
					}
				);
			}*/
			for(var i = 0 ; i < orderListArray.length; i++){
				supplierList.push(orderListArray[i].supplierID);
				if(orderListArray[i].supplierID == "all"){
					monthOrderNumber += parseInt(orderListArray[i].count) ;
				}
			}
			//去重
			supplierList = TOOLS.unique(supplierList);
			//数值倒序
			supplierList.reverse();
			for(var i = 0 ; i < supplierList.length; i++){
				var supplierID = supplierList[i] ;
				var supplierName = "" ;
				var days = new Array();
				for(var j = 0 ; j < orderListArray.length; j++){
					if(orderListArray[j].supplierID == supplierID){
						supplierName = (!orderListArray[j].supplierName)? " " : orderListArray[j].supplierName ;
						days.push({
							businessDate : orderListArray[j].countDate,
							orderNumber : orderListArray[j].count
						});
					}
				}
				orderList.push({
					supplierID : supplierID ,
					supplierName : supplierName ,
					days : days
				});
			}
			
		}
		var sumAmount = CountOrderAddDomain.queryCountOrderATurnover(sqlAdapter, queryObj)[0].sumAmount;
		
		$_response_$={
			errorCode:0 ,
			data: {
				sumAmount : sumAmount ,
				monthOrderNumber :　monthOrderNumber ,
				orderList:orderList
			}
		};
	} catch (e) {
		logger.error(e.toString());
	    errorResponse(9999);
	}
})($_request_param_$, $_request_header_$);