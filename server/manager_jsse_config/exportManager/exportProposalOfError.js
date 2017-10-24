/**
 * 描 述：
 * 		导出转投保单异常投保单
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
	var policyStatus = request.policyStatus || '3'; //电子保单状态	(3系统转投保单失败 8系统转保单失败)
	var policyCustomerNo = request.policyCustomerNo; //电子保单号
	var carOwner = request.carOwner; //车主
	var phoneNo = request.phoneNo; //联系电话
	var errorTimeStart = request.errorTimeStart; //填写系统异常起始时间
	var errorTimeEnd = request.errorTimeEnd; //系统异常终止时间
	var sortFieldName = request.sortFieldName || 'errorTime'; //排序字段（errorTime系统异常时间）
	var sortDir = request.sortDir || 'ASC'; //排序 （ASC升序  DESC降序）
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000);
		return;
	}

	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//根据保单状态查询保单列表
	var policyList = PolicyDomain.listPolicyByStatus(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo,errorTimeStart, errorTimeEnd,policyStatus, sortFieldName, sortDir);
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
				policy.startDate || '',
				policy.endDate || '',
				policy.carFrameNO || '',
				policy.carEngineNO || '',
				policy.modelCName || '', //车型代码
				policy.carLicenseNO || '',
				policy.seatCount || '', //座位数
				policy.exhaustScale || '',//排量
				policy.insuredName || '',
				policy.insuredCardID || '',
				policy.phoneNO || '', //用户手机号
				policy.payAccount || '', //用户付款账号
				policy.payMethod ? (policy.payMethod == '1' ? '微信' : '支付宝') : '', //付款账户类别
				policy.carOwner || '',
				policy.ownerCardID || '',
				policy.goodsName || '', //商品名称
				policy.supplierShortName || '',
				policy.goodsTypeName || '',//产品类别
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
			return curDate + "/" + "errorProposalReport" + "/" + "转投保单异常处理" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["电子投保单号", "支付订单号", "起保日期", "终保日期", "车架号", "发动机号", "车型代码", "车牌号", "座位数", "排量", "被保险人", "被保险人身份证号", "用户手机号", "用户付款账号", "付款账户类别", "车主", "车主身份证号", "商品名称", "报价险企", "产品类别", "订单状态"]
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
			jexcelExecute.setColumnWidth(9, 20);
			jexcelExecute.setColumnWidth(10, 20);
			jexcelExecute.setColumnWidth(11, 20);
			jexcelExecute.setColumnWidth(12, 20);
			jexcelExecute.setColumnWidth(13, 20);
			jexcelExecute.setColumnWidth(14, 20);
			jexcelExecute.setColumnWidth(15, 20);
			jexcelExecute.setColumnWidth(16, 20);
			jexcelExecute.setColumnWidth(17, 20);
			jexcelExecute.setColumnWidth(18, 20);
			jexcelExecute.setColumnWidth(19, 20);
			jexcelExecute.setColumnWidth(20, 20);
		}
	};
	return lo;
}