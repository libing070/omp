/**
 * 支付订单领域对象
 */
var PayOrderDomain = {
	/**
	 * 描述：根据支付订单ID查询商品订单列表
	 * @param
	 * @return 
	 */
	listGoodsOrderByID : function(sqlExecute, payOrderID){
		var retStr = sqlExecute.query({
			sql : "select id,id as goodsOrderID,payOrderID,goodsOrderCustomerNumber,goodsTypeID,goodsTypeName,goodsID,goodsName,policyID,supplierName,supplierID,"
				  +"userCarID,userID,cityID,amount,status,status as goodsOrderStatus,kindType,carLicenseNO,carFrameNO,carEngineNo,carOwnerName,ownerCardID,insuredName,insuredCardID,"
				  +"(select policyCustomerNo from policy where id=policyID)as policyCustomerNo,"
				  +"(select policyNO from policy where id=policyID)as policyNO,"
				  +"(select policyStatus from policy where id=policyID)as policyStatus,"
				  +"(select phoneNO from users where id=userID)as mainPhoneNO,"
				  +"(select phoneNO from users where id=userID)as phoneNO,"
				  +"(select cityName from city where id=cityID)as cityName,"
				  +"(select a.id from goodstype_city_supplier_rel a,city_supplier_rel b where a.citySupplierID=b.id and b.supplierID=supplierID and b.cityID=cityID and a.goodsTypeID=goodsTypeID limit 0,1)as goodsTypeCitySupplierRelID,"
				  +"date_format(startTime,'%Y-%m-%d')as startTime,"
				  +"date_format(endTime,'%Y-%m-%d')as endTime,"
				  +"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from goodsorder where payOrderID = @payOrderID",
			param : {
				payOrderID : payOrderID
			},
			recordType:"object",
			resultType:"string"
		});
		var goodsOrderList = JSON.parse(retStr);
		return goodsOrderList;
	}
};