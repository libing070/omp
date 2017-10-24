/**
 * 	功能：支付保费
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/PolicyDomain.js");
load("/domain/PolicyStatusDomain.js");
load("/orderManager/common.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
//	if(!AuthCheck.isLogin(request.ticket, request.domain)){
//		errorResponse(-1000, {logoutUrl : logoutUrl});
//		return;
//	}
//	
	var supplierOrderNo = request.orderNo;    //险企商品订单号
	var payStatus = request.payStatus;	      //支付状态,1 表示支付成功,0 表示支付失败
	
	var errorCodeR = request.errorCode;

	if (!supplierOrderNo || !payStatus) {
		errorResponse(-1);
		return;
	}
	try {
		var sqlExecute = sqlAdpterHandler.getInstance(true);
		//查询电子(投)保单
		var policy = PolicyDomain.findPolicyBySupplierOrderNO(sqlExecute, supplierOrderNo);
		
		logger.debug("------------------payStatus="+payStatus);
		//情况一：支付成功
		if(payStatus =="1") {
			var goodsOrderID;//商品订单ID
			var payOrderID;//支付订单ID
			var policyID;//电子保单ID
			var kindType;	//险种类型，（1.商业险、2.交强险）
			var goodsTypeID;//产品类别ID
			
			if(policy) {
				goodsOrderID = policy.goodsOrderID;
				payOrderID = policy.payOrderID;
				policyID = policy.policyID;
				kindType = policy.kindType;
				goodsTypeID = policy.goodsTypeID;
			}
			if(!goodsOrderID || !payOrderID || !policyID) {
				errorResponse(-1);
				return;
			}
			logger.debug("-------------policyID="+policyID);
			
			//电子保单状态改成:7-公司已支付
			PolicyDomain.updatePolicyStatus(sqlExecute, policyID, '7');
			
			//新增电子保单状态记录
			PolicyStatusDomain.addPolicyOrderStatus(sqlExecute, policyID, '7', '公司已支付');
			
		}
		
		//提交事务
		sqlExecute.commitAndClose();
		
		$_response_$ = {
			errorCode: 0
		};
		
	} catch (e) {
		logger.error("支付保费异常" + e);
		
		//回滚事务
		sqlExecute.rollbackAndClose();
		throw e;
	}

})($_request_param_$, $_request_header_$);

