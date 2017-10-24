/**
 * 报价单管理
 */
var QuotationDomain = {
		/**
	 * 描述：根据报价单ID查询报价单详情
	 * @param
	 * @return 
	 */
	QuotationByQuotationID : function(sqlExecute, quotationID){
		var retStr = sqlExecute.query({
			sql : "select q.id as quotationID,q.quotationCustomerNumber,q.goodsTypeID,(select g.name from goodstype g where g.id=q.goodsTypeID) as goodsTypeName,"
				  +"q.cityID,(select c.cityName from city c where c.id=q.cityID) as cityName,supplierID,(select s.supplierName from supplier s"
				  +" where s.id=q.supplierID) as supplierName,(select s.shortName from supplier s where s.id=q.supplierID) as supplierShortName,"
				  +"goodsID,(select gs.goodsName from goods gs where gs.id=q.goodsID) as goodsName,ifnull(date_format(q.jqxStartDate,'%Y-%m-%d'),'') as jqxStartDate,"
				  +"ifnull(date_format(q.jqxEndDate,'%Y-%m-%d'),'') as jqxEndDate,ifnull(q.amount,'0') as amount,ifnull(date_format(q.jqxLastYearEndDate,'%Y-%m-%d'),'') as jqxLastYearEndDate,"
				  +"ifnull(q.businessInsurance,'') as businessInsurance,ifnull(q.trafficInsurance,'') as trafficInsurance,"
				  +"ifnull(date_format(q.syxStartDate,'%Y-%m-%d'),'') as syxStartDate,ifnull(date_format(q.syxEndDate,'%Y-%m-%d'),'') as syxEndDate,"
				  +"q.carID,q.userID,q.carLicenseNO,q.isValid,q.quotationStatus,q.failDescription,"
				  +"q.carOwner,q.ownerCardID,q.insuredName,q.insuredCardID,q.carOwnerPhoneNO as phoneNO  from quotation q where q.id=@quotationID",
			param : {
				quotationID : quotationID
			},
			recordType:"object",
			resultType:"string"
		});
		var quotationList = JSON.parse(retStr)[0];
		return quotationList;
	},
	
	/**
	 * 根据 carID 和 goodsID 查询最大的报价单号 
	 * @param {Object} sqlExecute
	 * @param {Object} carID
	 * @param {Object} goodsID
	 */
	getMaxQuotationID : function(sqlExecute, carID, goodsID){
		var retStr = sqlExecute.query({
			sql : "select max(q.id) as quotationID from quotation q where q.quoteMode='1' and q.carID=@carID and q.goodsID=@goodsID",
			param : {
				carID : carID,
				goodsID : goodsID
			},
			recordType:"object",
			resultType:"string"
		});
		var maxQuotationID = JSON.parse(retStr)[0].quotationID;
		return maxQuotationID;
	},
	
	/**
	 * 
	 * @param {Object} sqlExecute
	 * @param {Object} quotationID
	 */
	getLockOwnerByQuotationID:function(sqlExecute, quotationID){
		var retStr = sqlExecute.query({
			sql : "select lockOwner from quotation  where id=@quotationID",
			param : {
				quotationID : quotationID
			},
			recordType:"object",
			resultType:"string"
		});
		var lockOwner = JSON.parse(retStr)[0].lockOwner;
		return lockOwner;
	},
	
	/**
	 * 根据车辆id查询车辆跟用户信息
	 * @param {Object} sqlExecute
	 * @param {Object} carID
	 */
	FindCarAndCarOwnerInfo : function(sqlExecute,carID){
		var retStr = sqlExecute.query({
			sql: "select distinct u.id,u.userID,u.carOwner,u.carOwnerPhoneNumber as phoneNO,u.ownerCardID,u.insuredName,"
				 +"u.insuredCardID,u.brandName,u.exhaustscaleID,u.exhaustscale,u.carLicense,u.frameNO,u.engineNO,u.enrollDate,"
				 +"u.modelCode,modelCName,u.familyCode,u.familyName,uni.seatCount "
				 +"from usercar u left join usercarinfobyquery uni on uni.userCarID=u.id where u.id=@carID",
			param:{
				carID : carID
			},
			recordType:"object",
			resultType:"string"
		});
		var carAndCarOwner = JSON.parse(retStr)[0];
		return carAndCarOwner;
	},
	/**
	 * 查询保障计划
	 * @param {Object} sqlExecute
	 * @param {Object} protectPlanID
	 */
	queryProtectPlanDetail:function(sqlExecute,quotationID) {
		var sql = 'select protectionPlan from quotation where id=@quotationID';
		
		var result = sqlExecute.query({
			sql: sql,
			param: {
				quotationID:quotationID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var detailList = JSON.parse(result)[0];
		return detailList;
	},
	/**
	 * 更新锁定OWNER、锁定状态变
	 * @param {Object} sqlExecute
	 * @param {Object} lockObj
	 */
	updateLock:function(sqlExecute,lockObj) {
		var id = JSON.parse(sqlExecute.execute({
			sql:"update quotation set lockStatus=@lockStatus,lockOwner=@lockOwner,lastUpdate=now() where id=@quotationID",
			param:lockObj
		}));
	},
	/**
	 * 更新交强险中的上年终保日期
	 * @param {Object} sqlExecute
	 * @param {Object} quotationID
	 * @param {Object} jqxLastYearEndDate
	 */
	updateLastYearEndDate:function(sqlExecute,quotationID,jqxLastYearEndDate) {
		var jqxStartDate = new Date(new Date(jqxLastYearEndDate.replace(/-/g, "/")).getTime() + 24 * 60 * 60 * 1000).Format("yyyy-MM-dd");
		var jqxEndDate = new Date(new Date(jqxLastYearEndDate.replace(/-/g, "/")).getTime() + 365 * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd");
		var id = JSON.parse(sqlExecute.execute({
			sql:"update quotation set jqxLastYearEndDate=@jqxLastYearEndDate,jqxStartDate=@jqxStartDate,jqxEndDate=@jqxEndDate,lastUpdate=now() where id=@quotationID",
			param:{
				quotationID:quotationID,
				jqxLastYearEndDate:jqxLastYearEndDate,
				jqxStartDate:jqxStartDate,
				jqxEndDate:jqxEndDate
			}
		}));
	},
	/**
	 * 	编辑报价单
	 * @param {Object} sqlExecute
	 * @param {Object} quotationObj
	 */
	editQuotation : function(sqlExecute,quotationObj){
		var sql = "update quotation set quotationStatus =@quotationStatus,failDescription =@failDescription,businessInsurance=@businessInsurance,"
				 +"trafficInsurance=@trafficInsurance,protectionPlan=@protectionPlan,jqxProposalNO=@jqxProposalNO,syxProposalNO=@syxProposalNO,amount=@amount,isValid=@isValid,lastUpdate=now()"
				 +(quotationObj.timeExpire ? ",timeExpire=@timeExpire" : "")
				 +" where id=@quotationID";
		
		var id = JSON.parse(sqlExecute.execute({
			sql:sql,
			param:quotationObj
		}));
	},
	/**
	 * 查询报价单的数量
	 */
	getQuotationCount:function(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo){
		logger.info("me:"+me);
		logger.info("he:"+he);
		logger.info("non:"+non);
		var sql="select count(*) as count from quotation where quoteMode=1 "
		+(supplierID?"and supplierID=@supplierID ":"")
		+(cityID?"and cityID=@cityID ":"")
		+(goodsTypeID?"and goodsTypeID=@goodsTypeID ":"")
//		+(goodsID?"and goodsID=@goodsID ":"")
//		+(quoteMode?"and quoteMode=@quoteMode ":"")
		+(lockStatus?"and lockStatus=@lockStatus ":"")
		+(quotationStatus?"and quotationStatus=@quotationStatus ":"")
		+(carOwner?"and carOwner like @carOwner ":"")
		+(phoneNo?"and carOwnerphoneNO like @phoneNo ":"") 
		+"and ("
		+(me?"lockStatus=2 and lockOwner=@lockOwner or ":"")
		+(he?"lockStatus=2 and lockOwner!=@lockOwner or ":"")
		+(non?"lockStatus=1 or ":"")
		+"1!=1)";
		logger.debug('=====询价单查询总数的sql======'+sql);
		var result=sqlExecute.query({
			sql:sql,
			param:{
				supplierID:supplierID,
				cityID:cityID,
				goodsTypeID:goodsTypeID,
				quoteMode:quoteMode,
				lockStatus:lockStatus,
				quotationStatus:quotationStatus,
				lockOwner:lockOwner,
				carOwner:'%'+carOwner+'%',
				phoneNo:'%'+phoneNo+'%'
			},
			recordType:"object",
			resultType:"string"
		});
		var count=JSON.parse(result)[0].count;
		return count;
	},
	/**
	 * 查询报价单列表
	 */
	listQuotation:function(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo,sortFieldName,sortDir,pageNumber,pageSize){
		//TODO
		logger.info(lockOwner);
		var sql='select id as quotationID,quotationCustomerNumber,goodsTypeID,(select name from goodstype where goodstype.id=quotation.goodsTypeID) as goodsTypeName,'
		+'cityID,(select cityName from city where city.id=quotation.cityID) as cityName,'
		+'supplierID,(select supplierName from supplier where supplier.id=quotation.supplierID) as supplierName,(select shortName from supplier where supplier.id=quotation.supplierID) as shortName,'
		+'goodsID,(select goodsName from goods where goods.id=quotation.goodsID) as goodsName,'
		+"lockStatus,quotationStatus,lockOwner,carOwner,carOwnerPhoneNO as phoneNO,date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
		+"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate,amount"
		+" from quotation where quoteMode=1 "
		+(supplierID?"and supplierID=@supplierID ":"")
		+(cityID?"and cityID=@cityID ":"")
		+(goodsTypeID?"and goodsTypeID=@goodsTypeID ":"")
//		+(quoteMode?"and quoteMode=@quoteMode ":"")
		+(lockStatus?"and lockStatus=@lockStatus ":"")
		+(quotationStatus?"and quotationStatus=@quotationStatus ":"")
		+(carOwner?"and carOwner like @carOwner ":"")
		+(phoneNo?"and carOwnerphoneNO like @phoneNo ":"")
		+"and ("
		+(me?"lockStatus=2 and lockOwner=@lockOwner or ":"")
		+(he?"lockStatus=2 and lockOwner!=@lockOwner or ":"")
		+(non?"lockStatus=1 or ":"")
		+"1!=1)"
		+(sortFieldName=='createTime'?"order by createTime "+sortDir:"")
		+" limit "+(pageNumber-1)*pageSize+","+pageSize;
		logger.debug('=====询价单查询列表的sql======'+sql);
		var result=sqlExecute.query({
			sql:sql,
			param:{
				supplierID:supplierID,
				cityID:cityID,
				goodsTypeID:goodsTypeID,
				quoteMode:quoteMode,
				lockStatus:lockStatus,
				quotationStatus:quotationStatus,
				lockOwner:lockOwner,
				carOwner:'%'+carOwner+'%',
				phoneNo:'%'+phoneNo+'%'
			},
			recordType:"object",
			resultType:"string"
		});
		var list=JSON.parse(result);
		return list;
	}
};