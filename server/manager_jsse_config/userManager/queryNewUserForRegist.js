/**
 * 
 * 功能： 新增用户趋势统计
 * 
 * @author chenjun
 * 
 * @param {statisticsType , supplierID , registDate}
 * 
 */
load("/common/cusTools.js");
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/CountUserAddDomain.js");
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

	var queryObj = {
			  statisticsType : param.statisticsType   //1-按日统计  2-按月统计
			, supplierID : param.supplierID
			, registDate : param.registDate
		}
	
	//新增用户数(时间段)
	var newUserNumber = 0 ;
	//累计用户数(全量)
	var allUserNumber = 0 ; 
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		
		var userListArray = new Array();
		if(param.statisticsType == '1'){
			userListArray = CountUserAddDomain.queryCountUserByDay(sqlAdapter, queryObj);
		}else if(param.statisticsType == '2'){
			userListArray = CountUserAddDomain.queryCountUserByMonth(sqlAdapter, queryObj);
		}
		
		var userList = new Array();
		var supplierList = new Array();
		//数值倒序
		supplierList.reverse();
		if(userListArray.length > 0){
			/*for(var i = 0 ; i < userListArray.length; i++){
				newUserNumber += parseInt(userListArray[i].userNum) ;
				userList.push(
					{
						supplierID : userListArray[i].supplierID ,
						supplierName : (!userListArray[i].supplierName)? " " : userListArray[i].supplierName ,
						registDate : userListArray[i].countDate ,
						userNum : userListArray[i].userNum
					}
				);
			}*/
			for(var i = 0 ; i < userListArray.length; i++){
				supplierList.push(userListArray[i].supplierID);
				if(!queryObj.supplierID){	//查询全部供应商
					if(userListArray[i].supplierID == "all"){
						newUserNumber += parseInt(userListArray[i].userNum) ;
					}
				}else{
					newUserNumber += parseInt(userListArray[i].userNum);					
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
				for(var j = 0 ; j < userListArray.length; j++){
					if(userListArray[j].supplierID == supplierID){
						supplierName = (!userListArray[j].supplierName)? " " : userListArray[j].supplierName ;
						days.push({
							registDate : userListArray[j].countDate,
							userNum : userListArray[j].userNum
						});
					}
				}
				userList.push({
					supplierID : supplierID ,
					supplierName : supplierName ,
					days : days 
				});
			}
			
		}
		
		var allUserNumber = CountUserAddDomain.queryCountUser(sqlAdapter, queryObj)[0].allUserNumber;
		
		$_response_$={
			errorCode:0 ,
			data: {
				allUserNumber : allUserNumber ,
				newUserNumber :　newUserNumber ,
				userList : userList
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
	
	if(!param.statisticsType){
		errorMsg.push('body中statisticsType为空');
	}else{
		if(param.statisticsType == '1'){
			if(!param.registDate){
				errorMsg.push('body中registDate为空');
			}
		}
	}
	
	if(errorMsg.length>0){
		errorResponse(-1,{},errorMsg.join(';').toString());
		return false;
	}else{
		return true;
	}
}
