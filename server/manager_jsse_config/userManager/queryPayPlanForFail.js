/**
 * 
 * 功能： 坏账还款计划分析
 * 
 * @author chenjun
 * 
 * @param {goodsID , cityID , payDateStart ,payDateEnd}
 * 
 */

load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/HirePurchaseAgreementDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	//请求参数校验
	if(!this._verifyRequestParam(param)){
		return;
	}
	
	//坏账还款计划 状态
	var failStatus=[];
		failStatus.push("3"); //第二次还款失败
		failStatus.push("4"); //终止还款
	
	var queryObj = {
			  goodsID : param.goodsID   //商品ID
			, cityID : param.cityID     //城市ID
			, payDateStart : param.payDateStart //还款日期开始
			, payDateEnd :  param.payDateEnd    //还款日期结束
			, failStatus : failStatus 
		}
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var payPlanForFailArray = HirePurchaseAgreementDomain.queryPayPlanForFail(sqlAdapter, queryObj);
		
		var payPlanForFailList = new Array();
		if(payPlanForFailArray.length > 0 ){
			for(var i = 0 ; i < payPlanForFailArray.length ; i++){
				payPlanForFailList.push(
					{
						currentTime : payPlanForFailArray[i].currentTime ,
						billNumber : payPlanForFailArray[i].billNumber ,
						advancedAmount : payPlanForFailArray[i].advancedAmount ,
						payfee : payPlanForFailArray[i].payfee ,
						surplusPayfee : payPlanForFailArray[i].surplusPayfee
					}
				);
			}
		}
		
		$_response_$={
			errorCode:0 ,
			data: payPlanForFailList
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
	
	/*if(!param.payDateStart){
		errorMsg.push('body中payDateStart为空');
	}
	
	if(!param.payDateEnd){
		errorMsg.push('body中payDateEnd为空');
	}*/
	
	if(errorMsg.length>0){
		errorResponse(-1,{},errorMsg.join(';').toString());
		return false;
	}else{
		return true;
	}
}
