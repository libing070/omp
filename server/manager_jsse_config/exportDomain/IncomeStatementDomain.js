/**
 * 收支明细领域对象
 */
var IncomeStatementDomain = {
	/**
	 * 描述：查询收支明细列表
	 * @param
	 * @return 
	 */
	listIncomeStatement : function(sqlExecute, supplierID, cityID, operType, subject, createTimeStart, createTimeEnd, policyCustomerNo, resourceType, sortFieldName, sortDir){
		var sql = "select * from ("
				  +"select a.id,a.id as incomeStatementID,a.payOrderID,a.goodsOrderID,a.policyID,a.endorseNO,b.carLicenseNO,a.amount,a.operType,"
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
				  + (sortFieldName=='startDate' ? " order by t.startDate "+sortDir : "");
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
	 * 描述：listPaymentDetail
	 * @param
	 * @return 
	 */
	listPaymentDetail : function(sqlExecute, supplierID, cityID, operType, subject, resourceType, startDateStart, startDateEnd, goodsOrderNo, sortFieldName, sortDir,policyCustomerNo){
		var sql = "select * from ("
				  +"select a.id,a.id as incomeStatementID,a.payOrderID,a.goodsOrderID,a.policyID,a.endorseNO,a.amount,a.operType,"
				  +"a.subject,a.resourceType,a.resourceValue,a.supplierID,a.goodsTypeCitySupplierRelID,a.cityID,a.cityName,"
				  +"date_format(a.payDate, '%Y-%m-%d')as payDate,b.policyCustomerNo,b.policyNO,c.goodsOrderCustomerNumber as goodsOrderNo,"
				   +"b.carLicenseNO,(select payOrderCustomerNumber from payorder where id = a.payOrderID ) as payOrderCustomerNumber,"
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
				  + (sortFieldName=='payDate' ? " order by t.payDate "+sortDir : "");
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
	}
};