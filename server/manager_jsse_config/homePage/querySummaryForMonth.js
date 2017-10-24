/**
 * 	首页功能：查询最近一个月注册用户数趋势
 *  
 *  @author chenjun
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/CountTurnoverAddDomain.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//城市ID
	var cityID = param.cityID;
	
	var yesterdayNewAmount = 0 ;	//昨日新增交易额
	var monthNewAmount = 0;	//最近一个月新增交易额
	var totalAmount = 0 ; //当前总计
	//前一天
	var yesterday = (java.text.SimpleDateFormat("yyyy-MM-dd")).format(new Date(new Date()-24*60*60*1000));
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var amountListArray = CountTurnoverAddDomain.queryTurnoverListByCityID(sqlAdapter, cityID );
		
		logger.debug("querySummaryMonth.js userListArray \n" + JSON.stringify(amountListArray));
		var amountList = new Array();
		if(amountListArray.length > 0){
			for(var i = 0 ; i < amountListArray.length; i++){
				if(yesterday == amountListArray[i].countDate){
					yesterdayNewAmount = amountListArray[i].count ;
				}
				monthNewAmount += Number(amountListArray[i].count);
				amountList.push(
					{
						dayTime : amountListArray[i].countDate ,
						amount : amountListArray[i].count
					}
				);
			}
		}
		
		var totalAmount = CountTurnoverAddDomain.queryCountTurnoverByCityID(sqlAdapter, cityID )[0].totalAmount;
		$_response_$={
			errorCode:0 ,
			data: {
				totalAmount : totalAmount,
				monthNewAmount : monthNewAmount,
				yesterdayNewAmount :yesterdayNewAmount,
				amountList : amountList
			}
		};
	} catch (e) {
		logger.error(e.toString());
	    errorResponse(9999);
	}
})($_request_param_$, $_request_header_$);