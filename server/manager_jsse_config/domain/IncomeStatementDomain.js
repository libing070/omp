/**
 * 收支明细领域对象
 */
var IncomeStatementDomain = {
	/**
	 * 描述：新增收支明细
	 * @param
	 * @return 
	 */
	addIncomeStatement : function(sqlExecute, incomeStatement){
//		var sqlExecute = sqlAdpterHandler.getInstance(true);
		//新增收支明细
		var incomeStatementID = sqlExecute.execute({
			sql:"insert into incomestatement(payOrderID,goodsOrderID,policyID,policyNO,amount,operType,subject,resourceType,resourceValue,payDate,supplierID,goodsTypeCitySupplierRelID,cityID,cityName,createTime,lastUpdate) "
				+"values(@payOrderID,@goodsOrderID,@policyID,@policyNo,@amount,@operType,@subject,@resourceType,@resourceValue,now(),@supplierID,@goodsTypeCitySupplierRelID,@cityID,@cityName,now(),now())",
			param : incomeStatement,
			returnRowId : true
		});
		return incomeStatementID;
	},
	
	
	/**
	 * 描述：收支明细总数
	 * @param
	 * @return 
	 */
	getIncomeStatementCount : function(sqlExecute, supplierID, cityID, operType, subject, createTimeStart, createTimeEnd, policyCustomerNo, resourceType){
		var sql = "select count(1)as count from ("
				  +"select a.id,a.id as incomeStatementID,a.payOrderID,a.goodsOrderID,a.policyID,a.endorseNO,a.amount,a.operType,"
				  +"a.subject,a.resourceType,a.resourceValue,a.supplierID,a.goodsTypeCitySupplierRelID,a.cityID,a.cityName,"
				  +"date_format(a.payDate, '%Y-%m-%d')as payDate,b.policyCustomerNo,b.policyNO,"
				  +"(select shortName from supplier where id=a.supplierID)as supplierShortName,"
				  +"IFNULL(date_format(b.correctEffectiveDate, '%Y-%m-%d'), date_format(b.startDate, '%Y-%m-%d'))as startDate "
				  +"from incomestatement a,policy b where a.policyID=b.id"
				  +") t where 1=1 "
				  + (supplierID ? "and t.supplierID=@supplierID " : "")
				  + (cityID ? "and t.cityID=@cityID " : "")
				  + (operType ? "and t.operType = @operType " : "")
				  + (subject ? "and t.subject in ('"+subject+"') " : "")
				  + (createTimeStart ? "and t.startDate >= str_to_date(@createTimeStart, '%Y-%m-%d') " : "")
				  + (createTimeEnd ? "and t.startDate <= str_to_date(@createTimeEnd, '%Y-%m-%d') " : "")
				  + (policyCustomerNo ? "and t.policyCustomerNo like @policyCustomerNo " : "")
				  + (resourceType ? "and t.resourceType = @resourceType " : "");
		logger.debug("收支明细总数SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierID : supplierID,
				cityID : cityID,
				operType : operType,
				createTimeStart : createTimeStart,
				createTimeEnd : createTimeEnd,
				policyCustomerNo : '%'+policyCustomerNo+'%',
				resourceType : resourceType,
			},
			recordType:"object",
			resultType:"string"
		});
		var incomeStatementCount = JSON.parse(retStr)[0].count;
		return incomeStatementCount;
	},
	
	/**
	 * 描述：查询收支明细列表
	 * @param
	 * @return 
	 */
	listIncomeStatement : function(sqlExecute, supplierID, cityID, operType, subject, createTimeStart, createTimeEnd, policyCustomerNo, resourceType, sortFieldName, sortDir, pageNumber, pageSize){
		var sql = "select * from ("
				  +"select a.id,a.id as incomeStatementID,a.payOrderID,a.goodsOrderID,a.policyID,a.endorseNO,a.amount,a.operType,"
				  +"a.subject,a.resourceType,a.resourceValue,a.supplierID,a.goodsTypeCitySupplierRelID,a.cityID,a.cityName,"
				  +"date_format(a.payDate, '%Y-%m-%d')as payDate,b.policyCustomerNo,b.policyNO,"
				  +"(select shortName from supplier where id=a.supplierID)as supplierShortName,"
				  +"IFNULL(date_format(b.correctEffectiveDate, '%Y-%m-%d'), date_format(b.startDate, '%Y-%m-%d'))as startDate "
				  +"from incomestatement a,policy b where a.policyID=b.id"
				  +") t where 1=1 "
				  + (supplierID ? "and t.supplierID=@supplierID " : "")
				  + (cityID ? "and t.cityID=@cityID " : "")
				  + (operType ? "and t.operType = @operType " : "")
				  + (subject ? "and t.subject in ('"+subject+"') " : "")
				  + (createTimeStart ? "and t.startDate >= str_to_date(@createTimeStart, '%Y-%m-%d') " : "")
				  + (createTimeEnd ? "and t.startDate <= str_to_date(@createTimeEnd, '%Y-%m-%d') " : "")
				  + (policyCustomerNo ? "and t.policyCustomerNo like @policyCustomerNo " : "")
				  + (resourceType ? "and t.resourceType = @resourceType " : "")
				  + (sortFieldName=='startDate' ? " order by t.startDate "+sortDir+",incomeStatementID "+sortDir: "")
				  +" limit "+(pageNumber-1)*pageSize+","+pageSize;
		logger.debug("查询服务费结算SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierID : supplierID,
				cityID : cityID,
				operType : operType,
				createTimeStart : createTimeStart,
				createTimeEnd : createTimeEnd,
				policyCustomerNo : '%'+policyCustomerNo+'%',
				resourceType : resourceType
			},
			recordType:"object",
			resultType:"string"
		});
		var incomeStatementList = JSON.parse(retStr);
		return incomeStatementList;
	},
	
	
	
	/**
	 * 描述：getPaymentDetailCount
	 * @param
	 * @return 
	 */
	getPaymentDetailCount : function(sqlExecute, supplierID, cityID, operType, subject, resourceType, startDateStart, startDateEnd, goodsOrderNo,policyCustomerNo){
		logger.debug("--------policyCustomerNo---------：" + policyCustomerNo);
		var sql = "select count(1)as count from ("
				  +"select a.id,a.id as incomeStatementID,a.payOrderID,a.goodsOrderID,a.policyID,a.endorseNO,a.amount,a.operType,"
				  +"a.subject,a.resourceType,a.resourceValue,a.supplierID,a.goodsTypeCitySupplierRelID,a.cityID,a.cityName,"
				  +"date_format(a.payDate, '%Y-%m-%d')as payDate,b.policyCustomerNo,b.policyNO,c.goodsOrderCustomerNumber as goodsOrderNo,"
				  +"(select shortName from supplier where id=a.supplierID)as supplierShortName,"
				  +"IFNULL(date_format(b.startDate, '%Y-%m-%d'), date_format(b.correctEffectiveDate, '%Y-%m-%d'))as startDate "
				  +"from incomestatement a left join policy b on a.policyID=b.id left join goodsorder c on b.id=c.policyID "
				  +") t where 1=1 "
				  + (supplierID ? "and t.supplierID=@supplierID " : "")
				  + (cityID ? "and t.cityID=@cityID " : "")
				  + (operType ? "and t.operType = @operType " : "")
				  + (subject ? "and t.subject in ('"+subject+"') " : "")
				  + (resourceType ? "and t.resourceType = @resourceType " : "")
				  + (startDateStart ? "and t.startDate >= str_to_date(@startDateStart, '%Y-%m-%d') " : "")
				  + (startDateEnd ? "and t.startDate <= str_to_date(@startDateEnd, '%Y-%m-%d') " : "")
				  + (goodsOrderNo ? "and t.goodsOrderNo like @goodsOrderNo " : "")
				  + (policyCustomerNo ? "and t.policyCustomerNo like @policyCustomerNo " : "");
		logger.debug("getPaymentDetailCount SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierID : supplierID,
				cityID : cityID,
				operType : operType,
				startDateStart : startDateStart,
				startDateEnd : startDateEnd,
				goodsOrderNo : '%'+goodsOrderNo+'%',
				policyCustomerNo : '%'+policyCustomerNo+'%',
				resourceType : resourceType
			},
			recordType:"object",
			resultType:"string"
		});
		var paymentDetailCount = JSON.parse(retStr)[0].count;
		return paymentDetailCount;
	},
	
	/**
	 * 描述：listPaymentDetail
	 * @param
	 * @return 
	 */
	listPaymentDetail : function(sqlExecute, supplierID, cityID, operType, subject, resourceType, startDateStart, startDateEnd, goodsOrderNo, sortFieldName, sortDir,policyCustomerNo,pageNumber, pageSize){
		var sql = "select * from ("
				  +"select a.id,a.id as incomeStatementID,a.payOrderID,a.goodsOrderID,a.policyID,a.endorseNO,a.amount,a.operType,"
				  +"a.subject,a.resourceType,a.resourceValue,a.supplierID,a.goodsTypeCitySupplierRelID,a.cityID,a.cityName,"
				  +"date_format(a.payDate, '%Y-%m-%d')as payDate,b.policyCustomerNo,b.policyNO,c.goodsOrderCustomerNumber as goodsOrderNo,"
				  +"(select shortName from supplier where id=a.supplierID)as supplierShortName,"
				  +"IFNULL(date_format(b.startDate, '%Y-%m-%d'), date_format(b.correctEffectiveDate, '%Y-%m-%d'))as startDate "
				  +"from incomestatement a left join policy b on a.policyID=b.id left join goodsorder c on b.id=c.policyID "
				  +") t where 1=1 "
				  + (supplierID ? "and t.supplierID=@supplierID " : "")
				  + (cityID ? "and t.cityID=@cityID " : "")
				  + (operType ? "and t.operType = @operType " : "")
				  + (subject ? "and t.subject in ('"+subject+"') " : "")
				  + (resourceType ? "and t.resourceType = @resourceType " : "")
				  + (startDateStart ? "and t.startDate >= str_to_date(@startDateStart, '%Y-%m-%d') " : "")
				  + (startDateEnd ? "and t.startDate <= str_to_date(@startDateEnd, '%Y-%m-%d') " : "")
				  + (goodsOrderNo ? "and t.goodsOrderNo like @goodsOrderNo " : "")
				  + (policyCustomerNo ? "and t.policyCustomerNo like @policyCustomerNo " : "")
				  + (sortFieldName=='payDate' ? " order by t.payDate "+sortDir+",incomeStatementID "+sortDir: "")
				  +" limit "+(pageNumber-1)*pageSize+","+pageSize;
		logger.debug("listPaymentDetail SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierID : supplierID,
				cityID : cityID,
				operType : operType,
				startDateStart : startDateStart,
				startDateEnd : startDateEnd,
				goodsOrderNo : '%'+goodsOrderNo+'%',
				policyCustomerNo : '%'+policyCustomerNo+'%',
				resourceType : resourceType
			},
			recordType:"object",
			resultType:"string"
		});
		var paymentDetailList = JSON.parse(retStr);
		return paymentDetailList;
	},
	
	
	
	/**
	 * 描述：提交事务，释放连接
	 * @param
	 * @return 
	 */
	commitAndClose : function(){
		sqlAdpterHandler.commitAndClose();
	},
	
	/**
	 * 描述：回滚事务，释放连接
	 * @param
	 * @return 
	 */
	rollbackAndClose : function(){
		sqlAdpterHandler.rollbackAndClose();
	}
};