/**
 * 	功能：查询服务费结算
 *  @author niuxiaojie
 */
(function(request, header) {
	var supplierID = request.supplierID; //供应商ID
	var cityID = request.cityID; //城市ID
	var operType = request.operType; //收支类型，（1收入  2支出）
	var subject = request.subject || "1','2','3";	//科目（1保费，2批改缴费，3批改退费）
	var createTimeStart = request.createTimeStart; //开始日期
	var createTimeEnd = request.createTimeEnd; //结束日期
	var policyCustomerNo = request.policyCustomerNo;	//电子保单号
	var sortFieldName = request.sortFieldName || 'startDate';	//排序字段（startDate起保/批改生效日期）
	var sortDir = request.sortDir || 'DESC';	//排序 （ASC升序  DESC降序）
	var pageNumber = request.pageNumber; //页码
	var pageSize = request.pageSize; //页大小
	var resourceType = request.resourceType || '2';	//收支来源类型，1用户   2 险企
	
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
	
	//服务费结算总条数
	var incomeStatementCount = IncomeStatementDomain.getIncomeStatementCount(sqlExecute, supplierID, cityID, operType, subject, createTimeStart, createTimeEnd, policyCustomerNo, resourceType);
	logger.debug("------------incomeStatementCount------------" + incomeStatementCount);
	//服务费结算列表
	var incomeStatementList = IncomeStatementDomain.listIncomeStatement(sqlExecute, supplierID, cityID, operType, subject, createTimeStart, createTimeEnd, policyCustomerNo, resourceType, sortFieldName, sortDir, pageNumber, pageSize);
	
	$_response_$ = {
		errorCode: 0,
		data: {
			totalCount : incomeStatementCount,
			settlementList : incomeStatementList
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
			if(sortFieldName && ['startDate'].indexOf(sortFieldName) == -1){
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