/**
 * 	功能：删除商品
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
	
	//商品ID
	var goodsID = param.goodsID;
	
	try {
		if(!goodsID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		//校验商品状态是否允许删除，只有商品状态为：1-草稿，才允许删除
		var sqlAdapter=sqlAdpterHandler.getInstance(true);
		var goodsStatus = GoodsDomain.getGoodsStatus(sqlAdapter,goodsID);
		
		if(goodsStatus !='1') {
			logger.error("该商品为非草稿状态，不可删除");
			errorResponse(7013);
			return;
		}
		
		//删除商品基本信息
		GoodsDomain.delGoods(sqlAdapter,goodsID);
		
		var imageList = GoodsDomain.getResourceOfGoods(sqlAdapter,goodsID);
		var goodsImagesRelID;
		var imgsID;
		for(var i=0; i < imageList.length;i++) {
			goodsImagesRelID = imageList[i].goodsImagesRelID;	//商品图片ID
			imgsID = imageList[i].imgsID;		//资源ID
			
			//删除资源图片
			GoodsDomain.delResource(sqlAdapter,imgsID);
			
			//删除商品资源关系
			GoodsDomain.delRelOfGoodsResource(sqlAdapter,goodsImagesRelID);
		}
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("删除商品失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
