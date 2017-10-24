/**
 * 	功能：发布产品线海报图片
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SystemDomain.js");
load("/domain/GoodsDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//产品海报列表
	var posterList = param.posterList;
	
	try {
		if(!posterList) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var resObj;
		var goodsTypeID;
		var httpUrl;
		var groupName;
		var remoteFileName;
		var maxWidth;	
		var maxHeight;
		var maxSize;
		var goodsTypeObj;
		var resourceID;
		var resourceIDOld;
		for(var i=0; i<posterList.length;i++) {
			goodsTypeID = posterList[i].goodsTypeID;
			groupName = posterList[i].groupName;
			remoteFileName = posterList[i].remoteFileName;
			httpUrl = "/" + groupName + "/" + remoteFileName;
			maxWidth = posterList[i].maxWidth;
			maxHeight = posterList[i].maxHeight;
			maxSize = posterList[i].maxSize;
			
			if(groupName) {
				//新增资源图片
				resObj = {
					httpUrl:httpUrl,
					groupName:groupName,
					remoteFileName:remoteFileName,
					maxWidth:maxWidth,
					maxHeight:maxHeight,
					maxSize:maxSize
				};
				
				resourceID = GoodsDomain.addResource(sqlAdapter,resObj);
				
				resourceIDOld = SystemDomain.queryImageOfGoodsType(sqlAdapter,goodsTypeID);
				
				goodsTypeObj = {
					goodsTypeID:goodsTypeID,
					resourceID:resourceID
				};
				//更新产品线的海报信息
				SystemDomain.publishPosterOfGoodsType(sqlAdapter,goodsTypeObj);
				//删除旧的图片资源ID
				GoodsDomain.delResource(sqlAdapter,resourceIDOld);
			}
		}
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
		};
	} catch (e) {
		logger.error("发布产品线海报图片失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
