/**
 * 	功能：编辑推荐区海报
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/RecommendDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}

	//推荐ID
	var recommendID = param.recommendID;
	//推荐名称
	var recommendName = param.recommendName;
	//推荐的类型1，商品	2，	 活动
	var recommendType = param.recommendType;
	//活动ID 或者 商品ID
	var valueID	= param.valueID;

	try {
		if(!recommendID || !recommendName || !recommendType || !valueID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		
		var recommendObj = {
				recommendID:recommendID,
				recommendName:recommendName,
				recommendType:recommendType,
				valueID:valueID
		};
		
		RecommendDomain.updateRecommend(sqlAdapter,recommendObj);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("编辑推荐区海报失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
