/**
 * 	功能：判断商品图片是否上传完毕
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
	var goodsID = param.goodsID;

	try {
		if(!goodsID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		
		var resourcesType1 = "1";
		var resourcesType2 = "2";
		//判断商品头图是否已经上传	
		var count1 = GoodsDomain.checkResourceOfGoods(sqlAdapter,goodsID,resourcesType1);
		
		//判断商品详情图是否已经上传	
		var count2 = GoodsDomain.checkResourceOfGoods(sqlAdapter,goodsID,resourcesType2);
		
		if(count1 >0 && count2>0) {
			finishFlag = "Y";
		}else {
			finishFlag = "N";
		}
		$_response_$={
			errorCode:0,
			data:finishFlag
			
		};
	} catch (e) {
		logger.error("判断商品图片是否上传完毕失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
