/**
 * 描 述：
 * 		导出手续费结算列表
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
	var subject = request.subject || "1','2','3"; //科目（1保费，2批改缴费，3批改退费）
	var createTimeStart = request.createTimeStart; //开始日期
	var createTimeEnd = request.createTimeEnd; //结束日期
	var policyCustomerNo = request.policyCustomerNo; //电子保单号
	var sortFieldName = request.sortFieldName || 'startDate'; //排序字段（startDate起保/批改生效日期）
	var sortDir = request.sortDir || 'ASC'; //排序 （ASC升序  DESC降序）
	var resourceType = request.resourceType || '2'; //收支来源类型，1用户   2 险企
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000);
		return;
	}
	
	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//服务费结算列表
	var incomeStatementList = IncomeStatementDomain.listIncomeStatement(sqlExecute, supplierID, cityID, operType, subject, createTimeStart, createTimeEnd, policyCustomerNo, resourceType, sortFieldName, sortDir);

	var fileName = lo.getFileName();
	logger.debug("生成的报表文件名：" + fileName);
	require("ymt.jsse.jexcel");
	var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
	lo.setHead(jexcelExecute);

	var incomeStatement;
	for (var i = 0; i < incomeStatementList.length; i++) {
		incomeStatement = incomeStatementList[i];
		jexcelExecute.writeData({
			type: "content",
			data: [
				incomeStatement.policyCustomerNo || '',
				incomeStatement.policyNO || '',
				incomeStatement.endorseNO || '',
				incomeStatement.carLicenseNO || '',
				incomeStatement.startDate || '',
				incomeStatement.amount || '',
				subjectMap[incomeStatement.subject],
				incomeStatement.supplierShortName || '',
				incomeStatement.cityName || ''
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
			return curDate + "/" + "feeReport" + "/" + "手续费结算" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["电子投保单号", "险企保单号", "险企批单号", "车牌号", "起保日期/批改日期", "金额", "科目", "报价险企", "城市"]
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