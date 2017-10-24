/**
 * 
 * 功能： 供应商用户量比对
 * 
 * @author chenjun
 * 
 * @param { startTime , endTime}
 * 
 */
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
			  startTime : param.startTime 
			, endTime : param.endTime
		}
	
	//累计用户数
	var sumUserNum = 0 ; 
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		
		var userListArray = CountUserAddDomain.queryCountUserContrast(sqlAdapter, queryObj);

		var userList = new Array();
		if(userListArray.length > 0){
			for(var i = 0 ; i < userListArray.length; i++){
				
				sumUserNum += parseInt(userListArray[i].userNum) ;
				
				userList.push(
					{
						supplierName : (!userListArray[i].supplierName)? " " : userListArray[i].supplierName ,
						userNum : userListArray[i].userNum
					}
				);
			}
		}
		
		$_response_$={
			errorCode:0 ,
			data: {
				sumUserNum : sumUserNum ,
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
	
	if(!param.startTime){
		errorMsg.push('body中startTime为空');
	}
	if(!param.endTime){
		errorMsg.push('body中endTime为空');
	}
	
	if(errorMsg.length>0){
		errorResponse(-1,{},errorMsg.join(';').toString());
		return false;
	}else{
		return true;
	}
}
