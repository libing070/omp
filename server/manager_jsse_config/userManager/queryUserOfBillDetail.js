/**
 * 	功能：查询用户账单(分期付款计划)还款记录
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/UserRepaymentRecordDomain.js");
load("/domain/HirePurchaseAgreementDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var hirePurchaseAgreementID = request.hirePurchaseAgreementID; //分期付款计划ID
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if (!hirePurchaseAgreementID) {
		errorResponse(-1);
		return;
	}

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//分期付款计划基本信息
	var hirePurchaseAgreement = HirePurchaseAgreementDomain.findHirePurchaseAgreementByID(sqlExecute, hirePurchaseAgreementID);
	//用户账单(分期付款计划)还款记录
	var repaymentRecordList = UserRepaymentRecordDomain.findRepaymentRecordByID(sqlExecute, hirePurchaseAgreementID);
	for (var i = 0; i < repaymentRecordList.length; i++) {
		var repaymentRecord = repaymentRecordList[i];
		repaymentRecord.firstPayResult = repaymentRecord.status == '1' ? '成功' : '失败';
		repaymentRecord.lastPayResult = repaymentRecord.status == '4' ? '成功' : repaymentRecord.status == '3' ? '失败' : '';
	}
	hirePurchaseAgreement.billDetailList = repaymentRecordList;

	$_response_$ = {
		errorCode: 0,
		data: hirePurchaseAgreement
	};
})($_request_param_$, $_request_header_$);