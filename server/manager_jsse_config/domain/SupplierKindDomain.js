/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 * 
 */
var SupplierKindDomain = {	
	
	/**
	 * 查询平台险别下拉列表（所有的平台险别）
	 */
	queryAllKind:function(sqlAdapter) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select id as kindID,kindName from kind where status=@status ';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status
			},
			recordType:"object",
			resultType:"string"
		});
		
		var kindList = JSON.parse(result);
		return kindList;
	},
	
	/**
	 * 查询供应商险别代码
	 * @param {Object} supplierID
	 */
	querySupplierKind:function(sqlAdapter,supplierID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select a.id as supplierKindID,a.supplierID,a.kindID,b.kindNumber,b.kindName,a.supplierKindCode '
		+'from supplier_kind_rel a join kind b on a.kindID = b.id where a.status=@status and a.supplierID=@supplierID';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				supplierID:supplierID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var kindList = JSON.parse(result);
		return kindList;
	},
	/**
	 * 校验此供应商下的平台险种代码是否重复，如果重复，不允许新增
	 * @param {Object 供应商ID} supplierID
	 * @param {Object 平台险别代码} kindID
	 */
	checkSupplierKindID:function(sqlAdapter,supplierID,kindID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1) as count from supplier_kind_rel where status=@status and supplierID=@supplierID and kindID=@kindID';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				supplierID:supplierID,
				kindID:kindID
			},
			recordType:"object",
			resultType:"string"
		})
		;
		var kindIDCount = JSON.parse(retStr)[0].count;
		return kindIDCount;
	},
	
	/**
	 * 校验供应商险别代码是否存在，如果存在重复，不允许新增
	 * @param {Object 供应商ID} supplierID
	 * @param {Object 供应商险别代码} supplierKindCode
	 *  @param {Object 供应商险别代码ID} supplierKindID
	 */
	checkSupplierKindCode:function(sqlAdapter,supplierID,supplierKindCode,supplierKindID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1) as count from supplier_kind_rel where status=@status and supplierID=@supplierID and supplierKindCode=@supplierKindCode ';
		
		if(supplierKindID) {//用于编辑时，排除自身重复
			sql +=" and id!=@supplierKindID";
		}
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				supplierID:supplierID,
				supplierKindCode:supplierKindCode,
				supplierKindID:supplierKindID
			},
			recordType:"object",
			resultType:"string"
		})
		;
		var kindCodeCount = JSON.parse(retStr)[0].count;
		return kindCodeCount;
	},
	
	/**
	 * 新增供应商险别代码
	 * @param {Object} supplierKindObj
	 */
	addSupplierKind:function(sqlAdapter,supplierKindObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var supplierKindID = JSON.parse(sqlAdapter.execute({
			sql:"insert into supplier_kind_rel (supplierID,kindID,supplierKindCode,status,createTime,lastUpdate) values (@supplierID,@kindID,@supplierKindCode,@status,now(),now())",
			param:supplierKindObj,
			returnRowId:true
		}));
		
		return supplierKindID;
	},
	
	/**
	 * 编辑供应商险别代码
	 * @param {Object} supplierKindObj
	 */
	updateSupplierKind:function(sqlAdapter,supplierKindObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  supplier_kind_rel set supplierKindCode =@supplierKindCode,lastUpdate=now() where id=@supplierKindID",
			param:supplierKindObj
		}));
	},
	
	/**
	 * 删除供应商险别代码
	 * @param {Object} supplierKindID 供应商险别ID
	 */
	delSupplierKind:function(sqlAdapter,supplierKindID) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		JSON.parse(sqlAdapter.execute({
			sql:"delete from supplier_kind_rel  where id=@supplierKindID",
			param:{
				supplierKindID:supplierKindID
			}
		}));
	}
	
};

