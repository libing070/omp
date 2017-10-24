/**
 * 描 述：
 * 		导出待支付投保单
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
	var goodsID = request.goodsID; //商品ID
	var policyStatus = request.policyStatus || '5'; //电子保单状态	(5核保通过)
	var policyCustomerNo = request.policyCustomerNo; //电子保单号
	var carOwner = request.carOwner; //车主
	var phoneNo = request.phoneNo; //联系电话
	var sortFieldName = request.sortFieldName || 'underwritingTime'; //排序字段（underwritingTime核保时间）
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
				policy.isGift == 'Y' ? String(policy.goodsName+"（赠品）") : policy.goodsName,
				policy.kindType == '1' ? '商业险' : '交强险',
				policy.carOwner || '',
				policy.phoneNO || '',
				policy.policyFee || '',
				policy.underwritingTime || '',
				policy.supplierShortName || '',
				policy.cityName
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
			return curDate + "/" + "prePayProposalReport" + "/" + "投保单支付保费" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["电子投保单号", "商品名称", "险种类别", "车主", "联系电话", "保费", "核保时间", "供应商", "城市"]
			});
			// 设置列号
			jexcelExecute.setColumnWidth(0, 30);
			jexcelExecute.setColumnWidth(1, 30);
			jexcelExecute.setColumnWidth(2, 20);
			jexcelExecute.setColumnWidth(3, 20);
			jexcelExecute.setColumnWidth(4, 20);
			jexcelExecute.setColumnWidth(5, 20);
			jexcelExecute.setColumnWidth(6, 20);
			jexcelExecute.setColumnWidth(7, 20);
			jexcelExecute.setColumnWidth(8, 20);
		}
	};
	return lo;
}