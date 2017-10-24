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
	
	var imagesSort = param.imagesSort;

	try {
		if(!imagesSort) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var goodsImagesRelID;//商品图片ID 
		var priority;//排序值
		var imageObj;
		var imagesSortNew = new Array();
		for(var i= 0; i < imagesSort.length; i++) {
			goodsImagesRelID = imagesSort[i].goodsImagesRelID;
			priority = imagesSort[i].priority;
			imageObj = {
				goodsImagesRelID:goodsImagesRelID,
				priority:priority
			}
			imagesSortNew.push(imageObj);
			
		}
		
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		GoodsDomain.updateImagePriorityForGoods(sqlAdapter,imagesSortNew);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("更新商品图片排序失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
