/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 * 
 */
var RecommendDomain = {
	
	/**
	 * 查询推荐区海报列表
	 * @param {Object} sqlAdapter
	 */
	queryRecommendList:function(sqlAdapter) {
		
 		var sql = 'select a.id as recommendID,a.recommendName,a.resourceID as resourcesID,'
 			+'b.httpUrl as resourcesUrl,b.groupName,b.remoteFileName,b.maxWidth,b.maxHeight,b.maxSize,a.valueID,a.recommendType,a.priority from recommendation a '
			+' left join resources b on a.resourceID = b.id where a.status=@status order by a.createTime desc';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:'N'
			},
			recordType:"object",
			resultType:"string"
		});
		
		var recommendList = JSON.parse(result);
		return recommendList;
	},
	
	/**
	 * 查询产品海报图片资源ID
	 * @param {Object} sqlAdapter
	 * @param {Object} recommendID
	 */
	queryImageOfRecommend:function(sqlAdapter,recommendID) {
		var sql = "select resourceID from recommendation where status=@status and id=@recommendID ";
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:'N',
				recommendID:recommendID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var resourceID;
		if(JSON.parse(result).length >0) {
			resourceID = JSON.parse(result)[0].resourceID;
		}
		return resourceID;
		
	},
	
	/**
	 * 新增推荐区海报
	 * @param {Object} sqlAdapter
	 * @param {Object} recObj
	 */
	insertRecommend:function(sqlAdapter,recObj) {
		var recommendID = JSON.parse(sqlAdapter.execute({
			sql:'insert into recommendation (recommendName,recommendType,valueID,recommendationStatus,status,priority,createTime,lastUpdate) '
				+' values (@recommendName,@recommendType,@valueID,@recommendationStatus,@status,@priority,now(),now())',
			param:recObj,
			returnRowId:true
		}));
		
		return recommendID;
	},
	
	/**
	 * 编辑推荐区海报顺序
	 * @param {Object} sqlAdapter
	 * @param {Object} recommendSortList
	 */
	updatePriorityOfRecommend:function(sqlAdapter,recommendSortList) {
		var priority;//排序
		for(var i=0; i <recommendSortList.length;i++) {
			priority = recommendSortList[i].priority;
			if(!priority) {
				recommendSortList[i].priority = null;
			}
		}
		
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update recommendation set priority=@priority,lastUpdate=now() where id=@recommendID",
			param:recommendSortList
		}));
	},
	
	/**
	 * 发布推荐区海报图片
	 * @param {Object} sqlAdapter
	 * @param {Object} recommendObj,推荐区海报
	 */
	publishPosterOfRecommend:function(sqlAdapter,recommendObj) {
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  recommendation set resourceID=@resourceID,recommendationStatus=@recommendationStatus,lastUpdate=now() where id=@recommendID",
			param:recommendObj
		}));
	},
	
	/**
	 * 删除推荐区海报
	 * @param {Object} sqlAdapter
	 * @param {Object} recommendID，推荐区海报ID
	 */
	deleteRecommend:function(sqlAdapter,recommendID) {
		var status = "D";
		JSON.parse(sqlAdapter.execute({
			sql:"update recommendation set status=@status where id=@recommendID",
			param:{
				status:status,
				recommendID:recommendID
			}
		}));
		
	},
	
	/**
	 * 编辑推荐区海报
	 * @param {Object} sqlAdapter
	 * @param {Object} recommendObj
	 */
	updateRecommend:function(sqlAdapter,recommendObj) {
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  recommendation set recommendName =@recommendName,recommendType=@recommendType,valueID=@valueID,lastUpdate=now() where id=@recommendID ",
			param:recommendObj
		}));
	},
	
	/**
	 * 校验活动或者商品是否在推荐区海报有关联
	 * @param {Object} recommendType，1-商品，2-活动
	 * @param {Object} valueID
	 */
	checkRecommendExits:function(sqlAdapter,recommendType,valueID) {
		var sql = "select count(1) as count from recommendation where status=@status and recommendType=@recommendType and valueID=@valueID ";
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:'N',
				recommendType:recommendType,
				valueID:valueID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var reCount;
		if(JSON.parse(result).length >0) {
			reCount = JSON.parse(result)[0].count;
		}
		return reCount;
	}
	
	
	
	
};

