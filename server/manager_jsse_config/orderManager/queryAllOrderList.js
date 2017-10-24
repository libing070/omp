/**
 * 	功能：查询商品订单列表
 *  @author niuxiaojie
 */
(function(request, header) {
	var supplierID = request.supplierID; //供应商ID
	var cityID = request.cityID; //城市ID
	var goodsID = request.goodsID; //商品ID
	var goodsOrderStatus = request.goodsOrderStatus; //商品订单状态
	var createTimeStart = request.createTimeStart; //订单创建起始时间
	var createTimeEnd = request.createTimeEnd; //订单创建结束时间
	var goodsOrderNumber = request.goodsOrderNumber; //商品订单编号
	var carOwner = request.carOwner; //车主
	var phoneNo = request.phoneNo; //联系电话
	var payOrderNumber = request.payOrderNumber; //支付订单编号
	var policyCustomerNo = request.policyCustomerNo; //电子保单号
	var sortFieldName = request.sortFieldName || 'lastUpdate';	//排序字段（lastUpdate商品订单更新时间）
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
	
	//查询商品订单总数
	var goodsOrderCount = lo.getGoodsOrderCount(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo);
	//查询商品订单列表
	var goodsOrderList = lo.listGoodsOrder(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo, sortFieldName, sortDir, pageNumber, pageSize);
	logger.debug("-----------商品订单列表-----------" + JSON.stringify(goodsOrderList));
	
	$_response_$ = {
		errorCode: 0,
		data: {
			totalCount : goodsOrderCount,
			goodsOrderList : goodsOrderList
		}
	};
})($_request_param_$, $_request_header_$);


function createLogic() {
	load("/common/_errorCode.js");
	load("/common/_importConfig.js");
	load("/domain/DBUtils.js");
	load("/domain/GoodsOrderDomain.js");
	load("/lib/authCheck.js");
	var lo = {
		//检验参数
		checkParam : function(sortFieldName, sortDir, pageNumber, pageSize){
			var errMsg;
			if(sortFieldName && ['lastUpdate'].indexOf(sortFieldName) == -1){
				errMsg = "请求携带参数[sortFieldName]不合法";
			}else if(sortDir && ['ASC','DESC'].indexOf(sortDir) == -1){
				errMsg = "请求携带参数[sortDir]不合法";
			}else if(!pageNumber || !pageSize || typeof pageNumber != 'number' || typeof pageSize != 'number'){
				errMsg = "请求携带参数[pageNumber]或[pageSize]不合法";
			}
			return errMsg;
		},
		//查询商品订单总数
		getGoodsOrderCount : function(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo){
			var goodsOrderCount = GoodsOrderDomain.getGoodsOrderCount(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo);
			return goodsOrderCount;
		},
		//根据条件查询商品订单列表
		listGoodsOrder: function(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo, sortFieldName, sortDir, pageNumber, pageSize) {
			var goodsOrderList = GoodsOrderDomain.listGoodsOrder(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo, sortFieldName, sortDir, pageNumber, pageSize);
			return goodsOrderList;
		}
	};
	return lo;
}