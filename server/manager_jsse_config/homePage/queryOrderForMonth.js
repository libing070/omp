/**
 * 	首页功能：查询最近一个月订单数趋势
 *  
 *  @author chenjun
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/CountOrderAddDomain.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//城市ID
	var cityID = param.cityID;
	
	var yesterdayNewOrder = 0 ;	//昨日新增订单数
	var monthNewOrder = 0;	//最近一个月新增订单数
	var totalOrder = 0 ; //当前总计订单数
	
	//前一天
	var yesterday = (java.text.SimpleDateFormat("yyyy-MM-dd")).format(new Date(new Date()-24*60*60*1000));
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var orderListArray = CountOrderAddDomain.queryOrderAddListByCityID(sqlAdapter, cityID);
		
		logger.debug("queryOrderForMonth.js orderListArray \n" + JSON.stringify(orderListArray));
		var orderList = new Array();
		if(orderListArray.length > 0){
			for(var i = 0 ; i < orderListArray.length; i++){
				if(yesterday == orderListArray[i].countDate){
					yesterdayNewOrder = orderListArray[i].count ;
				}
				monthNewOrder += Number(orderListArray[i].count);
				orderList.push(
					{
						countDate : orderListArray[i].countDate ,
						userNum : orderListArray[i].count
					}
				);
			}
		}
		
		var totalOrder = CountOrderAddDomain.queryCountOrderAddByCityID(sqlAdapter, cityID )[0].totalOrder;
		logger.debug("queryOrderForMonth.js totalOrder \n" + JSON.stringify(totalOrder));
		$_response_$={
			errorCode:0 ,
			data: {
				totalOrder : totalOrder ,
				monthNewOrder : monthNewOrder,
				yesterdayNewOrder :　yesterdayNewOrder,
				orderList:orderList
			}
		};
	} catch (e) {
		logger.error(e.toString());
	    errorResponse(9999);
	}
})($_request_param_$, $_request_header_$);