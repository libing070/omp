/**
 * 	功能：删除保障方案
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
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		//判断该保障方案是否在“商品管理”中有维护，如果有，则不允许删除
		var goodsCount = ProtectPlanDomain.checkProtectPlanForGoods(sqlAdapter,protectPlanID);
		
		if(goodsCount >0) {
			logger.error("该保障方案已在“商品管理”中有维护，不可删除");
			errorResponse(7010);
			return;
		}
		
		//删除保障方案主表
		ProtectPlanDomain.delProtectPlan(sqlAdapter,protectPlanID);
		//删除保障方案详情
		ProtectPlanDomain.delProtectPlanDetail(sqlAdapter,protectPlanID);
		
		sqlAdapter.commitAndClose();//提交事务
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("删除保障方案失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
