/**
 * 	功能：新增或编辑商品图片
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
	//商品图片ID 编辑携带，新增不携带
	var goodsImagesRelID = param.goodsImagesRelID;	
	// FastDFS组信息
	var groupName = param.groupName;	
	//FastDFS文件信息
	var remoteFileName = param.remoteFileName;
	//图片宽度
	var maxWidth = param.maxWidth;	
	//图片高度
	var maxHeight = param.maxHeight;
	//图片大小
	var maxSize = param.maxSize;
	//	商品ID
	var goodsID = param.goodsID;	
	//	图片类型(1 商品详情页头图 2 详情页详细图)
	var resourcesType = param.resourcesType;			
	//图片HttpUrl
	var httpUrl = "/" + groupName + "/" + remoteFileName;
	
	try {
		if(!goodsID || !groupName || !remoteFileName || !resourcesType|| !maxWidth|| !maxHeight|| !maxSize) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		//商品图片ID，如果此操作为新增商品图片，则不传。如果传值不为空，则为编辑图片商品
		var sqlAdapter=sqlAdpterHandler.getInstance(true);
		
		if(goodsImagesRelID) {
			
			//新增商品图片
			var resObj = {
				httpUrl:httpUrl,
				groupName:groupName,
				remoteFileName:remoteFileName,
				maxWidth:maxWidth,
				maxHeight:maxHeight,
				maxSize:maxSize
			};
			var resourcesID = GoodsDomain.addResource(sqlAdapter,resObj);
			
			//编辑商品资源关系
			var goodsRelObjU = {
				goodsImagesRelID:goodsImagesRelID,
				resourcesID:resourcesID,
				resourcesType:resourcesType
			};
			
			GoodsDomain.updateRelOfGoodsResource(sqlAdapter,goodsRelObjU);
			//查询商品图片资源ID
			var resourcesIDOld = GoodsDomain.getRelOfGoodsResource(sqlAdapter,goodsImagesRelID);
			//删除旧的图片资源ID
			GoodsDomain.delResource(sqlAdapter,resourcesIDOld);
			
		}else {
			//新增商品图片
			var resObj = {
				httpUrl:httpUrl,
				groupName:groupName,
				remoteFileName:remoteFileName,
				maxWidth:maxWidth,
				maxHeight:maxHeight,
				maxSize:maxSize
			};
			var resourcesID = GoodsDomain.addResource(sqlAdapter,resObj);
			
			//新增商品资源关系
			var goodsRelObj = {
				goodsID:goodsID,
				resourcesID:resourcesID,
				resourcesType:resourcesType
			};
			
			goodsImagesRelID = GoodsDomain.addRelOfGoodsResource(sqlAdapter,goodsRelObj);
		}
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0,
			data:{
				goodsImagesRelID:goodsImagesRelID
			}
			
		};
	} catch (e) {
		logger.error("新增或编辑商品图片失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
