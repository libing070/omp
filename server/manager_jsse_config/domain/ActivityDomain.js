/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 * 
 */
var ActivityDomain = {	
	
	/**
	 * 查询活动列表
	 * @param {Object} sqlAdapter
	 */
	queryActivityList:function(sqlAdapter) {
		var sql = 'select id as activityID,activityName from activity where status=@status order by createTime desc';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:'N'
			},
			recordType:"object",
			resultType:"string"
		});
		
		var activityList = JSON.parse(result);
		return activityList;
	},
	
	/**
	 * 查询活动名称
	 * @param {Object} sqlAdapter
	 * @param {Object} activityID
	 */
	queryActivityName:function(sqlAdapter,activityID) {
		var sql = 'select activityName from activity where status=@status and id=@activityID';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:'N',
				activityID:activityID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var activityName = JSON.parse(result)[0].activityName;
		return activityName;
	},
	
	/**
	 * 查询活动名称
	 * @param {Object} sqlAdapter
	 * @param {Object} activityID
	 */
	getActivityName:function(sqlAdapter,activityID) {
		var sql = 'select activityName from activity where status=@status and id=@activityID';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				activityID:activityID,
				status:'N'
			},
			recordType:"object",
			resultType:"string"
		});
		
		var activityName;
		if(JSON.parse(result).length >0) {
			activityName = JSON.parse(result)[0].activityName;
		}
		return activityName;
	},
	
	/**
	 * 判断活动名称是否重复，如果重复，不允许新增
	 * @param {Object} activityID ，活动ID 
	 * @param {Object} activityName ，活动名称
	 */
	checkActivityName:function(sqlAdapter,activityID,activityName) {
		var sql = 'select count(1)as count from activity where status=@status and activityName=@activityName ';
		if(activityID) {
			sql +=' and id !=@activityID'; //用于 编辑活动名称时，排除它自身
		}
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				status:'N',
				activityID:activityID,
				activityName:activityName
			},
			recordType:"object",
			resultType:"string"
		});
		var nameCount = JSON.parse(retStr)[0].count;
		return nameCount;
	},
	
	/**
	 * 新增活动
	 * @param {Object} sqlAdapter
	 * @param {Object} activityObj
	 */
	insertActivity:function(sqlAdapter,activityObj) {
		var activityID = JSON.parse(sqlAdapter.execute({
			sql:'insert into activity (activityName,status,createTime,lastUpdate) values (@activityName,@status,now(),now())',
			param:activityObj,
			returnRowId:true
		}));
		
		return activityID;
	},
	
	/**
	 * 编辑活动名称
	 * @param {Object} sqlAdapter
	 * @param {Object} activityObj
	 */
	updateActivity:function(sqlAdapter,activityObj) {
		var id = JSON.parse(sqlAdapter.execute({
			sql:'update activity set activityName=@activityName,lastUpdate=now() where id=@activityID',
			param:activityObj
		}));
	},
	
	/**
	 * 回显活动图片
	 * @param {Object} activityID，商品ID
	 */
	getResourceOfActivity:function(sqlAdapter,activityID) {
		var sql = 'select a.id as activityImagesRelID,b.httpUrl,a.priority,b.id as imgsID from activity_resource_rel a,'
				+'resources b where a.resourceID = b.id and a.activityID=@activityID order by a.priority desc ';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				activityID:activityID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var imageList = JSON.parse(result);
		return imageList;	
	},
	
	
	/**
	 * 修改活动资源关系
	 * @param {Object} sqlAdapter
	 * @param {Object} activityRelObj
	 */
	updateRelOfActivityResource:function(sqlAdapter,activityRelObj) {
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update activity_resource_rel set resourceID=@resourceID,lastUpdate=now() where id=@activityImagesRelID",
			param:activityRelObj
		}));
	},
	
	/**
	 * 新增活动资源关系
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsRelObj
	 */
	addRelOfActivityResource:function(sqlAdapter,activityRelObj) {
		var activityImagesRelID = JSON.parse(sqlAdapter.execute({
			sql:'insert into activity_resource_rel (activityID,resourceID,status,createTime,lastUpdate) '
				+'values (@activityID,@resourceID,@status,now(),now())',
			param:activityRelObj,
			returnRowId:true
		}));
		
		return activityImagesRelID;
		
	},
	
	/**
	 * 查询活动资源关系
	 * @param {Object} activityImagesRelID,商品图片ID
	 */
	getRelOfActivityResource:function(sqlAdapter,activityImagesRelID) {
		var sql = 'select resourceID from activity_resource_rel where id=@activityImagesRelID';
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				activityImagesRelID:activityImagesRelID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var resourceID;
		if(JSON.parse(retStr).length >0) {
			resourceID = JSON.parse(retStr)[0].resourceID;
		}
		return resourceID;
		
	},
	
	/**
	 * 删除活动资源关系
	 * @param {Object} sqlAdapter
	 * @param {Object} activityImagesRelID，活动资源关系ID
	 */
	delRelOfActivityResource:function(sqlAdapter,activityImagesRelID) {
		JSON.parse(sqlAdapter.execute({
			sql:"delete from activity_resource_rel where id=@activityImagesRelID ",
			param:{
				activityImagesRelID:activityImagesRelID
			}
		}));
	},
	
	
	/**
	 * 更新活动图片排序
	 * @param {Object} imagesSortList
	 */
	updateImagePriorityForActivity:function(sqlAdapter,imagesSortList) {
		var priority;//排序
		for(var i=0; i <imagesSortList.length;i++) {
			priority = imagesSortList[i].priority;
			if(!priority) {
				imagesSortList[i].priority = null;
			}
		}
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update activity_resource_rel set priority=@priority,lastUpdate=now() where id=@activityImagesRelID",
			param:imagesSortList
		}));
	},
	
	/**
	 * 删除活动,
	 * @param {Object} activityID，活动ID
	 */
	delActivity:function(sqlAdapter,activityID) {
		JSON.parse(sqlAdapter.execute({
			sql:"delete from activity where id=@activityID",
			param:{
				activityID:activityID
			}
		}));
	}
};

