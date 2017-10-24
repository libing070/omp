/**
 * 电子保单领域对象
 */
var PolicyDomain = {
	/**
	 * 描述：根据电子保单ID查询电子保单
	 * @param
	 * @return 
	 */
	findPolicyByID : function(sqlExecute, policyID){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var retStr = sqlExecute.query({
			sql : "select id,id as policyID,policyCustomerNo,policyNO,goodsID,goodsTypeID,cityID,supplierID,"
				  + "(select supplierName from supplier where id = policy.supplierID) as supplierName,"
				  +"mainProposalNO,proposalNO,kindType,exchangeNO,quotationNO,"
				  +"(select cityName from city where id=cityID)as cityName,"
				  +"(select goodsName from goods where id=goodsID)as goodsName,"
				  +"(select name from goodstype where id=goodsTypeID)as goodsTypeName,"
				  +"carLicenseNO,insuredName,insuredCardID,sumPremium,basePremium,discount,sumDiscount,sumTravelTax,"
				  +"policyStatus,supplierOrderNo,orderAmount,"
				  +"date_format(startDate,'%Y-%m-%d')as startDate,"
				  +"date_format(endDate,'%Y-%m-%d')as endDate,"
				  +"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from policy where id = @policyID",
			param : {
				policyID : policyID
			},
			recordType:"object",
			resultType:"string"
		});
		var policy = JSON.parse(retStr)[0];
		return policy;
	},
	
	
	/**
	 * 描述：查询电子保单详情
	 * @param
	 * @return 
	 */
	findPolicyByGoodsOrderID : function(sqlExecute, goodsOrderID){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var sql = "select a.id,a.id as policyID,a.policyCustomerNo,a.policyNO,a.goodsID,a.goodsTypeID,a.cityID,b.carLicenseNO,a.carLicenseNO as licenseNO,a.kindType,a.policyStatus,b.goodsName,"
				  +"(select serviceHotline from platconfig limit 0,1)as serviceHotline,"
				  +"IF(a.kindType='1', a.sumPremium, a.sumPremium+a.sumTravelTax)as policyFee,"
				  +"date_format(startDate, '%Y-%m-%d')as startDate,"
				  +"date_format(endDate, '%Y-%m-%d')as endDate "
 				  +"from policy a,goodsorder b where a.id=b.policyID and b.id=@goodsOrderID";
		logger.debug("查询电子保单详情SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				goodsOrderID : goodsOrderID
			},
			recordType:"object",
			resultType:"string"
		});
		var policyInfo = JSON.parse(retStr)[0];
		return policyInfo;
	},
	
	/**
	 * 描述：查询电子保单详情
	 * @param {Object} sqlExecute
	 * @param {Object} supplierOrderNO，险企商品订单号
	 */
	findPolicyBySupplierOrderNO : function(sqlExecute, supplierOrderNO){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var sql = "select a.id as policyID,a.policyCustomerNo,a.goodsID,a.goodsTypeID,a.supplierOrderNO,a.kindType,a.sumPremium,a.sumTravelTax,"
				  +"a.cityID,(select cityName from city where id = a.cityID)as citName,a.supplierID,b.id as goodsOrderID,b.payOrderID,"
 				  +"(select c.id from goodstype_city_supplier_rel c,city_supplier_rel d where c.citySupplierID=d.id and d.supplierID=a.supplierID and d.cityID=a.cityID and c.goodsTypeID=a.goodsTypeID limit 0,1)as goodsTypeCitySupplierRelID "
 				  +" from policy a,goodsorder b  where a.id=b.policyID  and a.supplierOrderNO=@supplierOrderNO";
		logger.debug("查询电子保单详情SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierOrderNO : supplierOrderNO
			},
			recordType:"object",
			resultType:"string"
		});
		var policyInfo = JSON.parse(retStr)[0];
		return policyInfo;
	},
	
	/**
	 * 描述：查询电子保单保障方案详情
	 * @param
	 * @return 
	 */
	listProtectDetail : function(sqlExecute, policyID){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var sql = "select id,policyID,kindID,kindName,unitAccount,quantity,freeRate,account,basePremium,premium,discount,"
				  +"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from policykind where policyID = @policyID";
		logger.debug("查询电子保单保障方案详情SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				policyID : policyID
			},
			recordType:"object",
			resultType:"string"
		});
		var protectDetailList = JSON.parse(retStr);
		return protectDetailList;
	},
	
	
	/**
	 * 描述：根据保单状态查询保单总数
	 * @param
	 * @return 
	 */
	getPolicyCount : function(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo,errorTimeStart,errorTimeEnd, policyStatus){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var sql = "select count(1)as count "
				  +"from policy a left join goodsorder b on a.id=b.policyID left join policystatusrecord d on a.id=d.policyID "
				  +"where a.policyStatus in ("+policyStatus+") and d.status = a.policyStatus "
 				  + (supplierID ? "and a.supplierID=@supplierID " : "")
				  + (cityID ? "and a.cityID=@cityID " : "")
				  + (goodsID ? "and a.goodsID=@goodsID " : "")
				  + (policyCustomerNo ? "and a.policyCustomerNo like @policyCustomerNo " : "")
				  + (carOwner ? "and a.carOwner like @carOwner " : "")
				  + (phoneNo ? "and a.carOwnerPhoneNO like @phoneNo " : "")
				  + (errorTimeStart ? "and d.lastUpdate >= str_to_date(@errorTimeStart, '%Y-%m-%d %H:%i:%s') " : "")
				  + (errorTimeEnd ? "and d.lastUpdate <= str_to_date(@errorTimeEnd, '%Y-%m-%d %H:%i:%s') " : "");
		logger.debug("根据保单状态查询保单总数SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierID : supplierID,
				cityID : cityID,
				goodsID : goodsID,
				policyCustomerNo : '%'+policyCustomerNo+'%',
				carOwner : '%'+carOwner+'%',
				phoneNo : '%'+phoneNo+'%',
				policyStatus : policyStatus,
				errorTimeStart:errorTimeStart,
				errorTimeEnd:errorTimeEnd
			},
			recordType:"object",
			resultType:"string"
		});
		var policyCount = JSON.parse(retStr)[0].count;
		return policyCount;
	},
	
	
	/**
	 * 描述：根据保单状态查询保单列表
	 * @param
	 * @return 
	 */
	listPolicyByStatus : function(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo,errorTimeStart,errorTimeEnd,policyStatus, sortFieldName, sortDir, pageNumber, pageSize){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var sql = "select a.id,a.id as policyID,a.policyCustomerNo,a.policyNO,a.goodsTypeID,(select name from goodstype where id=a.goodsTypeID)as goodsTypeName,b.payOrderID,b.id as goodsOrderID,"
				  +"a.goodsID,a.supplierID,a.cityID,IF(a.goodsTypeID<>0, 'N', 'Y')as isGift,a.supplierOrderNO,a.orderAmount,"
				  +"(select goodsName from goods where id=a.goodsID)as goodsName,"
				  +"(select shortName from supplier where id=a.supplierID)as supplierShortName,"
				  +"(select cityName from city where id=a.cityID)as cityName,"
				  +"a.kindType,a.policyStatus,a.sumPremium,b.amount as payFee,a.carOwner as carOwner,a.carLicenseNO,a.carOwnerPhoneNO as phoneNO,"
				  +"IF(a.kindType='1', a.sumPremium, a.sumPremium+a.sumTravelTax)as policyFee,"
				  +"date_format(d.lastUpdate,'%Y-%m-%d %H:%i:%s')as refuseTime,"
				  +"date_format(d.lastUpdate,'%Y-%m-%d %H:%i:%s')as errorTime,"
				  +"date_format(d.lastUpdate,'%Y-%m-%d %H:%i:%s')as underwritingTime "
 				  +"from policy a left join goodsorder b on a.id=b.policyID left join policystatusrecord d on a.id=d.policyID "
 				  +"where a.policyStatus in ("+policyStatus+") and d.status = a.policyStatus "
 				  + (supplierID ? "and a.supplierID=@supplierID " : "")
				  + (cityID ? "and a.cityID=@cityID " : "")
				  + (goodsID ? "and a.goodsID=@goodsID " : "")
				  + (policyCustomerNo ? "and a.policyCustomerNo like @policyCustomerNo " : "")
				  + (carOwner ? "and a.carOwner like @carOwner " : "")
				  + (phoneNo ? "and a.carOwnerPhoneNO like @phoneNo " : "")
				  + (errorTimeStart ? "and d.lastUpdate >= str_to_date(@errorTimeStart, '%Y-%m-%d %H:%i:%s') " : "")
				  + (errorTimeEnd ? "and d.lastUpdate <= str_to_date(@errorTimeEnd, '%Y-%m-%d %H:%i:%s') " : "")
				  + (sortFieldName=='refuseTime' ? " order by d.lastUpdate "+sortDir : "")
				  + (sortFieldName=='errorTime' ? " order by d.lastUpdate "+sortDir : "")
				  + (sortFieldName=='underwritingTime' ? " order by d.lastUpdate "+sortDir : "")
				  +" limit "+(pageNumber-1)*pageSize+","+pageSize;
		logger.debug("根据保单状态查询保单列表SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierID : supplierID,
				cityID : cityID,
				goodsID : goodsID,
				policyCustomerNo : '%'+policyCustomerNo+'%',
				carOwner : '%'+carOwner+'%',
				phoneNo : '%'+phoneNo+'%',
				errorTimeStart : errorTimeStart,
				errorTimeEnd : errorTimeEnd,
				policyStatus : policyStatus
			},
			recordType:"object",
			resultType:"string"
		});
		var policyList = JSON.parse(retStr);
		return policyList;
	},
	
	
	
	/**
	 * 描述：更新电子保单状态
	 * @param
	 * @return 
	 */
	updatePolicyStatus : function(sqlExecute, policyID, policyStatus){
//		var sqlExecute = sqlAdpterHandler.getInstance(true);
		var retStr = sqlExecute.execute({
			sql:"update policy set policyStatus=@policyStatus,lastUpdate=now() where id=@policyID",
			param : {
				policyStatus : policyStatus,
				policyID : policyID
			},
			returnRowId:"false"
		});
	},
	
	
	/**
	 * 描述：更新电子保单
	 * @param
	 * @return 
	 */
	updatePolicy : function(sqlExecute, policy){
		var retStr = sqlExecute.execute({
			sql:"update policy set policyNO=@policyNO,proposalNO=@proposalNO,sumPremium=@sumPremium,lastUpdate=now() where id=@policyID",
			param : policy,
			returnRowId:"false"
		});
	},
	
	/**
	 * 回写保单号
	 * @param {Object} sqlExecute
	 * @param {Object} policyNO
	 * @param {Object} policyID
	 */
	writebackPolicyNO : function(sqlExecute, policyNO,policyID){
		var retStr = sqlExecute.execute({
			sql:"update policy set policyNO=@policyNO,lastUpdate=now() where id=@policyID",
			param : {
				policyNO : policyNO,
				policyID : policyID
			},
			returnRowId:"false"
		});
	},
	
	
	/**
	 * 描述：查询电子保单总数（9 系统转保单成功）
	 * @param
	 * @return 
	 */
	getDealPolicyCount : function(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime){
		var sql = "select count(1)as count "
				  +"from policy a left join goodsorder b on a.id=b.policyID left join mailaddress d on b.userID=d.userID "
 				  +"where a.policyStatus='9' and a.goodsTypeID in('2','4') "
				  + (supplierID ? "and a.supplierID=@supplierID " : "")
				  + (cityID ? "and a.cityID=@cityID " : "")
				  + (kindType ? "and a.kindType = @kindType " : "")
				  + (policyNO ? "and a.policyNO like @policyNO " : "")
				  + (carOwner ? "and d.receiver like @carOwner " : "")
				  + (phoneNo ? "and d.receiverPhone like @phoneNo " : "")
				  + (startTime ? "and d.lastUpdate >= str_to_date(@startTime, '%Y-%m-%d %H:%i:%s') " : "")
				  + (endTime ? "and d.lastUpdate <= str_to_date(@endTime, '%Y-%m-%d %H:%i:%s') " : "");
		logger.debug("查询电子保单总数（9 系统转保单成功）SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierID : supplierID,
				cityID : cityID,
				kindType : kindType,
				policyNO : '%'+policyNO+'%',
				carOwner : '%'+carOwner+'%',
				phoneNo : '%'+phoneNo+'%',
				startTime : startTime,
				endTime : endTime
			},
			recordType:"object",
			resultType:"string"
		});
		var dealPolicyCount = JSON.parse(retStr)[0].count;
		return dealPolicyCount;
	},
	
	
	/**
	 * 描述：查询电子保单（9 系统转保单成功）
	 * @param
	 * @return 
	 */
	listDealPolicy : function(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime, sortFieldName, sortDir, pageNumber, pageSize){
		var sql = "select a.id,a.id as policyID,a.policyCustomerNo,a.policyNO,a.goodsTypeID,(select name from goodstype where id=a.goodsTypeID)as goodsTypeName,b.payOrderID,b.id as goodsOrderID,"
				  +"a.goodsID,a.supplierID,a.cityID,IF(a.goodsTypeID<>0, 'N', 'Y')as isGift,"
				  +"(select goodsName from goods where id=a.goodsID)as goodsName,"
				  +"(select shortName from supplier where id=a.supplierID)as supplierShortName,"
				  +"(select cityName from city where id=a.cityID)as cityName,"
				  +"a.kindType,a.policyStatus,a.sumPremium,b.amount as payFee,a.carOwner as carOwner,a.carOwnerPhoneNO as phoneNO,"
				  +"IF(a.kindType='1', a.sumPremium, a.sumPremium+a.sumTravelTax)as policyFee,"
				  +"d.address,d.receiver,d.receiverPhone,"
				  +"date_format(d.lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
 				  +"from policy a left join goodsorder b on a.id=b.policyID left join mailaddress d on b.userID=d.userID "
 				  +"where a.policyStatus='9' and a.goodsTypeID in('2','4') "
 				  + (supplierID ? "and a.supplierID=@supplierID " : "")
				  + (cityID ? "and a.cityID=@cityID " : "")
				  + (kindType ? "and a.kindType = @kindType " : "")
				  + (policyNO ? "and a.policyNO like @policyNO " : "")
				  + (carOwner ? "and d.receiver like @carOwner " : "")
				  + (phoneNo ? "and d.receiverPhone like @phoneNo " : "")
				  + (startTime ? "and d.lastUpdate >= str_to_date(@startTime, '%Y-%m-%d %H:%i:%s') " : "")
				  + (endTime ? "and d.lastUpdate <= str_to_date(@endTime, '%Y-%m-%d %H:%i:%s') " : "")
				  + (sortFieldName=='lastUpdate' ? " order by d.lastUpdate "+sortDir : "")
				  +" limit "+(pageNumber-1)*pageSize+","+pageSize;
		logger.debug("查询电子保单（9 系统转保单成功）SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				supplierID : supplierID,
				cityID : cityID,
				kindType : kindType,
				policyNO : '%'+policyNO+'%',
				carOwner : '%'+carOwner+'%',
				phoneNo : '%'+phoneNo+'%',
				startTime : startTime,
				endTime : endTime
			},
			recordType:"object",
			resultType:"string"
		});
		var dealPolicyList = JSON.parse(retStr);
		return dealPolicyList;
	},
	
	
	/**
	 * 描述：根据proposalNO查询电子保单记录
	 * @param
	 * @return 
	 */
	findPolicyByProposalNO : function(sqlExecute, proposalNO){
		var retStr = sqlExecute.query({
			sql : "select * from policy where proposalNO = @proposalNO",
			param : {
				proposalNO : proposalNO
			},
			recordType:"object",
			resultType:"string"
		});
		var policy = JSON.parse(retStr)[0];
		return policy;
	},
	
	/**
	 * 描述：根据proposalNO查询电子保单记录
	 * @param
	 * @return 
	 */
	findPolicyByPolicyNO : function(sqlExecute, policyNO){
		var retStr = sqlExecute.query({
			sql : "select * from policy where policyNO = @policyNO",
			param : {
				policyNO : policyNO
			},
			recordType:"object",
			resultType:"string"
		});
		var policy = JSON.parse(retStr)[0];
		return policy;
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