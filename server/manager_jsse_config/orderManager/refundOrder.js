/**
 * 	功能：订单退费
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/GoodsOrderDomain.js");
load("/domain/GoodsOrderStatusDomain.js");
load("/domain/PolicyDomain.js");
load("/domain/PolicyStatusDomain.js");
load("/domain/IncomeStatementDomain.js");
load("/orderManager/common.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var payOrderID = request.payOrderID; //支付订单ID
	var goodsOrderID = request.goodsOrderID; //商品订单ID
	var policyID = request.policyID; //电子保单ID
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if (!payOrderID || !goodsOrderID || !policyID) {
		errorResponse(-1);
		return;
	}
	var sqlExecute = sqlAdpterHandler.getInstance(true);
	//查询电子(投)保单
	var policy = PolicyDomain.findPolicyByID(sqlExecute, policyID);
	if (!policy || ['6', '3', '8'].indexOf(policy.policyStatus) == -1) {
		logger.error("没有查询到[" + policyID + "]的电子保单或者保单状态不正确");
		errorResponse(7102);
		return;
	}
	//查询商品订单
	var goodsOrder = GoodsOrderDomain.findGoodsOrderByID(sqlExecute, goodsOrderID);
	logger.debug("[" + goodsOrderID + "]的商品订单:" + JSON.stringify(goodsOrder));
	if (!goodsOrder) {
		logger.error("没有查询到[" + goodsOrderID + "]的商品订单");
		errorResponse(7101);
		return;
	}

	try {
		var description = policy.policyStatus == '6' ? '由于保险公司拒保，支付订单的金额已经退回至您的帐户' : '由于保险公司系统问题，支付订单的金额已经退回至您的帐户';
		//更新商品订单状态(8 已退费)
		GoodsOrderDomain.updateGoodsOrderStatus(sqlExecute, goodsOrderID, '8');
		//新增商品订单状态记录
		GoodsOrderStatusDomain.addGoodsOrderStatus(sqlExecute, goodsOrderID, '8', description);
		//更新电子保单状态(10 已退费)
		PolicyDomain.updatePolicyStatus(sqlExecute, policyID, '10');
		//新增电子保单状态记录
		PolicyStatusDomain.addPolicyOrderStatus(sqlExecute, policyID, '10', description);
		//记录收支明细
		var incomeStatement = {
			payOrderID: goodsOrder.payOrderID,
			goodsOrderID: goodsOrder.goodsOrderID,
			policyID: goodsOrder.policyID,
			policyNo: policy.policyNO,
			amount: goodsOrder.amount,
			operType: '2', //收支类型，(1收入  2支出)
			subject: policy.policyStatus == '6' ? '4' : '5',	//4核保失败退费(用户)， 5投保失败退费(用户)
			resourceType: '1', //1用户   2险企
			resourceValue: goodsOrder.userID,
			supplierID: goodsOrder.supplierID,
			goodsTypeCitySupplierRelID: goodsOrder.goodsTypeCitySupplierRelID,
			cityID: goodsOrder.cityID,
			cityName: goodsOrder.cityName
		};
		var incomeStatementID = IncomeStatementDomain.addIncomeStatement(sqlExecute, incomeStatement);
		
		notifyMessage(sqlExecute, '2', policy, goodsOrder);
		
		//提交事务
		sqlExecute.commitAndClose();
		$_response_$ = {
			errorCode: 0,
			data: {
				paymentDetailID: incomeStatementID
			}
		};
	} catch (e) {
		logger.error("订单退费异常," + e);
		//回滚事务
		sqlExecute.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);