/**
 * 	功能：查询收支明细
 *  @author niuxiaojie
 */
(function(request, header) {
	var supplierID = request.supplierID; //供应商ID
	var cityID = request.cityID; //城市ID
	var operType = request.operType; //收支类型，（1收入  2支出）
	var subject = request.subject || "1','2','3','4','5','6','7";	//科目（1保费，2批改缴费，3批改退费，4核保失败退费，5投保失败退费，6退保，7车船税）
	var resourceType = request.resourceType;	//收支来源类型，1用户   2 险企
	var startDateStart = request.startDateStart; //起保日期开始
	var startDateEnd = request.startDateEnd;	//起保日期结束
	var goodsOrderNo = request.goodsOrderNo;	//商品订单编号
	var policyCustomerNo = request.policyCustomerNo;	//电子保单号
	logger.debug('policyCustomerNo:'+policyCustomerNo);
	var sortFieldName = request.sortFieldName || 'payDate';	//排序字段（payDate收支日期）
	var sortDir = request.sortDir || 'DESC';	//排序 （ASC升序  DESC降序）
	var pageNumber = request.pageNumber; //页码
	var pageSize = request.pageSize; //页大小
	
	
	var lo = createLogic();
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var sqlExecute = sqlAdpterHandler.getInstance(false);
	var errMsg = lo.checkParam(sortFieldName, sortDir, pageNumber, pageSize);
	if (errMsg) {
		errorResponse(-1, errMsg);
		return;
	}
	var paymentDetailCount = IncomeStatementDomain.getPaymentDetailCount(sqlExecute, supplierID, cityID, operType, subject, resourceType, startDateStart, startDateEnd, goodsOrderNo,policyCustomerNo);
	var paymentDetailList = IncomeStatementDomain.listPaymentDetail(sqlExecute, supplierID, cityID, operType, subject, resourceType, startDateStart, startDateEnd, goodsOrderNo, sortFieldName, sortDir, policyCustomerNo,pageNumber, pageSize);
	$_response_$ = {
		errorCode: 0,
		data: {
			totalCount : paymentDetailCount,
			paymentDetailList : paymentDetailList
		}
	};
})($_request_param_$, $_request_header_$);


function createLogic() {
	load("/common/_errorCode.js");
	load("/domain/DBUtils.js");
	load("/domain/IncomeStatementDomain.js");
	load("/common/_importConfig.js");
	load("/lib/authCheck.js");
	var lo = {
		//检验参数
		checkParam : function(sortFieldName, sortDir, pageNumber, pageSize){
			var errMsg;
			if(sortFieldName && ['payDate'].indexOf(sortFieldName) == -1){
				errMsg = "请求携带参数[sortFieldName]不合法";
			}else if(sortDir && ['ASC','DESC'].indexOf(sortDir) == -1){
				errMsg = "请求携带参数[sortDir]不合法";
			}else if(!pageNumber || !pageSize || typeof pageNumber != 'number' || typeof pageSize != 'number'){
				errMsg = "请求携带参数[pageNumber]或[pageSize]不合法";
			}
			return errMsg;
		}
	};
	return lo;
}