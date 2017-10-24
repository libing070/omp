/**
 * 	功能：删除推荐区海报
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/GoodsDomain.js");
load("/domain/RecommendDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//推荐ID
	var recommendID = param.recommendID;
	
	try {
		if(!recommendID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		//删除推荐区海报
		RecommendDomain.deleteRecommend(sqlAdapter,recommendID);
		//查询产品海报图片资源ID
		var resourceIDOld = RecommendDomain.queryImageOfRecommend(sqlAdapter,recommendID);
		//删除旧的图片资源ID
		GoodsDomain.delResource(sqlAdapter,resourceIDOld);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
		};
	} catch (e) {
		logger.error("删除推荐区海报失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
