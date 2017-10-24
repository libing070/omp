/**
 * 	功能：查询投保单异常列表
 *  @author niuxiaojie
 */
(function(request, header) {
	var supplierID = request.supplierID; //供应商ID
	var cityID = request.cityID; //城市ID
	var goodsID = request.goodsID; //商品ID
	var policyStatus = request.policyStatus || '3,8'; //电子保单状态	(3系统转投保单失败 8系统转保单失败)
	var policyCustomerNo = request.policyCustomerNo; //电子保单号
	var carOwner = request.carOwner; //车主
	var phoneNo = request.phoneNo; //联系电话
	var errorTimeStart = request.errorTimeStart; //填写系统异常起始时间
	var errorTimeEnd = request.errorTimeEnd; //系统异常终止时间
	var sortFieldName = request.sortFieldName || 'errorTime';	//排序字段（errorTime系统异常时间）
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
	
	//根据保单状态查询保单总数
	var policyCount = lo.getPolicyCount(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo,errorTimeStart,errorTimeEnd, policyStatus);
	//根据保单状态查询保单列表
	var policyList = lo.listPolicyByStatus(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo,errorTimeStart,errorTimeEnd,  policyStatus, sortFieldName, sortDir, pageNumber, pageSize);
	logger.debug("-----------电子保单列表-----------" + JSON.stringify(policyList));
	
	$_response_$ = {
		errorCode: 0,
		data: {
			totalCount : policyCount,
			policyList : policyList
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
		checkParam : function(sortFieldName, sortDir, pageNumber, pageSize){
			var errMsg;
			if(sortFieldName && ['errorTime'].indexOf(sortFieldName) == -1){
				errMsg = "请求携带参数[sortFieldName]不合法";
			}else if(sortDir && ['ASC','DESC'].indexOf(sortDir) == -1){
				errMsg = "请求携带参数[sortDir]不合法";
			}else if(!pageNumber || !pageSize || typeof pageNumber != 'number' || typeof pageSize != 'number'){
				errMsg = "请求携带参数[pageNumber]或[pageSize]不合法";
			}
			return errMsg;
		},
		//根据保单状态查询保单总数
		getPolicyCount : function(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo, errorTimeStart,errorTimeEnd, policyStatus){
			var policyCount = PolicyDomain.getPolicyCount(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo,errorTimeStart,errorTimeEnd,  policyStatus);
			return policyCount;
		},
		//根据保单状态查询保单列表
		listPolicyByStatus: function(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo, errorTimeStart,errorTimeEnd, policyStatus, sortFieldName, sortDir, pageNumber, pageSize) {
			var policyList = PolicyDomain.listPolicyByStatus(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo,errorTimeStart,errorTimeEnd,  policyStatus, sortFieldName, sortDir, pageNumber, pageSize);
			return policyList;
		}
	};
	return lo;
}