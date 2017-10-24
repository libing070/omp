/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 * 
 */
var CityDomain = {	
	
	/**
	 * 查询查询已有的城市列表 
	 * @param {Object} cityID,城市ID ，如果不传值则查询所有
	 * @param {Object} status，城市状态，N-正常
	 * @return [{cityID 城市ID cityName 城市名称 lon 经度 lat 维度 mapCityID 城市在地图中的ID }]
	 */
	queryCityList:function(sqlAdapter,cityID,status) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = 'select id as cityID,cityNumber,cityName,lon,lat,mapCityID,status from city where 1=1 ';
		//如果 cityID 不传，则查询所有
		if(cityID) {
			sql +=' and id = @cityID';
		}
		//如果 cityID 不传，则查询所有
		if(status) {
			sql +=' and status = @status';
		}
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				cityID:cityID
			},
			recordType:"object",
			resultType:"string"
		});
		var cityList = JSON.parse(result);
		return cityList;
		
	},
	
	/**
	 * 校验城市编码是否已存在
	 * @param {Object} cityNumber 城市编码
	 */
	checkCityByNumber:function(sqlAdapter,cityNumber) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1)as count from city where cityNumber=@cityNumber and status=@status';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				cityNumber:cityNumber,
				status:status
			},
			recordType:"object",
			resultType:"string"
		});
		var cityNumberCount = JSON.parse(retStr)[0].count;
		return cityNumberCount;
	},
	
	/**
	 * 校验城市名称是否已存在
	 * @param {Object} cityName 城市名称
	 */
	checkCityByName:function(sqlAdapter,cityName) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1)as count from city where cityName=@cityName and status=@status';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				cityName:cityName,
				status:status
			},
			recordType:"object",
			resultType:"string"
		});
		var cityCount = JSON.parse(retStr)[0].count;
		return cityCount;
		
		
	},
	
	/**
	 * 新增城市
	 * @param {Object} cityObj
	 */
	addCity:function(sqlAdapter,cityObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var cityID = JSON.parse(sqlAdapter.execute({
			sql:"insert into city(cityName,cityNumber,lon,lat,mapCityID,status,createTime,lastUpdate) values (@cityName,@cityNumber,@lon,@lat,@mapCityID,@status,now(),now())",
			param:cityObj,
			returnRowId:true
		}));
		
		return cityID;
	},
	
	/**
	 * 查询城市的关联关系，用于判断是否可以删除城市
	 * @param {Object} cityID
	 */
	findCityRel:function(sqlAdapter,cityID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1) as count from city_supplier_rel where status=@status and cityID=@cityID';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				cityID:cityID,
				status:status
			},
			recordType:"object",
			resultType:"string"
		});
		var cityRelCount = JSON.parse(retStr)[0].count;
		return cityRelCount;
		
	},
	
	/**
	 * 查询用户车辆的关联关系，用于判断是否可以删除城市
	 * @param {Object} cityID
	 */
	findCarRel:function(sqlAdapter,cityID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1) as count from usercar where status=@status and cityID=@cityID';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				cityID:cityID,
				status:status
			},
			recordType:"object",
			resultType:"string"
		});
		var cityRelCount = JSON.parse(retStr)[0].count;
		return cityRelCount;
		
	},
	
	/**
	 * 
	 * @param {cityID 城市ID} cityID
	 */
	delCity:function(sqlAdapter,cityID) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		JSON.parse(sqlAdapter.execute({
			sql:"delete from city where id=@cityID",
			param:{
				cityID:cityID
			}
		}));
	}
	
};

