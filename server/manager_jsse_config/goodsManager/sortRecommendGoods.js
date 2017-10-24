/**
 * 	功能：编辑推荐商品排序
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
	
	var sorts = param.sorts;

	try {
		if(!sorts) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		
		GoodsDomain.updateSortOfRecommendGoods(sqlAdapter,sorts);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
		};
	} catch (e) {
		logger.error("编辑推荐商品排序失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
