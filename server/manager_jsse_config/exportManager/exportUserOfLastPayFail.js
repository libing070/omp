/**
 * 描 述：
 * 		导出最终未还款用户
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
	var lastPayDate = request.lastPayDate; //最终扣款日期
	var carOwner = request.carOwner; //车主
	var phoneNO = request.phoneNO; //电话号码
	var licenseNO = request.licenseNO; //车牌号
	//	var status = '3'; //	2 第一次还款失败	3 第二次还款失败
	var sortFieldName = request.sortFieldName || 'lastPayDate'; //排序字段（lastPayDate最终扣款日期）
	var sortDir = request.sortDir || 'DESC'; //排序 （ASC升序  DESC降序）

	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000);
		return;
	}
	
	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//查询最终未还款用户列表
	var lastPayFailList = HirePurchaseAgreementDomain.listLastPayFail(sqlExecute, lastPayDate, carOwner, phoneNO, licenseNO, sortFieldName, sortDir);

	var fileName = lo.getFileName();
	logger.debug("生成的报表文件名：" + fileName);
	require("ymt.jsse.jexcel");
	var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
	lo.setHead(jexcelExecute);

	var lastPayFail;
	for (var i = 0; i < lastPayFailList.length; i++) {
		lastPayFail = lastPayFailList[i];
		jexcelExecute.writeData({
			type: "content",
			data: [
				lastPayFail.policyCustomerNo || '',
				lastPayFail.policyNO || '',
				lastPayFail.carLicenseNO || '',
				lastPayFail.insuredName || '',
				lastPayFail.goodsName || '',
				'失败',
				lastPayFail.noPayAmount || '',
				lastPayFail.supplierShortName || '',
				lastPayFail.cityName || ''
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
	load("/exportDomain/HirePurchaseAgreementDomain.js");
	load("/lib/authCheck.js");
	load("/orderManager/common.js");
	var lo = {
		//生成报表文件名
		getFileName: function() {
			var curDate = new Date().Format('yyyyMMdd');
			var curTime = new Date().Format('yyyyMMddHHmmss');
			return curDate + "/" + "lastPayFailReport" + "/" + "二次未还款" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["电子投保单号", "险企保单号", "车牌号", "被保险人", "商品名称", "二次扣款结果", "未偿还保费金额", "报价险企", "城市"]
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