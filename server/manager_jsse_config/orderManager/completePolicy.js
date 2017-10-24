/**
 * 	功能：投保成功
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
	var policyID = request.policyID; //电子保单ID
	var goodsOrderID = request.goodsOrderID; //商品订单ID（非赠送险，此值必填）
	var proposalNO = request.proposalNO; //投保单号
	var policyNO = request.policyNO; //保单号
	var sumPremium = request.sumPremium; //保单金额

	if (!AuthCheck.isLogin(request.ticket, request.domain)) {
		errorResponse(-1000, {
			logoutUrl: logoutUrl
		});
		return;
	}

	if (!policyID || !proposalNO || !policyNO) {
		errorResponse(-1);
		return;
	}
	var sqlExecute = sqlAdpterHandler.getInstance(true);
	if(isRepeatedPolicyNO(sqlExecute, proposalNO, policyNO)){
		logger.error("投保单号或者保单号重复");
		errorResponse(7120);
		return;
	}
	//查询电子(投)保单
	var policy = PolicyDomain.findPolicyByID(sqlExecute, policyID);
	if (!policy || ['3', '8'].indexOf(policy.policyStatus) == -1) {
		logger.error("没有查询到[" + policyID + "]的电子保单或者保单状态不正确");
		errorResponse(7102);
		return;
	}
	//查询商品订单(非赠送险保单)
	var goodsOrder;
	if (policy.goodsTypeID && policy.goodsTypeID != '0' && goodsOrderID) {
		//查询商品订单
		goodsOrder = GoodsOrderDomain.findGoodsOrderByID(sqlExecute, goodsOrderID);
		logger.debug("[" + goodsOrderID + "]的商品订单:" + JSON.stringify(goodsOrder));
		if (!goodsOrder) {
			logger.error("没有查询到[" + goodsOrderID + "]的商品订单");
			errorResponse(7101);
			return;
		}
	}
	try {
		if (policy.goodsTypeID && policy.goodsTypeID != '0' && goodsOrderID) {
			//更新商品订单状态(7 完成出单)
			GoodsOrderDomain.updateGoodsOrderStatus(sqlExecute, goodsOrderID, '7');
			//新增商品订单状态记录
			GoodsOrderStatusDomain.addGoodsOrderStatus(sqlExecute, goodsOrderID, '7', '完成出单');
		}
		//更新电子保单状态(9 系统转保单成功)
		PolicyDomain.updatePolicyStatus(sqlExecute, policyID, '9');
		//新增电子保单状态记录
		PolicyStatusDomain.addPolicyOrderStatus(sqlExecute, policyID, '9', '系统转保单成功');
		//更新电子保单表
		var updatePolicy = {
			policyNO: policyNO,
			proposalNO: proposalNO,
			sumPremium: (policy.goodsTypeID=='1' || policy.goodsTypeID=='4' || policy.goodsTypeID=='0') ? sumPremium : policy.sumPremium, //[1天天保][4交强险]保存用户填写的保费
			policyID: policyID
		};
		PolicyDomain.updatePolicy(sqlExecute, updatePolicy);
		policy['proposalNO'] = proposalNO;
		policy['policyNO'] = policyNO;
		//记录收支明细
		addIncomeStatement(sqlExecute, goodsOrder, policy, updatePolicy);

		if (policy.goodsTypeID && policy.goodsTypeID != '0' && goodsOrderID) { //如果不是赠品（即赠送的司机险）
			notifyMessage(sqlExecute, '1', policy, goodsOrder);
		}

		//提交事务
		sqlExecute.commitAndClose();
		$_response_$ = {
			errorCode: 0
		};
	} catch (e) {
		logger.error("编辑投保成功异常," + e);
		//回滚事务
		sqlExecute.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);


//记录收支明细
function addIncomeStatement(sqlExecute, goodsOrder, policy, updatePolicy) {
	var incomeStatement = {
		payOrderID: goodsOrder ? goodsOrder.payOrderID : 0,
		goodsOrderID: goodsOrder ? goodsOrder.goodsOrderID : 0,
		policyID: policy.policyID,
		policyNo: updatePolicy.policyNO,
		operType: '2', //收支类型，(1收入  2支出)
		subject: '1', //1保费
		resourceType: '2', //1用户   2险企
		resourceValue: policy.supplierID,
		supplierID: policy.supplierID,
		goodsTypeCitySupplierRelID: goodsOrder ? goodsOrder.goodsTypeCitySupplierRelID : 0,
//		cityID: goodsOrder ? goodsOrder.cityID : 0,
		cityID: policy.cityID,
		cityName: policy.cityName
	};
	if (policy.goodsTypeID == '1') { //天天保
		incomeStatement['amount'] = updatePolicy.sumPremium;
		IncomeStatementDomain.addIncomeStatement(sqlExecute, incomeStatement);
	} else if ((policy.goodsTypeID == '2' && policy.kindType == '1') || (!policy.goodsTypeID || policy.goodsTypeID=='0')) { //2车险白条 1商业险   OR  1天天保 赠送险
		incomeStatement['amount'] = updatePolicy.sumPremium;
		IncomeStatementDomain.addIncomeStatement(sqlExecute, incomeStatement);
	} else if (policy.goodsTypeID == '2' && policy.kindType == '2') { //2车险白条 	2交强险
		incomeStatement['amount'] = updatePolicy.sumPremium; //科目：保费
		IncomeStatementDomain.addIncomeStatement(sqlExecute, incomeStatement);
		incomeStatement['subject'] = '7'; //科目 ：车船税
		incomeStatement['amount'] = policy.sumTravelTax;
		IncomeStatementDomain.addIncomeStatement(sqlExecute, incomeStatement);
	}else if(policy.goodsTypeID == '4' && policy.kindType == '2') { //4产品线：交强险 	2交强险) {
		incomeStatement['amount'] = updatePolicy.sumPremium; //科目：保费
		IncomeStatementDomain.addIncomeStatement(sqlExecute, incomeStatement);
		incomeStatement['subject'] = '7'; //科目 ：车船税
		incomeStatement['amount'] = policy.sumTravelTax;
		IncomeStatementDomain.addIncomeStatement(sqlExecute, incomeStatement);
	}
}


/**
 * 描述：判断proposalNO、PolicyNO是否重复
 * @param
 * @return 
 */
function isRepeatedPolicyNO(sqlExecute, proposalNO, policyNO){
	if(PolicyDomain.findPolicyByProposalNO(sqlExecute, proposalNO)){
		return true;
	}else if(PolicyDomain.findPolicyByPolicyNO(sqlExecute, policyNO)){
		return true;
	}
	return false;
}