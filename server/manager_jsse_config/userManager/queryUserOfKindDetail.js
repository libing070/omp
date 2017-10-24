/**
 * 	功能：查询用户商品订单保障详情
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/GoodsOrderDomain.js");
load("/domain/PolicyKindDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var goodsOrderID = request.goodsOrderID; //商品订单ID
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if (!goodsOrderID) {
		errorResponse(-1);
		return;
	}

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//商品订单基本信息
	var goodsOrder = GoodsOrderDomain.findGoodsOrderByID(sqlExecute, goodsOrderID);
	//用户商品订单保障详情
	var kindList = PolicyKindDomain.listPolicyKindByPolicyID(sqlExecute, goodsOrder.policyID);
	goodsOrder.kindList = kindList;

	$_response_$ = {
		errorCode: 0,
		data: goodsOrder
	};
})($_request_param_$, $_request_header_$);