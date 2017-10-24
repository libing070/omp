/**
 * 	功能：回显商品图片
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
	
	//商品ID
	var goodsID	= param.goodsID;
	
	try {
		if(!goodsID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var goodsStatus = GoodsDomain.getGoodsStatus(sqlAdapter,goodsID);
		
		var imageList = GoodsDomain.getResourceOfGoods(sqlAdapter,goodsID);
		
		$_response_$={
			errorCode:0,
			data:{
				goodsStatus:goodsStatus,
				imageList:imageList
			}
		
		};
	} catch (e) {
		logger.error("回显商品图片失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
