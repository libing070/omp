/**
 * 	功能：查询商品名称
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/GoodsDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var goodsID = param.goodsID;
	
	try {
		if(!goodsID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var goodsName = GoodsDomain.queryGoodsName(sqlAdapter,goodsID);
		
		$_response_$={
			errorCode:0,
			data:goodsName
		};
	} catch (e) {
		logger.error("获取商品名称失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
