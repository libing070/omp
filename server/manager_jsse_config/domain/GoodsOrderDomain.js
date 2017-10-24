/**
 * 商品订单领域对象
 */
var GoodsOrderDomain = {
	/**
	 * 描述：根据商品订单ID查询商品订单
	 * @param
	 * @return 
	 */
	findGoodsOrderByID : function(sqlExecute, goodsOrderID){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var retStr = sqlExecute.query({
			sql : "select id,id as goodsOrderID,payOrderID,goodsOrderCustomerNumber,goodsTypeID,goodsTypeName,goodsID,goodsName,policyID,supplierName,supplierID,"
				  +"userCarID,userID,cityID,amount,status,status as goodsOrderStatus,kindType,carLicenseNO,carFrameNO,carEngineNo,carOwnerName,ownerCardID,insuredName,insuredCardID,"
				  +"(select phoneNO from users where id=userID)as mainPhoneNO,"
				  +"(select policyCustomerNo from policy where id=policyID)as policyCustomerNo,"
				  +"(select policyNO from policy where id=policyID)as policyNO,"
				  +"(select policyStatus from policy where id=policyID)as policyStatus,"
				  +"(select phoneNO from users where id=userID)as phoneNO,"
				  +"(select cityName from city where id=cityID)as cityName,"
				  +"(select a.id from goodstype_city_supplier_rel a,city_supplier_rel b where a.citySupplierID=b.id and b.supplierID=supplierID and b.cityID=cityID and a.goodsTypeID=goodsTypeID limit 0,1)as goodsTypeCitySupplierRelID,"
				  +"date_format(startTime,'%Y-%m-%d')as startTime,"
				  +"date_format(endTime,'%Y-%m-%d')as endTime,"
				  +"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from goodsorder where id = @goodsOrderID",
			param : {
				goodsOrderID : goodsOrderID
			},
			recordType:"object",
			resultType:"string"
		});
		var goodsOrder = JSON.parse(retStr)[0];
		return goodsOrder;
	},
	
	/**
	 * 描述：查询商品订单总数
	 * @param
	 * @return 
	 */
	getGoodsOrderCount : function(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var sql = "select count(1)as count "
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
				  + (policyCustomerNo ? "and b.policyCustomerNO like @policyCustomerNo " : "");
		logger.debug("查询商品订单总数SQL：" + sql);
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
		var goodsOrderCount = JSON.parse(retStr)[0].count;
		return goodsOrderCount;
	},
	
	
	/**
	 * 描述：根据商品订单状态查询订单列表
	 * @param
	 * @return 
	 */
	listGoodsOrder : function(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo, sortFieldName, sortDir, pageNumber, pageSize){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var sql = "select a.id,a.id as goodsOrderID,a.payOrderID,c.payOrderCustomerNumber as payOrderNumber,a.goodsOrderCustomerNumber as goodsOrderNumber,a.goodsTypeID,"
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
				  + (sortFieldName=='lastUpdate' ? " order by a.lastUpdate "+sortDir : "")
				  +" limit "+(pageNumber-1)*pageSize+","+pageSize;
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
	},
	
	/**
	 * 描述：更新商品订单状态
	 * @param
	 * @return 
	 */
	updateGoodsOrderStatus : function(sqlExecute, goodsOrderID, goodsOrderStatus){
//		var sqlExecute = sqlAdpterHandler.getInstance(true);
		var retStr = sqlExecute.execute({
			sql:"update goodsorder set status=@goodsOrderStatus,lastUpdate=now() where id=@goodsOrderID",
			param : {
				goodsOrderStatus : goodsOrderStatus,
				goodsOrderID : goodsOrderID
			},
			returnRowId:"false"
		});
	},
	
	
	/**
	 * 描述：根据支付订单ID查询商品订单
	 * @param
	 * @return 
	 */
	listGoodsOrderByPayOrderID : function(sqlExecute, payOrderID){
		var sql = "select a.id,a.id as goodsOrderID,a.payOrderID,a.goodsOrderCustomerNumber as goodsOrderNumber,a.goodsTypeID,"
				  +"a.goodsID,a.policyID,a.supplierID,a.supplierName,a.userCarID,a.userID,"
				  +"a.cityID,a.amount,a.amount as payFee,a.status,a.status as goodsOrderStatus,a.startTime,a.endTime,a.kindType,a.carLicenseNO,"
				  +"a.carFrameNO,a.carEngineNo,a.carOwnerName,a.carOwnerName as carOwner,a.ownerCardID,a.insuredName,a.insuredCardID,"
				  +"date_format(a.createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from goodsorder a where a.payOrderID = @payOrderID";
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				payOrderID : payOrderID
			},
			recordType:"object",
			resultType:"string"
		});
		var goodsOrderList = JSON.parse(retStr);
		return goodsOrderList;
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