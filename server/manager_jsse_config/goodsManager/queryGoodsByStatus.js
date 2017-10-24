/**
 * 	功能：更新商品图片排序
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
	
	var goodsStatus = param.goodsStatus;

	try {
		if(!goodsStatus) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var gstatusnew;//商品状态
		var statusObj;
		var goodsStatusNew = new Array();
		for(var i= 0; i < goodsStatus.length; i++) {
			gstatusnew = goodsStatus[i].gstatus;
			statusObj = {
				gstatus:gstatusnew
			}
			goodsStatusNew.push(statusObj);
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var goodsByStatusList = GoodsDomain.queryGoodsByStatus(sqlAdapter,goodsStatusNew);
		
		$_response_$={
			errorCode:0,
			data:goodsByStatusList
		};
	} catch (e) {
		logger.error("查询推荐商品列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
