/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 * 
 */
var SystemDomain = {
	
	/**
	 * 查询产品线列表
	 * @param {Object} sqlAdapter
	 */
	queryGoodsTypeList:function(sqlAdapter) {
		
 		var sql = 'select a.id as goodsTypeID,a.name as goodsTypeName,a.resourceID as resourcesID,b.httpUrl as resourcesUrl, '
		+'b.groupName,b.remoteFileName,b.maxWidth,b.maxHeight,b.maxSize from goodstype a left join resources b on a.resourceID = b.id where a.status=@status  order by a.id';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:'N'
			},
			recordType:"object",
			resultType:"string"
		});
		
		var goodsTypeList = JSON.parse(result);
		return goodsTypeList;
	},
	
	/**
	 * 查询产品海报图片资源ID
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsTypeID
	 */
	queryImageOfGoodsType:function(sqlAdapter,goodsTypeID) {
		var sql = "select resourceID from goodstype where status=@status and id=@goodsTypeID ";
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:'N',
				goodsTypeID:goodsTypeID
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
	 * 发布产品线海报图片
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsTypeObj,产品线
	 */
	publishPosterOfGoodsType:function(sqlAdapter,goodsTypeObj) {
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  goodstype set resourceID=@resourceID,lastUpdate=now() where id=@goodsTypeID",
			param:goodsTypeObj
		}));
	},
	
	/**
	 * 编辑平台属性
	 * @param {Object} sqlAdapter
	 * @param {Object} platConfigObj
	 */
	updatePlatConfig:function(sqlAdapter,platConfigObj) {
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  platconfig set serviceHotline=@serviceHotline,address=@address,postcode=@postcode,receiver=@receiver,phone=@phone,serviceTimePrompt=@serviceTimePrompt,lastUpdate=now() where id=@platConfigID ",
			param:platConfigObj
		}));
	},
	
	/**
	 * 查询平台属性
	 * @param {Object} sqlAdapter
	 */
	queryPlatConfig:function(sqlAdapter) {
		var sql = 'select id as platConfigID,serviceHotline,address,postcode,receiver,phone,serviceTimePrompt from platconfig ';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:'N'
			},
			recordType:"object",
			resultType:"string"
		});
		
		var platConfig = JSON.parse(result)[0];
		return platConfig;
	},
	
	/**
	 * 获取产品线名称
	 * @param {Object} sqlAdapter
	 * @param {Object} goodsTypeID 产品线ID
	 */
	getGoodsTypeName:function(sqlAdapter,goodsTypeID) {
		var sql = 'select name as goodsTypeName from goodstype where id=@goodsTypeID';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				goodsTypeID:goodsTypeID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var goodsTypeName;
		if(JSON.parse(result).length >0 ) {
			goodsTypeName = JSON.parse(result)[0].goodsTypeName;
		}
		return goodsTypeName;
	},
	
	/**
	 * 查询代码定义
	 * @param {Object} sqlAdapter
	 * @param {Object} codeType
	 */
	queryBaseCode:function(sqlAdapter,codeType) {
		var sql = 'select codeValue,codeName from basecode where codetype=@codetype and validStatus=@validStatus';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				codetype:codeType,
				validStatus:"1"
			},
			recordType:"object",
			resultType:"string"
		});
		
		var codeTypeList = JSON.parse(result);
		return codeTypeList;
	},
	
	/**
	 * 查询代码定义名称
	 * @param {Object} sqlAdapter
	 * @param {Object} codeType
	 * @param {Object} codeValue
	 */
	queryBaseCodeName:function(sqlAdapter,codeType,codeValue) {
		var sql = 'select codeName from basecode where codetype=@codetype and codeValue=@codeValue and validStatus=@validStatus';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				codetype:codeType,
				codeValue:codeValue,
				validStatus:"1"
			},
			recordType:"object",
			resultType:"string"
		});
		
		var codeName ;
		if(JSON.parse(result).length>0) {
			codeName = JSON.parse(result)[0].codeName;
		}
		
		return codeName;
	}
	
	
	
};

