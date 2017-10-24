/**
 * 
 * 功能： 坏账还款计划分析导出
 * 
 * @author nongjinmei
 * 
 * @param {goodsID , cityID , payDateStart ,payDateEnd}
 * 
 */


(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var lo = createLogic();
	//坏账还款计划 状态
	var failStatus=[];
		failStatus.push("3"); //第二次还款失败
		failStatus.push("4"); //终止还款
	
	var queryObj = {
			  goodsID : param.goodsID   //商品ID
			, cityID : param.cityID     //城市ID
			, payDateStart : param.payDateStart //还款日期开始
			, payDateEnd :  param.payDateEnd    //还款日期结束
			, failStatus : failStatus 
		}
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var payPlanForFailArray = HirePurchaseAgreementDomain.queryPayPlanForFail(sqlAdapter, queryObj);
		
		var payPlanForFailList = new Array();
		if(payPlanForFailArray.length > 0 ){
			for(var i = 0 ; i < payPlanForFailArray.length ; i++){
				payPlanForFailList.push(
					{
						currentTime : payPlanForFailArray[i].currentTime ,
						billNumber : payPlanForFailArray[i].billNumber ,
						advancedAmount : payPlanForFailArray[i].advancedAmount ,
						payfee : payPlanForFailArray[i].payfee ,
						surplusPayfee : payPlanForFailArray[i].surplusPayfee
					}
				);
			}
		}
		
		var fileName = lo.getFileName();
		logger.debug("生成的报表文件名：" + fileName);
		require("ymt.jsse.jexcel");
		var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
		lo.setHead(jexcelExecute);
		
		var payCondition;
		for (var i = 0; i < payPlanForFailList.length; i++) {
			payCondition = payPlanForFailList[i];
			jexcelExecute.writeData({
				type: "content",
				data: [
					payCondition.currentTime || '',
					payCondition.billNumber || '',
					payCondition.advancedAmount || '',
					payCondition.payfee || '',
					payCondition.surplusPayfee || ''
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
		
	} catch (e) {
		logger.error(e.toString());
	    errorResponse(9999);
	}
})($_request_param_$, $_request_header_$);


function createLogic() {
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/exportManager/uuid.js");
load("/exportManager/_statusContant.js");
load("/domain/HirePurchaseAgreementDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
load("/orderManager/common.js");

	var lo = {
		//生成报表文件名
		getFileName: function() {
			var curDate = new Date().Format('yyyyMMdd');
			var curTime = new Date().Format('yyyyMMddHHmmss');
			return curDate + "/" + "feeReport" + "/" + "用户坏账" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["期数", "坏帐还款计划数量", "垫付金额(元)", "已还款金额(元)", "未还款金额(元)"]
			});
			// 设置列号
			jexcelExecute.setColumnWidth(0, 20);
			jexcelExecute.setColumnWidth(1, 20);
			jexcelExecute.setColumnWidth(2, 20);
			jexcelExecute.setColumnWidth(3, 20);
			jexcelExecute.setColumnWidth(4, 20);
		}
	};
	return lo;
}