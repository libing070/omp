/**
 * 	功能：查询最终未还款用户
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/HirePurchaseAgreementDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var lastPayDate = request.lastPayDate; //最终扣款日期
	var carOwner = request.carOwner; //车主
	var phoneNO = request.phoneNO; //电话号码
	var licenseNO = request.licenseNO; //车牌号
	var sortFieldName = request.sortFieldName || 'lastPayDate'; //排序字段（lastPayDate最终扣款日期）
	var sortDir = request.sortDir || 'DESC'; //排序 （ASC升序  DESC降序）
	var pageNumber = request.pageNumber; //页码
	var pageSize = request.pageSize; //页大小
	var status = '3'; //	2 第一次还款失败	3 第二次还款失败

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//查询最终未还款用户总数
	var lastPayFailCount = HirePurchaseAgreementDomain.getPayFailCount(sqlExecute, '', lastPayDate, carOwner, phoneNO, licenseNO, status);
	//查询最终未还款用户列表
	var lastPayFailList = HirePurchaseAgreementDomain.listPayFail(sqlExecute, '', lastPayDate, carOwner, phoneNO, licenseNO, status, sortFieldName, sortDir, pageNumber, pageSize);

	$_response_$ = {
		errorCode: 0,
		data: {
			totalCount: lastPayFailCount,
			lastPayFailList: lastPayFailList
		}
	};
})($_request_param_$, $_request_header_$);