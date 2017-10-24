/**
 * 商品订单领域对象
 */
var GoodsOrderDomain = {
	/**
	 * 描述：根据商品订单状态查询订单列表
	 * @param
	 * @return 
	 */
	listGoodsOrder : function(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo, sortFieldName, sortDir){
		var sql = "select a.id,a.id as goodsOrderID,a.payOrderID,c.payOrderCustomerNumber as payOrderNumber,a.goodsOrderCustomerNumber as goodsOrderNumber,a.goodsTypeID,a.goodsTypeName,"
				  +"if(a.goodsTypeID ='2',(select hcanCustomerNumber from hirepurchaseagreement where payOrderID = c.id),c.payOrderCustomerNumber) as hcanCustomerNumber,"
				  +"a.goodsID,(select goodsName from goods where id=a.goodsID)as goodsName,"
				  +"a.policyID,a.supplierID,a.supplierName,(select shortName from supplier where id=a.supplierID)as supplierShortName,"
				  +"a.userCarID,a.userID,a.cityID,(select cityName from city where id=a.cityID)as cityName,a.amount,a.amount as payFee,a.status,a.status as goodsOrderStatus,a.startTime,a.endTime,a.kindType,a.carLicenseNO,"
				  +"a.carFrameNO,a.carEngineNo,a.carOwnerName,a.carOwnerName as carOwner,b.carOwnerPhoneNO as phoneNO,b.policyCustomerNO,a.ownerCardID,a.insuredName,a.insuredCardID,"
				  +"date_format(a.createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from goodsorder a,policy b,payorder c where a.policyID=b.id and a.payOrderID=c.id "
				  + (supplierID ? "and a.supplierID=@supplierID " : "")
				  + (cityID ? "and a.cityID=@cityID " : "")
				  + (goodsID ? "and a.goodsID=@goodsID " : "")
				  + (goodsOrderStatus ? "and a.status=@goodsOrderStatus " : "")
				  + (createTimeStart ? "and a.createTime >= str_to_date(@createTimeStart, '%Y-%m-%d %H:%i:%s') " : "")
				  + (createTimeEnd ? "and a.createTime <= str_to_date(@createTimeEnd, '%Y-%m-%d %H:%i:%s') " : "")
				  + (goodsOrderNumber ? "and a.goodsOrderCustomerNumber like @goodsOrderNumber " : "")
				  + (carOwner ? "and a.carOwnerName like @carOwner " : "")
				  + (phoneNo ? "and b.carOwnerPhoneNO like @phoneNo " : "")
				  + (payOrderNumber ? "and c.payOrderCustomerNumber like @payOrderNumber " : "")
				  + (policyCustomerNo ? "and b.policyCustomerNO like @policyCustomerNo " : "")
				  + (sortFieldName=='lastUpdate' ? " order by a.lastUpdate "+sortDir : "");
		logger.debug("查询商品订单列表SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierID : supplierID,
				cityID : cityID,
				goodsID : goodsID,
				goodsOrderStatus : goodsOrderStatus,
				createTimeStart : createTimeStart,
				createTimeEnd : createTimeEnd,
				goodsOrderNumber : '%'+goodsOrderNumber+'%',
				carOwner : '%'+carOwner+'%',
				phoneNo : '%'+phoneNo+'%',
				payOrderNumber : '%'+payOrderNumber+'%',
				policyCustomerNo : '%'+policyCustomerNo+'%'
			},
			recordType:"object",
			resultType:"string"
		});
		var goodsOrderList = JSON.parse(retStr);
		return goodsOrderList;
	}
};