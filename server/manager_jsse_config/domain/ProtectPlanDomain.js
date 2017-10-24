/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 * 
 */
var ProtectPlanDomain = {	
	
	/**
	 * 查询保障方案列表
	 */
	queryProtectPlanList:function(sqlAdapter) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select id as protectPlanID,protectPlanName from protectplan where status=@status order by createTime desc ';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status
			},
			recordType:"object",
			resultType:"string"
		});
		
		var protectPlanList = JSON.parse(result);
		return protectPlanList;	
	},
	
	/**
	 *  查询平台险别列表
	 */
	queryPlatKindCodeList:function(sqlAdapter) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = "select id as kindID,kindName, kindType,fatherKindID from kind where status=@status and kindType in ('1','2') order by id ";
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				status:status
			},
			recordType:"object",
			resultType:"string"
		});
		
		var platKindCodeList = JSON.parse(result);
		
		//查询各险别的险别保额，下拉选项
		var kindID;
		var subSql;
		var subResult;
		var amountList;
		//最终返回的数组对象
		var returnResultList = new Array();
		var returnResult;
		
		for(var i=0; i < platKindCodeList.length; i++){
			kindID = platKindCodeList[i].kindID;
			
			subSql = 'select amount as amountValue,amountShow from kindamount where kindID=@kindID';
			
			subResult = sqlAdapter.query({
				sql: subSql,
				param: {
					kindID:kindID
				},
				recordType:"object",
				resultType:"string"
			});
		
			amountList = JSON.parse(subResult);
			
			returnResult = {
				kindID:platKindCodeList[i].kindID,				//平台险别ID
				kindName:platKindCodeList[i].kindName,			//险别名称
				kindType:platKindCodeList[i].kindType,			//主险/附加险标志
				fatherKindID:platKindCodeList[i].fatherKindID,	//父节点险别ID
				amountList:amountList		//险别保额列表
			};
			
			returnResultList.push(returnResult);
			
		}
		return returnResultList;	
	},
	
	/**
	 * 查询保障方案详情
	 * @param {Object} protectPlanID 保障方案ID
	 */
	queryProtectPlanDetail:function(sqlAdapter,protectPlanID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = 'select kindID,(select kindName from kind where id = protectplandetail.kindID) as kindName,'
				+' mainFlag, amount as amountValue,(select amountShow from kindamount  where kindamount.kindID = protectplandetail.kindID and kindamount.amount=protectplandetail.amount ) as amountShow, '
				+'mainFlag, isFree from protectplandetail where protectPlanID=@protectPlanID order by kindID ';
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				protectPlanID:protectPlanID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var detailList = JSON.parse(result);
		return detailList;
	},
	
	/**
	 * 校验保障方案名称是否已经存在
	 * @param {Object} protectPlanID， 保障方案ID
	 * @param {Object} protectPlanName，保障方案名称
	 */
	checkProtectPlanDetail:function(sqlAdapter,protectPlanID,protectPlanName) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = 'select count(1)as count from protectplan where status=@status and protectPlanName=@protectPlanName ';
		if(protectPlanID) {
			sql +=' and id !=@protectPlanID'; //用于 编辑保障方案时，排除它自身
		}
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				status:'N',
				protectPlanID:protectPlanID,
				protectPlanName:protectPlanName
			},
			recordType:"object",
			resultType:"string"
		});
		var nameCount = JSON.parse(retStr)[0].count;
		return nameCount;
	},
	
	/**
	 * 新增保障方案(主表)
	 * @param {Object} protectPlanObj
	 */
	addProtectPlan:function(sqlAdapter,protectPlanObj){
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var protectPlanID = JSON.parse(sqlAdapter.execute({
			sql:"insert into protectplan(protectPlanName,status,createTime,lastUpdate) values (@protectPlanName,@status,now(),now())",
			param:protectPlanObj,
			returnRowId:true
		}));
		
		return protectPlanID;
	},
	
	
	/**
	 * 新增保障方案详情
	 * @param {Object} protectPlanDetailList
	 */
	addProtectPlanDetail:function(sqlAdapter,protectDetailList) {
		
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var citySupplierID = JSON.parse(sqlAdapter.execute({
			sql:"insert into protectplandetail(protectPlanID,kindID,amount,mainFlag,isFree,createTime,lastUpdate) values (@protectPlanID,@kindID,@amount,@mainFlag,@isFree,now(),now())",
			param:protectDetailList
		}));
		
	},
	
	
	/**
	 * 修改保障方案(主表)
	 * @param {Object} protectPlanObj
	 */
	updateProtectPlan:function(sqlAdapter,protectPlanObj) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  protectplan set protectPlanName=@protectPlanName,lastUpdate=now() where id=@protectPlanID",
			param:protectPlanObj
		}));
	},
	
	
	/**
	 * 删除保障方案主表
	 * @param {Object} protectPlanID
	 */
	delProtectPlan:function(sqlAdapter,protectPlanID) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:"update  protectplan set status=@status where id=@protectPlanID ",
			param:{
				protectPlanID:protectPlanID,
				status:"D"
			}
		}));
	},
	
	/**
	 * 删除保障方案详情
	 * @param {Object} protectPlanID,保障方案ID
	 */
	delProtectPlanDetail:function(sqlAdapter,protectPlanID) {
//		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id = JSON.parse(sqlAdapter.execute({
			sql:"delete from protectplandetail where protectPlanID=@protectPlanID ",
			param:{
				protectPlanID:protectPlanID,
				status:"D"
			}
		}));
	},
	
	
	/**
	 * 判断该保障方案是否在“商品管理”中有维护，如果有，则不允许删除
	 * @param {Object} protectPlanID,保障方案ID
	 */
	checkProtectPlanForGoods:function(sqlAdapter,protectPlanID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var status = 'N';
		var sql = 'select count(1) as count from goods where status=@status and protectPlanID=@protectPlanID ';
		var retStr = sqlAdapter.query({
			sql: sql,
			param: {
				status:status,
				protectPlanID:protectPlanID
			},
			recordType:"object",
			resultType:"string"
		})
		;
		var goodsCount = JSON.parse(retStr)[0].count;
		return goodsCount;
	},
	
	/**
	 * 获取不计免赔信息
	 * @param {Object} sqlAdapter
	 * @param {Object} fatherKindID
	 */
	getfatherKind:function(sqlAdapter,fatherKindID) {
//		var sqlAdapter=sqlAdpterHandler.getInstance(false);
		var sql = "select id as kindID,kindName,kindType as mainFlag from kind where status='N' and fatherKindID=@fatherKindID ";
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				fatherKindID:fatherKindID
			},
			recordType:"object",
			resultType:"string"
		});
		var fatherKind = null;
		if(JSON.parse(result).length >0 ) {
			fatherKind = JSON.parse(result)[0];
		}
		
		return fatherKind;
	}
};

