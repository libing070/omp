/**
 * 	功能：取消订单
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/GoodsOrderDomain.js");
load("/domain/GoodsOrderStatusDomain.js");
load("/domain/PolicyDomain.js");
load("/domain/PolicyStatusDomain.js");
load("/domain/IncomeStatementDomain.js");
load("/domain/HirePurchaseAgreementDomain.js");
load("/orderManager/common.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var payOrderID = request.payOrderID; //支付订单ID
	var goodsOrderID = request.goodsOrderID; //商品订单ID
	var policyID = request.policyID; //电子保单ID
	
	if (!AuthCheck.isLogin(request.ticket, request.domain)) {
		errorResponse(-1000, {
			logoutUrl: logoutUrl
		});
		return;
	}
	
	if (!policyID) {
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
	//查询商品订单(非赠送险保单,即车险白条)
	var goodsOrder;
	var hirePurchaseAgreement;
	if (policy.goodsTypeID && policy.goodsTypeID != '0' && goodsOrderID) {
		//查询商品订单
		goodsOrder = GoodsOrderDomain.findGoodsOrderByID(sqlExecute, goodsOrderID);
		logger.debug("[" + goodsOrderID + "]的商品订单:" + JSON.stringify(goodsOrder));
		if (!goodsOrder) {
			logger.error("没有查询到[" + goodsOrderID + "]的商品订单");
			errorResponse(7101);
			return;
		}
		hirePurchaseAgreement = HirePurchaseAgreementDomain.findHirePurchaseAgreementByGoodsOrderID(sqlExecute, goodsOrderID);
		if (!hirePurchaseAgreement) {
			logger.error("没有查询到[" + goodsOrderID + "]的商品订单对应的分期计划");
			errorResponse(7105);
			return;
		}
	}
	try {
		var description = policy.policyStatus == '6' ? '由于保险公司拒保，订单已取消' : '由于保险公司系统问题，订单已取消';
		if (policy.goodsTypeID && policy.goodsTypeID != '0' && goodsOrderID) {	//车险白条
			//更新商品订单状态(9 已取消)
			GoodsOrderDomain.updateGoodsOrderStatus(sqlExecute, goodsOrderID, '9');
			//新增商品订单状态记录
			GoodsOrderStatusDomain.addGoodsOrderStatus(sqlExecute, goodsOrderID, '9', description);
			//还款计划终止	4 退保（终保）
			HirePurchaseAgreementDomain.updatehirePurchaseAgreementStatus(sqlExecute, hirePurchaseAgreement.hirePurchaseAgreementID, '4');
		}
		//更新电子保单状态(14 已取消)
		PolicyDomain.updatePolicyStatus(sqlExecute, policyID, '14');
		//新增电子保单状态记录
		PolicyStatusDomain.addPolicyOrderStatus(sqlExecute, policyID, '14', description);

		if (policy.goodsTypeID && policy.goodsTypeID != '0' && goodsOrderID) { //非赠送险保单,即车险白条
			notifyMessage(sqlExecute, '3', policy, goodsOrder);
		}

		//提交事务
		sqlExecute.commitAndClose();
		$_response_$ = {
			errorCode: 0
		};
	} catch (e) {
		logger.error("取消订单异常," + e);
		//回滚事务
		sqlExecute.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);