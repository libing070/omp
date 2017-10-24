/**
 * 	功能：2.6.1	查询推荐商品列表
 *  
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
	
	try {
		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var recommendGoodsList = GoodsDomain.queryRecommendGoodsList(sqlAdapter);
		
		$_response_$={
			errorCode:0,
			data:recommendGoodsList
		};
	} catch (e) {
		logger.error("查询推荐商品列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
