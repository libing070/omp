/**
 * @author yanglin
 * @description 报价单的excel导出
 * 
 */
var QuotationDomain={
	listQuotation:function(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo,sortFieldName,sortDir){
		var sql='select id as quotationID,quotationCustomerNumber,goodsTypeID,(select name from goodstype where goodstype.id=quotation.goodsTypeID) as goodsTypeName,'
		+'cityID,(select cityName from city where city.id=quotation.cityID) as cityName,'
		+'supplierID,(select supplierName from supplier where supplier.id=quotation.supplierID) as supplierName,(select shortName from supplier where supplier.id=quotation.supplierID) as shortName,'
		+'goodsID,(select goodsName from goods where goods.id=quotation.goodsID) as goodsName,'
		+"lockStatus,quotationStatus,lockOwner,carOwner,carOwnerPhoneNO as phoneNO,date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
		+"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate,amount"
		+" from quotation where quoteMode=1  "
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
		logger.debug("====导出报价单表的结果==="+result);
		var list=JSON.parse(result);
		return list;
	}
}
