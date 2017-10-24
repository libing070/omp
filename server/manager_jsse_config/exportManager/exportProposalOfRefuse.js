/**
 * 描 述：
 * 		导出核保不通过投保单
 * 走 向：
 * 		
 * 规 则：
 * 		
 * 时 机：
 *
 * @author niuxiaojie
 */
(function(request, header) {
	var lo = createLogic();
	var supplierID = request.supplierID; //供应商ID
	var cityID = request.cityID; //城市ID
	var policyStatus = request.policyStatus || '6'; //电子保单状态	(6 核保不通过)
	var goodsID = request.goodsID; //商品ID
	var policyCustomerNo = request.policyCustomerNo; //电子保单号
	var carOwner = request.carOwner; //车主
	var phoneNo = request.phoneNo; //联系电话
	var sortFieldName = request.sortFieldName || 'refuseTime'; //排序字段（refuseTime拒保时间）
	var sortDir = request.sortDir || 'ASC'; //排序 （ASC升序  DESC降序）
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000);
		return;
	}

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//根据保单状态查询保单列表
	var policyList = PolicyDomain.listPolicyByStatus(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo,"","", policyStatus, sortFieldName, sortDir);
	logger.debug("-----------电子保单列表-----------" + JSON.stringify(policyList));

	var fileName = lo.getFileName();
	logger.debug("生成的报表文件名：" + fileName);
	require("ymt.jsse.jexcel");
	var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
	lo.setHead(jexcelExecute);

	var policy;
	for (var i = 0; i < policyList.length; i++) {
		policy = policyList[i];
		jexcelExecute.writeData({
			type: "content",
			data: [
				policy.policyCustomerNo || '',
				policy.payOrderCustomerNumber || '',
				policy.isGift == 'Y' ? String(policy.goodsName+"（赠品）") : policy.goodsName,
				policy.payFee || '',
				policy.carOwner || '', //账户名称
				policy.phoneNO || '',
				policy.payAccount || '', //用户付款账号
				policy.payMethod ? (policy.payMethod == '1' ? '微信' : '支付宝') : '', //付款账户类别
				policy.supplierShortName || '',
				policy.cityName || '',
				policyStatusMap[policy.policyStatus]
			]
		});
	}

	jexcelExecute.close();
	$_response_$ = {
		errorCode: 0,
		data: {
			reportUrl: String(reportUrlPre + fileName + ".xls")
		}
	};
})($_request_param_$, $_request_header_$);



function createLogic() {
	load("/common/_errorCode.js");
	load("/domain/DBUtils.js");
	load("/exportManager/uuid.js");
	load("/common/_importConfig.js");
	load("/exportManager/_statusContant.js");
	load("/exportDomain/PolicyDomain.js");
	load("/lib/authCheck.js");
	load("/orderManager/common.js");
	var lo = {
		//生成报表文件名
		getFileName: function() {
			var curDate = new Date().Format('yyyyMMdd');
			var curTime = new Date().Format('yyyyMMddHHmmss');
			return curDate + "/" + "refusePolicyReport" + "/" + "投保单拒保处理" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["电子投保单号", "支付订单号", "商品名称", "订单金额", "账户名称", "手机号码", "用户付款账号", "付款账户类别", "报价险企", "城市", "订单状态"]
			});
			// 设置列号
			jexcelExecute.setColumnWidth(0, 30);
			jexcelExecute.setColumnWidth(1, 30);
			jexcelExecute.setColumnWidth(2, 30);
			jexcelExecute.setColumnWidth(3, 20);
			jexcelExecute.setColumnWidth(4, 20);
			jexcelExecute.setColumnWidth(5, 20);
			jexcelExecute.setColumnWidth(6, 20);
			jexcelExecute.setColumnWidth(7, 20);
			jexcelExecute.setColumnWidth(8, 20);
			jexcelExecute.setColumnWidth(9, 20);
			jexcelExecute.setColumnWidth(10, 20);
		}
	};
	return lo;
}