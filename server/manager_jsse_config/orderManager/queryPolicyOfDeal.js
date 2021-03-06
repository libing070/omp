/**
 * 	功能：查询保单快递申请列表
 *  @author niuxiaojie
 */
(function(request, header) {
	var supplierID = request.supplierID; //供应商ID
	var cityID = request.cityID; //城市ID
	var kindType = request.kindType; //险种类型，（1.商业险、2.交强险）
	var policyNO = request.policyNO; //险企保单号
	var carOwner = request.carOwner; //车主
	var phoneNo = request.phoneNo; //联系电话
	var startTime = request.startTime; //填写邮寄地址时间（起始）
	var endTime = request.endTime; //填写邮寄地址时间（结束）
	var sortFieldName = request.sortFieldName || 'lastUpdate'; //排序字段（lastUpdate邮寄地址填写时间）
	var sortDir = request.sortDir || 'DESC'; //排序 （ASC升序  DESC降序）
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

	//根据保单状态查询保单总数（9 系统转保单成功）
	var dealPolicyCount = lo.getDealPolicyCount(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime);
	//根据保单状态查询保单列表（9 系统转保单成功）
	var dealPolicyList = lo.listDealPolicy(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime, sortFieldName, sortDir, pageNumber, pageSize);
	logger.debug("-----------电子保单列表-----------" + JSON.stringify(dealPolicyList));

	$_response_$ = {
		errorCode: 0,
		data: {
			totalCount: dealPolicyCount,
			policyList: dealPolicyList
		}
	};
})($_request_param_$, $_request_header_$);


function createLogic() {
	load("/common/_errorCode.js");
	load("/domain/DBUtils.js");
	load("/domain/PolicyDomain.js");
	load("/common/_importConfig.js");
	load("/lib/authCheck.js");
	var lo = {
		//检验参数
		checkParam: function(sortFieldName, sortDir, pageNumber, pageSize) {
			var errMsg;
			if (sortFieldName && ['lastUpdate'].indexOf(sortFieldName) == -1) {
				errMsg = "请求携带参数[sortFieldName]不合法";
			} else if (sortDir && ['ASC', 'DESC'].indexOf(sortDir) == -1) {
				errMsg = "请求携带参数[sortDir]不合法";
			} else if (!pageNumber || !pageSize || typeof pageNumber != 'number' || typeof pageSize != 'number') {
				errMsg = "请求携带参数[pageNumber]或[pageSize]不合法";
			}
			return errMsg;
		},
		//根据保单状态查询保单总数（9 系统转保单成功）
		getDealPolicyCount: function(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime) {
			var policyCount = PolicyDomain.getDealPolicyCount(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime);
			return policyCount;
		},
		//根据保单状态查询保单列表（9 系统转保单成功）
		listDealPolicy: function(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime, sortFieldName, sortDir, pageNumber, pageSize) {
			var policyList = PolicyDomain.listDealPolicy(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime, sortFieldName, sortDir, pageNumber, pageSize);
			return policyList;
		}
	};
	return lo;
}