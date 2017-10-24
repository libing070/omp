/**
 * 	功能：查询商品列表
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
	//商品ID		不传入， 则查询全部。
	var goodsID	= param.goodsID;
	//付款方式，（分期、全款），可为空
	var payType	= param.payType;	
	//状态 不传为全部
	var goodsStatus = param.goodsStatus;	

	
	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		var goodsList = GoodsDomain.queryGoodsList(sqlAdapter,goodsID,payType,goodsStatus);
		
		$_response_$={
			errorCode:0,
			data:goodsList
	
		};
	} catch (e) {
		logger.error("获取商品列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
