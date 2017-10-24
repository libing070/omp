/**
 * 	功能：新增或编辑活动图片
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/GoodsDomain.js");
load("/domain/ActivityDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//活动图片ID 编辑携带，新增不携带
	var activityImagesRelID = param.activityImagesRelID;	
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
	//	活动ID
	var activityID = param.activityID;	
	//图片HttpUrl
	var httpUrl = "/" + groupName + "/" + remoteFileName;

	try {
		if(!activityID || !groupName || !remoteFileName) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		//活动图片ID，如果此操作为新增商品图片，则不传。如果传值不为空，则为编辑图片商品
		var sqlAdapter=sqlAdpterHandler.getInstance(true);
		
		if(activityImagesRelID) {
			//新增商品图片
			var resObj = {
				httpUrl:httpUrl,
				groupName:groupName,
				remoteFileName:remoteFileName,
				maxWidth:maxWidth,
				maxHeight:maxHeight,
				maxSize:maxSize
			};
			var resourceID = GoodsDomain.addResource(sqlAdapter,resObj);
			
			//编辑活动资源关系
			var activityRelObjU = {
				activityImagesRelID:activityImagesRelID,
				resourceID:resourceID
			};
			
			ActivityDomain.updateRelOfActivityResource(sqlAdapter,activityRelObjU);
			
			//查询活动图片资源ID
			var resourcesIDOld = ActivityDomain.getRelOfActivityResource(sqlAdapter,activityImagesRelID);
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
			var resourceID = GoodsDomain.addResource(sqlAdapter,resObj);
			
			//新增活动资源关系
			var activityRelObj = {
				activityID:activityID,
				resourceID:resourceID,
				status:"N"
			};
			
			activityImagesRelID = ActivityDomain.addRelOfActivityResource(sqlAdapter,activityRelObj);
		}
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0,
			data:{
				activityImagesRelID:activityImagesRelID
			}
			
		};
	} catch (e) {
		logger.error("新增或编辑活动图片失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
