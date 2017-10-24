/**
 * 	功能：判断保障方案是否允许编辑
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/ProtectPlanDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//保障方案ID
	var protectPlanID = param.protectPlanID;

	try {
		if(!protectPlanID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		//判断该保障方案是否在“商品管理”中有维护，如果有，则不允许编辑
		var goodsCount = ProtectPlanDomain.checkProtectPlanForGoods(sqlAdapter,protectPlanID);
		
		var updateFlag;
		if(goodsCount >0) {
			updateFlag = "N";
		}else {
			updateFlag = "Y";
		}
		$_response_$={
			errorCode:0,
			data:updateFlag
			
		};
	} catch (e) {
		logger.error("判断保障方案是否允许编辑失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
