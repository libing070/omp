/**
 * 	功能：编辑商品状态
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
	//商品状态，（1，草稿 (默认)2，上架 3，灰度上架 4，下架）
	var goodsStatus	= param.goodsStatus;

	try {
		if(!goodsID || !goodsStatus) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		//获取当前商品的状态
		var currentStatus = GoodsDomain.getGoodsStatus(sqlAdapter,goodsID);
		//当商品状态为上架，商品要下架或者灰度上架时，判断商品是否在推荐区海报中调用，
		//如果有调用，提示“推荐区海报有使用此商品，请先更改推荐区海报，再下架/灰度上架商品
		if(currentStatus =='2' && (goodsStatus == '4' || goodsStatus == '3')) {
			var reCount = RecommendDomain.checkRecommendExits(sqlAdapter,"1",goodsID);
			
			if(reCount > 0) {
				if(goodsStatus == '4') {
					logger.error("推荐区海报有使用此商品，请先更改推荐区海报，再下架商品");
					errorResponse(7024);
					return;
				}
				if(goodsStatus == '3') {
					logger.error("推荐区海报有使用此商品，请先更改推荐区海报，再灰度上架商品");
					errorResponse(7025);
					return;
				}
				
			}
		}
		//当商品状态为上架，商品要灰度上架,判断商品是否在推荐区海报中调用，
		//如果有调用，提示“推荐区海报有使用此商品，请先更改推荐区海报，再灰度上架商品。”
//		if(currentStatus =='2' && goodsStatus = '3') {
//			if(reCount > 0) {
//				logger.error("推荐区海报有使用此商品，请先更改推荐区海报，再灰度上架商品");
//				errorResponse(7025);
//				return;
//			}
//		}
		
		//点击“灰度上架”、“正式上架”，系统判断商品的头图片和详情图片是否上传,如果不完整，则不允许
		if(goodsStatus =='2' || goodsStatus =='3') {
			//校验是否上传头图
			var firstCount = GoodsDomain.checkResourceOfGoods(sqlAdapter,goodsID,"1");
			//校验是否上传详情图
			var detailCount = GoodsDomain.checkResourceOfGoods(sqlAdapter,goodsID,"2");
			
			if(firstCount <1 || detailCount<1) {
				logger.error("您有商品信息未填写完整，不能上架；请进行编辑操作，商品信息补充完整后，再上架商品。");
				errorResponse(7014);
				return;
			}
			
		}
		
		
		GoodsDomain.updateGoodsStatus(sqlAdapter,goodsID,goodsStatus);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("编辑商品状态失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
