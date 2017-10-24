/**
 * 	功能：新增推荐商品
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
	//呈现的产品线ID
	var showGoodsTypeID = param.showGoodsTypeID;
	
	try {
		if(!goodsID || !showGoodsTypeID) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
			
		//判断产品类型中是否已有此商品时，如果重复，不允许新增
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		
		var checkRecommondGoodsCount = GoodsDomain.checkRecommondGoods(sqlAdapter,showGoodsTypeID,goodsID);
		if(checkRecommondGoodsCount>0){
			logger.error("该产品类型中已有此商品，请重新选择");
			errorResponse(7103);
			return;
		}
		
		//获取商品编号
		var goodsCustomNumber = GoodsDomain.getGoodsCustomNumber(sqlAdapter,goodsID);
		//获取商品名称
		var goodsStatus;
		var goodsName = GoodsDomain.getGoodsName(sqlAdapter,goodsID,goodsStatus);
		
		//定义商品基本信息对象   id,goodsID,goodsCustomNumber,goodsName,showGoodsTypeID,priority,createTime,lastUpdate 
		var recommendGoodsObj = {
			goodsCustomNumber:goodsCustomNumber,
			goodsName:goodsName,
			goodsID:goodsID,
			showGoodsTypeID:showGoodsTypeID,
			priority:"1"  //新增时，排序默认为1
		};
		
		var recommendGoodsID = GoodsDomain.insertRecommendGoods(sqlAdapter,recommendGoodsObj);
		
		sqlAdapter.commitAndClose();//提交事务
			
		$_response_$={
			errorCode:0,
			data:{
				recommendGoodsID:recommendGoodsID
			}
		};
	} catch (e) {
		logger.error("新增推荐商品失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
