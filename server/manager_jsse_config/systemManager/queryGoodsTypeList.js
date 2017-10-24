/**
 * 	功能：查询产品线海报列表
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SystemDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var goodsTypeList = SystemDomain.queryGoodsTypeList(sqlAdapter);
		
		$_response_$={
			errorCode:0,
			data:goodsTypeList
		};
	} catch (e) {
		logger.error("获取产品线海报列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
