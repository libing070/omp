/**
 * 	功能：新增推荐区海报
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
	//推荐名称
	var recommendName = param.recommendName;
	//推荐的类型1，	商品 	2，活动
	var recommendType = param.recommendType;
	//活动ID 或者 商品ID
	var valueID	= param.valueID;
	//发布状态，（1，发布，2未发布）
	var recommendationStatus = "2";
	var priority = "1";//新增时，排序默认为：1
	var status = "N";

	try {
		if(!recommendName || !recommendType || !valueID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var recObj = {
			recommendName:recommendName,
			recommendType:recommendType,	
			valueID:valueID,
			recommendationStatus:recommendationStatus,
			priority:priority,
			status:status
		};
		var recommendID = RecommendDomain.insertRecommend(sqlAdapter,recObj);
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0,
			data:{
				recommendID:recommendID
			}
		};
	} catch (e) {
		logger.error("新增推荐区海报失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
