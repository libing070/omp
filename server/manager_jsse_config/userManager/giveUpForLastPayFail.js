/**
 * 	功能：退保（最终未还款）
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/HirePurchaseAgreementDomain.js");
load("/domain/PayOrderDomain.js");
load("/domain/GoodsOrderDomain.js");
load("/domain/GoodsOrderStatusDomain.js");
load("/domain/PolicyDomain.js");
load("/domain/PolicyStatusDomain.js");
load("/orderManager/common.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var hirePurchaseAgreementID = request.hirePurchaseAgreementID; //还款计划ID
	var payOrderID = request.payOrderID; //支付订单ID
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if (!hirePurchaseAgreementID || !payOrderID) {
		errorResponse(-1);
		return;
	}

	var sqlExecute = sqlAdpterHandler.getInstance(true);

	try {
		//根据还款计划ID查询还款计划
		var hirePurchaseAgreement = HirePurchaseAgreementDomain.findHirePurchaseAgreementByID(sqlExecute, hirePurchaseAgreementID);
		if (!hirePurchaseAgreement || hirePurchaseAgreement.status != '3') {
			logger.error("没有查询到[" + hirePurchaseAgreementID + "]的还款计划或者当前订单满足退保条件");
			errorResponse(7103);
			return;
		}
		//根据支付订单ID查询商品订单
		var goodsOrderList = PayOrderDomain.listGoodsOrderByID(sqlExecute, payOrderID);
		for (var i = 0; i < goodsOrderList.length; i++) {
			var goodsOrder = goodsOrderList[i];
			var policy = PolicyDomain.findPolicyByGoodsOrderID(sqlExecute, goodsOrder.goodsOrderID);
			var goodsOrderStatus = goodsOrder.kindType == '1' ? '11' : '10'; //1商业险——11已退保		2交强险——10欠款
			var policyStatus = policy.kindType == '1' ? '11' : '12'; //1商业险——11已退保		2交强险——12欠款
			//更新商品订单状态
			GoodsOrderDomain.updateGoodsOrderStatus(sqlExecute, goodsOrder.goodsOrderID, goodsOrderStatus);
			//新增商品订单状态记录
			GoodsOrderStatusDomain.addGoodsOrderStatus(sqlExecute, goodsOrder.goodsOrderID, goodsOrderStatus, '由于二次扣款失败，您的车险已退保');
			//更新电子保单状态
			PolicyDomain.updatePolicyStatus(sqlExecute, policy.policyID, policyStatus);
			//新增电子保单状态记录
			PolicyStatusDomain.addPolicyOrderStatus(sqlExecute, policy.policyID, policyStatus, '由于二次扣款失败，您的车险已退保');
			//
			notifyMessage(sqlExecute, '4', policy, goodsOrder);
		}
		//还款计划终止	4 退保（终保）
		HirePurchaseAgreementDomain.updatehirePurchaseAgreementStatus(sqlExecute, hirePurchaseAgreementID, '4');
		
		//提交事务
		sqlExecute.commitAndClose();
		$_response_$ = {
			errorCode: 0
		};
	} catch (e) {
		logger.error("退保异常," + e);
		//回滚事务
		sqlExecute.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);