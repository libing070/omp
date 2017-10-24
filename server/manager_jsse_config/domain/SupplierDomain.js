/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 * 
 */
var SupplierDomain = {	
	
	/**
	 * 查询 供应商信息
	 * @param {Object} supplierID,供应商ID ，如果不传值则查询所有
	 * @return [{supplierID 供应商ID supplierNumber 供应商编码   supplierName 供应商名称 shortName 供应商简称 contactPhone 客服电话 claimPhone 理赔电话  cooperationStartTime 合作开始时间 cooperationEndTime 合作结束时间}]
	 */
	querySupplierList:function(sqlAdapter,supplierID,status) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = "select id as supplierID,supplierNumber,supplierName,shortName,contactPhone,claimPhone,date_format(cooperationStartTime,'%Y-%m-%d') as cooperationStartTime,"
			+"date_format(cooperationEndTime,'%Y-%m-%d') as cooperationEndTime  from supplier where 1=1 ";
		if(supplierID) {
			sql +=' and id=@supplierID';
		}
		if(status) {
			sql +=' and status=@status';
		}
		sql +=" order by createTime desc ";
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				supplierID:supplierID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var supplierList = JSON.parse(result);
		return supplierList;
	},
	
	/**
	 * 校验供应商编码是否已存在
	 * @param {Object} supplierNumber
	 */
	checkSupplierNumber:function(sqlAdapter,supplierID,supplierNumber) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1)as count from supplier where status=@status and supplierNumber=@supplierNumber';
		
		if(supplierID) {
			sql +=' and id !=@supplierID'; //用于 编辑供应商时，排除它自身
		}
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				supplierNumber:supplierNumber,
				supplierID:supplierID
			},
			recordType:"object",
			resultType:"string"
		});
		var numberCount = JSON.parse(retStr)[0].count;
		return numberCount;
		
	},
	
	/**
	 * 校验供应商名称是否已存在
	 * @param {Object} supplierName
	 */
	checkSupplierName:function(sqlAdapter,supplierID,supplierName) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1)as count from supplier where status=@status and supplierName=@supplierName';
		
		if(supplierID) {
			sql +=' and id !=@supplierID'; //用于 编辑供应商时，排除它自身
		}
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				supplierName:supplierName,
				supplierID:supplierID
			},
			recordType:"object",
			resultType:"string"
		});
		var nameCount = JSON.parse(retStr)[0].count;
		return nameCount;
		
	},
	
	/**
	 * 校验供应商简称是否已存在
	 * @param {Object} shortName
	 */
	checkShortName:function(sqlAdapter,supplierID,shortName) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1) as count from supplier where status=@status and shortName=@shortName';
		if(supplierID) {
			sql +=' and id !=@supplierID'; //用于 编辑供应商时，排除它自身
		}
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				supplierID:supplierID,
				shortName:shortName
			},
			recordType:"object",
			resultType:"string"
		});
		var shortNameCount = JSON.parse(retStr)[0].count;
		return shortNameCount;
		
	},
	
	/**
	 * 新增供应商
	 * @param {Object} supplierObj
	 */
	addSupplier:function(sqlAdapter,supplierObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var supplierID = JSON.parse(sqlAdapter.execute({
			sql:"insert into supplier(supplierNumber,supplierName,shortName,contactPhone,claimPhone,"
				+"cooperationStartTime,cooperationEndTime,status,createTime,lastUpdate) values "
				+"(@supplierNumber,@supplierName,@shortName,@contactPhone,@claimPhone,@cooperationStartTime,@cooperationEndTime,@status,now(),now())",
			param:supplierObj,
			returnRowId:true
		}));
		
		return supplierID;
	},
	
	/**
	 * 编辑供应商
	 * @param {Object} supplierObj
	 */
	updateSupplier:function(sqlAdapter,supplierObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  supplier set supplierNumber =@supplierNumber,supplierName =@supplierName,shortName=@shortName,contactPhone=@contactPhone,claimPhone=@claimPhone,cooperationStartTime=@cooperationStartTime,cooperationEndTime=@cooperationEndTime,lastUpdate=now() where id=@supplierID",
			param:supplierObj
		}));
	},
	
	/**
	 * 查询供应商的关联关系，用于判断是否可以删除供应商
	 * @param {Object} supplierID
	 */
	findSupplierRel:function(sqlAdapter,supplierID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1) as count from city_supplier_rel where status=@status and supplierID=@supplierID';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				supplierID:supplierID
			},
			recordType:"object",
			resultType:"string"
		});
		var supRelCount = JSON.parse(retStr)[0].count;
		return supRelCount;
		
	},
	
	/**
	 * 查询支付订单的关联关系，用于判断是否可以删除供应商
	 * @param {Object} supplierID
	 */
	findPayOrderRel:function(sqlAdapter,supplierID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = 'select count(1) as count from payorder where supplierID=@supplierID';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				supplierID:supplierID
			},
			recordType:"object",
			resultType:"string"
		});
		var orderRelCount = JSON.parse(retStr)[0].count;
		return orderRelCount;
		
	},
	
	/**
	 * 查询城市和供应商的关系
	 * @param {Object} sqlAdapter
	 * @param {Object} cityID，城市ID
	 * @param {Object} supplierID，供应商ID
	 */
	findRelOfCitySup:function(sqlAdapter,cityID,supplierID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select id as citySupplierID from city_supplier_rel where status=@status and supplierID=@supplierID and cityID=@cityID';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				supplierID:supplierID,
				cityID:cityID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var citySupplierID;
		if(JSON.parse(retStr).length >0) {
			citySupplierID = JSON.parse(retStr)[0].citySupplierID;
		}
		return citySupplierID;
		
	},
	
	/**
	 * 查询城市供应商是否有其他产品线配置,排除自身
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsTypeCitySupplierRelID，产品与供应商、城市的关系ID
	 * @param {Object} citySupplierID，城市与供应商关系ID
	 */
	checkRelOfCitySup:function(sqlAdapter,goodsTypeCitySupplierRelID,citySupplierID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1) as count from goodstype_city_supplier_rel where status=@status and citySupplierID=@citySupplierID and id!=@goodsTypeCitySupplierRelID';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				citySupplierID:citySupplierID,
				goodsTypeCitySupplierRelID:goodsTypeCitySupplierRelID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var relCount;
		if(JSON.parse(retStr).length >0) {
			relCount = JSON.parse(retStr)[0].count;
		}
		return relCount;
		
	},
	
	/**
	 * 获取城市供应商ID
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsTypeCitySupplierRelID，产品与供应商、城市的关系ID
	 */
	getCitySupplierID:function(sqlAdapter,goodsTypeCitySupplierRelID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select citySupplierID from goodstype_city_supplier_rel where status=@status and id=@goodsTypeCitySupplierRelID';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				goodsTypeCitySupplierRelID:goodsTypeCitySupplierRelID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var citySupplierID;
		if(JSON.parse(retStr).length >0) {
			citySupplierID = JSON.parse(retStr)[0].citySupplierID;
		}
		return citySupplierID;
		
	},
	
	/**
	 * 删除供应商
	 * @param {Object} supplierID
	 */
	delSupplier:function(sqlAdapter,supplierID) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		JSON.parse(sqlAdapter.execute({
			sql:"delete from supplier where id=@supplierID",
			param:{
				supplierID:supplierID
			}
		}));
	},
	
	
	/**
	 * 查询所有产品线下拉列表
	 */
	queryAllGoodsType:function(sqlAdapter) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select id as goodsTypeID,name as goodsTypeName  from goodstype where status=@status';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status
			},
			recordType:"object",
			resultType:"string"
		});
		
		var goodsTypeList = JSON.parse(result);
		return goodsTypeList;
	},
	
	/**
	 * 查询产品与供应商的关系列表
	 * @param {Object} goodsTypeID 产品线ID
	 * @param {Object} cityID  城市ID
	 * @param {Object} supplierID
	 */
	queryRelOfGTypeSup:function(sqlAdapter,goodsTypeID,cityID,supplierID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		
		var sql = "select a.id as goodsTypeCitySupplierRelID,a.citySupplierID,a.goodsTypeID,"
				+" (select name from goodstype where id = a.goodsTypeID)as goodsTypeName,"
				+" b.cityID,(select cityName from city where id = b.cityID) as cityName,"
				+" b.supplierID,(select supplierName from supplier where id = b.supplierID) as supplierName,"
				+" a.quoteMode,a.insuredMode,a.contactName,a.contactPhone,a.share,a.email from goodstype_city_supplier_rel a join city_supplier_rel b "
				+" on a.citySupplierID = b.id  where a.status='N' ";
		
		if(goodsTypeID) {
			sql +=' and a.goodsTypeID=@goodsTypeID';
		}
		if(cityID) {
			sql +=' and b.cityID=@cityID';
		}
		if(supplierID) {
			sql +=' and b.supplierID=@supplierID';
		}
		
		sql +=' order by a.createTime desc ';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				goodsTypeID:goodsTypeID,
				cityID:cityID,
				supplierID:supplierID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var relList = JSON.parse(result);
		return relList;
		
	},
	
	/**
	 * 新增城市和供应商的关系
	 * @param {Object} citySupRelObj
	 */
	addRelOfCitySup:function(sqlAdapter,citySupRelObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var citySupplierID = JSON.parse(sqlAdapter.execute({
			sql:"insert into city_supplier_rel(supplierID,cityID,status,createTime,lastUpdate) values (@supplierID,@cityID,@status,now(),now())",
			param:citySupRelObj,
			returnRowId:true
		}));
		
		return citySupplierID;
	},
	
	/**
	 * 新增产品线和城市供应商的关系
	 * @param {Object} gTypeSupRelObj
	 */
	addRelOfGTypeSup:function(sqlAdapter,gTypeSupRelObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var goodsTypeCitySupplierRelID = JSON.parse(sqlAdapter.execute({
			sql:"insert into goodstype_city_supplier_rel(goodsTypeID,citySupplierID,quoteMode,insuredMode,contactName,contactPhone,email,status,share,createTime,lastUpdate)"
				+" values (@goodsTypeID,@citySupplierID,@quoteMode,@insuredMode,@contactName,@contactPhone,@email,@status,@share,now(),now())",
			param:gTypeSupRelObj,
			returnRowId:true
		}));
		
		return goodsTypeCitySupplierRelID;
	},
	
	/**
	 * 编辑产品线和城市供应商的关系
	 * @param {Object} gTypeSupRelObj
	 */
	updateRelOfGTypeSup:function(sqlAdapter,gTypeSupRelObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update goodstype_city_supplier_rel set contactName =@contactName,quoteMode =@quoteMode,insuredMode =@insuredMode,contactPhone=@contactPhone,"
				+"email=@email,lastUpdate=now() where id=@goodsTypeCitySupplierRelID",
			param:gTypeSupRelObj
		}));
	},
	
	/**
	 * 判断该产品与供应商关系已在“商品管理”中是否有维护
	 * @param {Object} goodsTypeCitySupplierRelID 产品线和城市供应商的关系ID
	 */
	checkRelOfGTypeSup:function(sqlAdapter,goodsTypeCitySupplierRelID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1) as count from goods where status=@status and goodsTypeID=('
					+'select goodsTypeID from goodstype_city_supplier_rel where status=@status and id=@goodsTypeCitySupplierRelID )';
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				goodsTypeCitySupplierRelID:goodsTypeCitySupplierRelID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var relCount = JSON.parse(result)[0].count;
		
		var flag;
		if(relCount >0) {
			flag = 'Y';
		}else {
			flag = 'N';
		}
		return flag;
	},
	
	/**
	 * 删除产品线和城市供应商的关系
	 * @param {Object} goodsTypeCitySupplierRelID 产品线和城市供应商的关系ID
	 */
	delRelOfGTypeSup:function(sqlAdapter,goodsTypeCitySupplierRelID) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		JSON.parse(sqlAdapter.execute({
			sql:"update goodstype_city_supplier_rel set status='D' where id=@goodsTypeCitySupplierRelID",
			param:{
				goodsTypeCitySupplierRelID:goodsTypeCitySupplierRelID
			}
		}));
		
	},
	
	/**
	 * 删除城市供应商的关系ID
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsTypeCitySupplierRelID 产品线和城市供应商的关系ID
	 */
	delRelOfCitySup:function(sqlAdapter,goodsTypeCitySupplierRelID) {
		JSON.parse(sqlAdapter.execute({
			sql:"delete from city_supplier_rel where id=(select citySupplierID from goodstype_city_supplier_rel where id=@goodsTypeCitySupplierRelID)",
			param:{
				goodsTypeCitySupplierRelID:goodsTypeCitySupplierRelID
			}
		}));
	},
	
	/**
	 * 编辑供应商份额
	 * @param {Object} relList
	 */
	editShareOfSupplier:function(sqlAdapter,relList){
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  goodstype_city_supplier_rel set share=@share,lastUpdate=now() where id=@goodsTypeCitySupplierRelID",
			param:relList
		}));
	}
	

};

