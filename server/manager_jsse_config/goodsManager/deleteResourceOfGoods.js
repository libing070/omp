/**
 * 	功能：删除商品图片
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
	//商品图片ID 
	var goodsImagesRelID = param.goodsImagesRelID;
	
	try {
		if(!goodsID || !goodsImagesRelID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		//删除资源图片
		var sqlAdapter=sqlAdpterHandler.getInstance(true);
		//查询商品图片资源ID
		var imagesID = GoodsDomain.getRelOfGoodsResource(sqlAdapter,goodsImagesRelID);
		GoodsDomain.delResource(sqlAdapter,imagesID);
		
		//删除商品资源关系
		GoodsDomain.delRelOfGoodsResource(sqlAdapter,goodsImagesRelID);
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("删除商品图片失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
