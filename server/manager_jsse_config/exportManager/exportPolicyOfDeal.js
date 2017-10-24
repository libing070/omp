/**
 * 描 述：
 * 		导出保单快递申请列表
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
	var kindType = request.kindType; //险种类型，（1.商业险、2.交强险）
	var policyNO = request.policyNO; //险企保单号
	var carOwner = request.carOwner; //车主
	var phoneNo = request.phoneNo; //联系电话
	var startTime = request.startTime; //填写邮寄地址时间（起始）
	var endTime = request.endTime; //填写邮寄地址时间（结束）
	var sortFieldName = request.sortFieldName || 'lastUpdate'; //排序字段（lastUpdate邮寄地址填写时间）
	var sortDir = request.sortDir || 'ASC'; //排序 （ASC升序  DESC降序）

	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000);
		return;
	}
	
	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//根据保单状态查询保单列表（9 系统转保单成功）
	var dealPolicyList = PolicyDomain.listDealPolicy(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime, sortFieldName, sortDir);
	logger.debug("-----------电子保单列表-----------" + JSON.stringify(dealPolicyList));

	var fileName = lo.getFileName();
	logger.debug("生成的报表文件名：" + fileName);
	require("ymt.jsse.jexcel");
	var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
	lo.setHead(jexcelExecute);

	var policy;
	for (var i = 0; i < dealPolicyList.length; i++) {
		policy = dealPolicyList[i];
		jexcelExecute.writeData({
			type: "content",
			data: [
				policy.policyCustomerNo || '',
				policy.policyNO || '',
				policy.carLicenseNO || '',
				policy.supplierShortName || '',
				policy.receiver || '',
				policy.receiverPhone || '',
//				policy.insuredName || '',
//				policy.phoneNO || '',
				policy.address || '',
				policy.lastUpdate || '',
				''
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
			return curDate + "/" + "dealPolicyReport" + "/" + "保单申请快递" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["电子投保单号", "险企保单号", "车牌号", "险企", "邮寄人姓名", "邮寄人电话", "配送地址", "申请日期", "配送日期"]
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