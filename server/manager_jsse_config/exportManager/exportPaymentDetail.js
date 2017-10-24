/**
 * 描 述：
 * 		导出收支明细
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
	var operType = request.operType; //收支类型，（1收入  2支出）
	var subject = request.subject || "1','2','3','4','5','6','7"; //科目（1保费，2批改缴费，3批改退费，4核保失败退费，5投保失败退费，6退保，7车船税）
	var resourceType = request.resourceType; //收支来源类型，1用户   2 险企
	var startDateStart = request.startDateStart; //起保日期开始
	var startDateEnd = request.startDateEnd; //起保日期结束
	var goodsOrderNo = request.goodsOrderNo; //商品订单编号
	var sortFieldName = request.sortFieldName || 'payDate'; //排序字段（payDate收支日期）
	var sortDir = request.sortDir || 'ASC'; //排序 （ASC升序  DESC降序）
	var policyCustomerNo = request.policyCustomerNo;	//电子保单号
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000);
		return;
	}
	
	var sqlExecute = sqlAdpterHandler.getInstance(false);
	var paymentDetailList = IncomeStatementDomain.listPaymentDetail(sqlExecute, supplierID, cityID, operType, subject, resourceType, startDateStart, startDateEnd, goodsOrderNo, sortFieldName, sortDir,policyCustomerNo);

	var fileName = lo.getFileName();
	logger.debug("生成的报表文件名：" + fileName);
	require("ymt.jsse.jexcel");
	var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
	lo.setHead(jexcelExecute);

	var paymentDetail;
	for (var i = 0; i < paymentDetailList.length; i++) {
		paymentDetail = paymentDetailList[i];
		jexcelExecute.writeData({
			type: "content",
			data: [
				paymentDetail.policyCustomerNo || '',
				paymentDetail.policyNO || '',
				paymentDetail.carLicenseNO || '',
				paymentDetail.payOrderCustomerNumber || '',
				paymentDetail.amount || '',
				paymentDetail.operType == '1' ? '收入' : '支出',
				subjectMap[paymentDetail.subject],
				paymentDetail.resourceType == '1' ? '用户' : '险企',
				paymentDetail.supplierShortName || '',
				paymentDetail.cityName || ''
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
	load("/exportDomain/IncomeStatementDomain.js");
	load("/lib/authCheck.js");
	load("/orderManager/common.js");
	var lo = {
		//生成报表文件名
		getFileName: function() {
			var curDate = new Date().Format('yyyyMMdd');
			var curTime = new Date().Format('yyyyMMddHHmmss');
			return curDate + "/" + "feeReport" + "/" + "收支管理" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["电子投保单号", "险企保单号", "车牌号", "支付订单号", "金额", "收支", "科目", "对象", "供应商", "城市"]
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
		}
	};
	return lo;
}