/**
 * 	首页功能：查询最近一个月注册用户数趋势
 *  
 * @author chenjun
 * @param cityID
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/CountUserAddDomain.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var queryObj = {
		cityID:param.cityID
	}
	//昨日新增注册用户数
	var yesterdayNewUser = 0 ;	//昨日新增注册用户数
	var monthNewUser = 0 ;	//最近一个月新增注册用户数
	var totalUser = 0 ; //目前总计
	
	//前一天
	var yesterday = (java.text.SimpleDateFormat("yyyy-MM-dd")).format(new Date(new Date()-24*60*60*1000));
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var userListArray = CountUserAddDomain.queryCountUserAddListByCityID(sqlAdapter, queryObj);
		
		var userList = new Array();
		if(userListArray.length > 0){
			for(var i = 0 ; i < userListArray.length; i++){
				if(yesterday == userListArray[i].createTime){
					yesterdayNewUser = userListArray[i].count ;
				}
				monthNewUser += Number(userListArray[i].count);
				userList.push(
					{
						countDate : userListArray[i].createTime ,
						userNum : userListArray[i].count
					}
				);
			}
		}
		
		var totalUser = CountUserAddDomain.queryCountUserAddSumByCityID(sqlAdapter, queryObj)[0].totalUser;
		
		$_response_$={
			errorCode:0 ,
			data: {
				totalUser : totalUser ,
				monthNewUser : String(monthNewUser),
				yesterdayNewUser :　yesterdayNewUser ,
				userList:userList
			}
		};
	} catch (e) {
		logger.error(e.toString());
	    errorResponse(9999);
	}
})($_request_param_$, $_request_header_$);