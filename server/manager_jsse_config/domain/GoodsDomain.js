/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 * 
 */
var GoodsDomain = {	
	
	/**
	 * 查询商品列表
	 * @param {Object} goodsID ，商品ID ，如果不传，则查询全部。
	 * @param {Object} payType ，付款方式，（分期、全款），可为空
	 * @param {Object} goodsStatus ，商品状态，可为空
	 */
	queryGoodsList:function(sqlAdapter,goodsID,payType,goodsStatus) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = "select a.id as goodsID,a.goodsName,a.goodsTypeID,a.goodsTypeName,a.goodsCustomNumber,a.goodsStatus,a.priority,a.goodsDescription,a.insureType,"
				+"(select codeName from basecode where codeType='insureType' and validStatus='1' and codeValue= a.insureType) as insureTypeName,"
				+"a.protectPlanID,a.minIntervalTime,a.minDay,a.serviceRate,"
				+"(select protectPlanName from protectplan where id = a.protectPlanID) as protectPlanName,"
				+"date_format(a.createTime,'%Y-%m-%d %H:%i:%s') as createTime,date_format(a.lastUpdate,'%Y-%m-%d %H:%i:%s') as lastUpdate "
				+" from goods a where status=@status ";//and kindType='1' "; //kindType=‘1’ 是为了过滤掉交强险，她是固定的流程
		if(goodsID) {
			sql +=' and id= @goodsID';
		}
		if(payType) {
			sql +=' and payType= @payType';
		}
		if(goodsStatus) {
			sql +=' and goodsStatus= @goodsStatus';
		}
		sql +=' order by a.createTime desc ';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				goodsID:goodsID,
				payType:payType,
				goodsStatus:goodsStatus
				
			},
			recordType:"object",
			resultType:"string"
		});
		
		var goodsList = JSON.parse(result);
		return goodsList;
	},
	
	/**
	 * 查询商品名称(上架商品)
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsID
	 */
	queryGoodsName:function(sqlAdapter,goodsID) {
		var sql = 'select goodsName from goods where status=@status and goodsStatus=@goodsStatus and id=@goodsID';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:'N',
				goodsStatus:'2',
				goodsID:goodsID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var goodsName = JSON.parse(result)[0].goodsName;
		return goodsName;
	},
	
	/**
	 * 
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsID
	 */
	getGoodsName:function(sqlAdapter,goodsID,goodsStatus) {
		var sql = 'select goodsName from goods where status=@status and id=@goodsID ';
		
		if(goodsStatus) {
			sql += ' and goodsStatus=@goodsStatus';
		}
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				status:'N',
				goodsID:goodsID,
				goodsStatus:goodsStatus
			},
			recordType:"object",
			resultType:"string"
		});
		var goodsName;
		if(JSON.parse(retStr).length>0) {
			goodsName = JSON.parse(retStr)[0].goodsName;
		}

		return goodsName;
		
	},
	
	
	/**
	 * 判断商品自定义编码是否重复，如果重复，不允许新增
	 * @param {Object} goodsID ，商品ID 
	 * @param {Object} goodsCustomNumber ，商品自定义编码
	 */
	checkGoodsCustomNumber:function(sqlAdapter,goodsID,goodsCustomNumber) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = 'select count(1) as count from goods where status=@status and goodsCustomNumber=@goodsCustomNumber ';
		if(goodsID) {
			sql +=' and id !=@goodsID'; //用于 编辑商品基本信息时，排除它自身
		}
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				status:'N',
				goodsID:goodsID,
				goodsCustomNumber:goodsCustomNumber
			},
			recordType:"object",
			resultType:"string"
		});
		var numCount = JSON.parse(retStr)[0].count;
		return numCount;
	},
	
	
	/**
	 * 判断商品名称是否重复，如果重复，不允许新增
	 * @param {Object} goodsID ，商品ID 
	 * @param {Object} goodsName ，商品名称
	 */
	checkGoodsName:function(sqlAdapter,goodsID,goodsName) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = 'select count(1)as count from goods where status=@status and goodsName=@goodsName ';
		if(goodsID) {
			sql +=' and id !=@goodsID'; //用于 编辑商品基本信息时，排除它自身
		}
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				status:'N',
				goodsID:goodsID,
				goodsName:goodsName
			},
			recordType:"object",
			resultType:"string"
		});
		var nameCount = JSON.parse(retStr)[0].count;
		return nameCount;
	},
	
	/**
	 * 新增商品基本信息
	 * @param {Object} goodsObj
	 */
	addGoodsBaseInfo:function(sqlAdapter,goodsObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var goodsID = JSON.parse(sqlAdapter.execute({
			sql:'insert into goods (goodsCustomNumber,goodsName,goodsDescription,goodsTypeID,goodsTypeName,insureType,'
				+'protectPlanID,payType,minIntervalTime,minDay,kindType,serviceRate,goodsStatus,status,priority,createTime,lastUpdate) '
				+'values (@goodsCustomNumber,@goodsName,@goodsDescription,@goodsTypeID,@goodsTypeName,@insureType,'
				+'@protectPlanID,@payType,@minIntervalTime,@minDay,@kindType,@serviceRate,@goodsStatus,@status,@priority,now(),now())',
			param:goodsObj,
			returnRowId:true
		}));
		
		return goodsID;
		
	},
	
	/**
	 * 编辑商品基本信息
	 * @param {Object} goodsObj
	 */
	updateGoodsBaseInfo:function(sqlAdapter,goodsObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:'update goods set goodsCustomNumber=@goodsCustomNumber,goodsName=@goodsName,goodsDescription=@goodsDescription,goodsTypeID=@goodsTypeID,'
				+'goodsTypeName=@goodsTypeName,insureType=@insureType,protectPlanID=@protectPlanID,payType=@payType,minIntervalTime=@minIntervalTime,'
				+'minDay=@minDay,serviceRate=@serviceRate,lastUpdate=now() where id=@goodsID',
			param:goodsObj
		}));
	},
	
	/**
	 * 回显商品图片
	 * @param {Object} goodsID，商品ID
	 */
	getResourceOfGoods:function(sqlAdapter,goodsID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = 'select a.id as goodsImagesRelID,a.resourcesType,b.httpUrl,a.priority,b.id as imgsID '
				+' from goods_images_rel a,resources b where a.resourcesID = b.id and a.goodsID=@goodsID order by a.priority desc';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				goodsID:goodsID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var imageList = JSON.parse(result);
		return imageList;	
	},
	
	/**
	 * 更新商品图片排序
	 * @param {Object} imagesSortList
	 */
	updateImagePriorityForGoods:function(sqlAdapter,imagesSortList) {
		var priority;//排序
		for(var i=0; i <imagesSortList.length;i++) {
			priority = imagesSortList[i].priority;
			if(!priority) {
				imagesSortList[i].priority = null;
			}
		}
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  goods_images_rel set priority=@priority,lastUpdate=now() where id=@goodsImagesRelID",
			param:imagesSortList
		}));
	},
	
	/**
	 * 
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsSortList
	 */
	updatePriorityOfGoods:function(sqlAdapter,goodsSortList) {
		var priority;//排序
		for(var i=0; i <goodsSortList.length;i++) {
			priority = goodsSortList[i].priority;
			if(!priority) {
				goodsSortList[i].priority = null;
			}
		}
		
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  goods set priority=@priority,lastUpdate=now() where id=@goodsID",
			param:goodsSortList
		}));
	},
	
	/**
	 * 获取商品状态（1-草稿，2-上架，3-测试上架，4-下架）
	 * @param {Object} goodsID
	 */
	getGoodsStatus:function(sqlAdapter,goodsID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = 'select goodsStatus from goods where status=@status and id=@goodsID ';
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				status:'N',
				goodsID:goodsID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var goodsStatus;
		if(JSON.parse(retStr).length >0) {
			goodsStatus = JSON.parse(retStr)[0].goodsStatus;
		}
		
		return goodsStatus;
		
	},
	
	/**
	 * 删除商品基本信息,
	 * @param {Object} goodsID，商品ID
	 */
	delGoods:function(sqlAdapter,goodsID) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		JSON.parse(sqlAdapter.execute({
			sql:"update goods set status=@status where id=@goodsID",
			param:{
				status:"D",
				goodsID:goodsID
			}
		}));
	},
	
	/**
	 * 删除商品资源关系
	 * @param {Object} goodsImagesRelID，商品资源关系ID
	 */
	delRelOfGoodsResource:function(sqlAdapter,goodsImagesRelID) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		JSON.parse(sqlAdapter.execute({
			sql:"delete from goods_images_rel where id=@goodsImagesRelID ",
			param:{
				goodsImagesRelID:goodsImagesRelID
			}
		}));
	},
	
	/**
	 * 删除资源图片
	 * @param {Object} imgsID，图片资源ID
	 */
	delResource:function(sqlAdapter,imgsID) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		JSON.parse(sqlAdapter.execute({
			sql:"delete from resources where id=@imgsID",
			param:{
				imgsID:imgsID
			}
		}));
	},
	
	/**
	 *新增资源图片
	 * @param {Object} resObj
	 */
	addResource:function(sqlAdapter,resObj) {
		var imagesID = JSON.parse(sqlAdapter.execute({
			sql:'insert into resources (httpUrl,groupName,remoteFileName,maxWidth,maxHeight,maxSize,createTime,lastUpdate) '
				+'values (@httpUrl,@groupName,@remoteFileName,@maxWidth,@maxHeight,@maxSize,now(),now())',
			param:resObj,
			returnRowId:true
		}));
		
		return imagesID;
	},
	
	/**
	 * 新增商品资源关系
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsRelObj
	 */
	addRelOfGoodsResource:function(sqlAdapter,goodsRelObj) {
		var goodsImagesRelID = JSON.parse(sqlAdapter.execute({
			sql:'insert into goods_images_rel (goodsID,resourcesID,resourcesType,createTime,lastUpdate) '
				+'values (@goodsID,@resourcesID,@resourcesType,now(),now())',
			param:goodsRelObj,
			returnRowId:true
		}));
		
		return goodsImagesRelID;
		
	},
	
	/**
	 * 修改商品资源关系
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsRelObj
	 */
	updateRelOfGoodsResource:function(sqlAdapter,goodsRelObj) {
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  goods_images_rel set resourcesID=@resourcesID,resourcesType=@resourcesType,lastUpdate=now() where id=@goodsImagesRelID",
			param:goodsRelObj
		}));
		
	},
	
	/**
	 * 编辑商品状态
	 * @param {Object} goodsID,商品ID
	 * @param {Object} goodsStatus，商品状态，（1-草稿 ， 2-上架 ，3-测试上架， 4-下架）
	 */
	updateGoodsStatus:function(sqlAdapter,goodsID,goodsStatus) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  goods set goodsStatus =@goodsStatus,lastUpdate=now() where id=@goodsID",
			param:{
				goodsID:goodsID,
				goodsStatus:goodsStatus
			}
		}));
	},
	
	/**
	 * 查询商品图片资源ID
	 * @param {Object} goodsImagesRelID,商品图片ID
	 */
	getRelOfGoodsResource:function(sqlAdapter,goodsImagesRelID) {
		var sql = 'select resourcesID from goods_images_rel where id=@goodsImagesRelID';
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				goodsImagesRelID:goodsImagesRelID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var resourcesID;
		if(JSON.parse(retStr).length >0) {
			resourcesID = JSON.parse(retStr)[0].resourcesID;
		}
		
		return resourcesID;
		
	},
	
	/**
	 * 校验该商品 是否上传图片
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsID,商品ID
	 * @param {Object} resourcesType,资源类型（1-头图，2-详情图）
	 */
	checkResourceOfGoods:function(sqlAdapter,goodsID,resourcesType) {
		var sql = 'select count(1) as count from goods_images_rel where goodsID=@goodsID and resourcesType=@resourcesType ';
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				goodsID:goodsID,
				resourcesType:resourcesType
			},
			recordType:"object",
			resultType:"string"
		});
		var resCount = JSON.parse(retStr)[0].count;
		return resCount;
	},
	
	
	/**
	 * 查询商品信息
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsID,商品ID
	 */
	findGoodsByID : function(sqlAdapter,goodsID){
		var retStr = sqlAdapter.query({
			sql: "select id,id as goodsID,goodsCustomNumber,goodsName,goodsTypeID,goodsTypeName,goodsDescription,protectPlanID,"
			     +"insureType,payType,minIntervalTime,minDay,status,goodsStatus,kindType,serviceRate,priority,"
			     +"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				 +"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				 +"from goods where id = @goodsID",
			param:{
				goodsID : goodsID
			},
			recordType:"object",
			resultType:"string"
		});
		var goods = JSON.parse(retStr)[0];
		return goods;
	},
	
	/**
	 * 	查询推荐商品列表
	 * @param {Object} sqlAdapter
	 */
	queryRecommendGoodsList:function(sqlAdapter){
		var status = 'N';
		var sql = "select r.id as recommendGoodsID,r.goodsID,g.goodsCustomNumber,g.goodsName,r.showGoodsTypeID,r.priority,r.createTime,r.lastUpdate,"
				+"g.goodsTypeID,g.goodsTypeName,g.goodsStatus,g.goodsDescription,gs.name as showGoodsTypeName "
				 +"from recommend_goods r join goods g on g.id=r.goodsID join goodstype gs on gs.id=r.showGoodsTypeID where g.status=@status "
				 +"and gs.status=@status order by r.showGoodsTypeID asc,r.createTime asc";
				 
	 	var result = sqlAdapter.query({
	 		sql:sql,
	 		param:{
	 			status:status
	 		},
			recordType:"object",
			resultType:"string"
	 	});
	 	
	 	var recommendGoodsList = JSON.parse(result);
	 	return recommendGoodsList;
	},
	
	/**
	 * 判断产品类型中是否已有此商品时
	 * @param {Object} sqlAdapter
	 * @param {Object} showGoodsTypeID
	 * @param {Object} goodsID
	 */
	checkRecommondGoods:function(sqlAdapter,showGoodsTypeID,goodsID){
		var sql = "select count(1) as count from recommend_goods where showGoodsTypeID=@showGoodsTypeID and goodsID=@goodsID";
		var result = sqlAdapter.query({
			sql:sql,
			param:{
				showGoodsTypeID:showGoodsTypeID,
				goodsID:goodsID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var checkRecommondGoodsCount = JSON.parse(result)[0].count;
		return checkRecommondGoodsCount;
	},
	
	/**
	 * 根据id获取商品唯一编码
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsID
	 */
	getGoodsCustomNumber:function(sqlAdapter,goodsID) {
		var sql = 'select goodsCustomNumber from goods where status=@status and id=@goodsID';
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				status:'N',
				goodsID:goodsID
			},
			recordType:"object",
			resultType:"string"
		});
		var goodsCustomNumber;
		if(JSON.parse(retStr).length>0) {
			goodsCustomNumber = JSON.parse(retStr)[0].goodsCustomNumber;
		}
		return goodsCustomNumber;
	},
	
	/**
	 * 新增推荐商品
	 * @param {Object} sqlAdapter
	 * @param {Object} recommendGoodsObj
	 */
	insertRecommendGoods:function(sqlAdapter,recommendGoodsObj){
		var recommendGoodsID = JSON.parse(sqlAdapter.execute({
			sql:'insert into recommend_goods(goodsID,goodsCustomNumber,goodsName,showGoodsTypeID,priority,createTime,lastUpdate) '
				+'values(@goodsID,@goodsCustomNumber,@goodsName,@showGoodsTypeID,@priority,now(),now())',
			param:recommendGoodsObj,
			returnRowId:true
		}));
		
		return recommendGoodsID;
	},
	
	/**
	 * 删除推荐商品信息
	 * @param {Object} sqlAdapter
	 * @param {Object} recommendGoodsID
	 */
	delRecommendGoods:function(sqlAdapter,recommendGoodsID){
		JSON.parse(sqlAdapter.execute({
			sql:"delete from recommend_goods where id=@recommendGoodsID",
			param:{
				recommendGoodsID:recommendGoodsID
			}
		}));
	},
	
	/**
	 * 更新推荐商品排序
	 * @param {Object} sqlAdapter
	 * @param {Object} sortList
	 */
	updateSortOfRecommendGoods:function(sqlAdapter,sortList) {
		var priority;//排序
		for(var i=0; i <sortList.length;i++) {
			priority = sortList[i].priority;
			if(!priority) {
				sortList[i].priority = null;
			}
		}
		
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update recommend_goods set priority=@priority,lastUpdate=now() where id=@recommendGoodsID",
			param:sortList
		}));
	},
	
	/**
	 * 根据多个商品状态查询商品信息（包括交强险）
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsStatus
	 */
	queryGoodsByStatus:function(sqlAdapter,goodsStatus) {
		var status = 'N';
		var sql = "select id as goodsID,goodsName from goods a where status=@status";
		var gstatus; //商品状态
		if(goodsStatus.length>0) {
			for(var i=0;i<goodsStatus.length;i++){
				gstatus = goodsStatus[i].gstatus;
				if(i==0){
					sql +=" and goodsStatus= "+gstatus+"";
				}else{
					sql +=" or goodsStatus= "+gstatus+"";
				}
			}
		}
		sql +=" order by createTime desc ";
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status
			},
			recordType:"object",
			resultType:"string"
		});
		
		var goodsList = JSON.parse(result);
		return goodsList;
	}
	
	
	
};

