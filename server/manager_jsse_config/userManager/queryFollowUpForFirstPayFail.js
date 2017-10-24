/**
 * 	功能：查询还款电话跟进列表
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/HirePurchaseAgreementDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var hirePurchaseAgreementID = request.hirePurchaseAgreementID; //还款计划ID
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if (!hirePurchaseAgreementID) {
		errorResponse(-1);
		return;
	}

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//查询还款电话跟进列表
	var followUpRecordList = HirePurchaseAgreementDomain.listFollowUpRecord(sqlExecute, hirePurchaseAgreementID);

	$_response_$ = {
		errorCode: 0,
		data: followUpRecordList
	};
})($_request_param_$, $_request_header_$);