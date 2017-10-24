/**
 * 	功能：保存电话跟进记录
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/HirePurchaseAgreementDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var hirePurchaseAgreementID = request.hirePurchaseAgreementID; //还款计划ID
	var content = request.content; //跟进内容
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if (!hirePurchaseAgreementID || !content) {
		errorResponse(-1);
		return;
	}

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//保存电话跟进记录
	var followUpRecordID = HirePurchaseAgreementDomain.addFollowUpRecord(sqlExecute, hirePurchaseAgreementID, content);

	$_response_$ = {
		errorCode: 0,
		data: {
			followUpID: followUpRecordID
		}
	};
})($_request_param_$, $_request_header_$);