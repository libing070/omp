/**
 * 电子保单领域对象
 */
var PolicyDomain = {
	/**
	 * 描述：根据保单状态查询保单列表
	 * @param
	 * @return 
	 */
	listPolicyByStatus : function(sqlExecute, supplierID, cityID, goodsID, policyCustomerNo, carOwner, phoneNo,errorTimeStart,errorTimeEnd, policyStatus, sortFieldName, sortDir){
//		var sql = "select a.id,a.id as policyID,a.policyCustomerNo,a.policyNO,a.goodsTypeID,(select name from goodstype where id=a.goodsTypeID)as goodsTypeName,b.payOrderID,b.id as goodsOrderID,"
//				  +"a.goodsID,a.supplierID,a.cityID,IF(a.goodsTypeID<>0, 'N', 'Y')as isGift,"
//				  +"(select goodsName from goods where id=a.goodsID)as goodsName,"
//				  +"(select shortName from supplier where id=a.supplierID)as supplierShortName,"
//				  +"(select cityName from city where id=a.cityID)as cityName,"
//				  +"a.kindType,a.policyStatus,a.sumPremium,a.sumPremium as policyFee,b.amount as payFee,a.carOwner as carOwner,a.carOwnerPhoneNO as phoneNO,"
//				  +"date_format(d.lastUpdate,'%Y-%m-%d %H:%i:%s')as refuseTime,"
//				  +"date_format(d.lastUpdate,'%Y-%m-%d %H:%i:%s')as errorTime,"
//				  +"date_format(d.lastUpdate,'%Y-%m-%d %H:%i:%s')as underwritingTime "
// 				  +"from policy a left join goodsorder b on a.id=b.policyID left join policystatusrecord d on a.id=d.policyID "
// 				  +"where a.policyStatus in ("+policyStatus+") and d.status = a.policyStatus "
// 				  + (supplierID ? "and a.supplierID=@supplierID " : "")
//				  + (cityID ? "and a.cityID=@cityID " : "")
//				  + (goodsID ? "and a.goodsID=@goodsID " : "")
//				  + (policyCustomerNo ? "and a.policyCustomerNo like @policyCustomerNo " : "")
//				  + (carOwner ? "and a.carOwner like @carOwner " : "")
//				  + (phoneNo ? "and a.carOwnerPhoneNO like @phoneNo " : "")
//				  + (sortFieldName=='refuseTime' ? " order by d.lastUpdate "+sortDir : "")
//				  + (sortFieldName=='errorTime' ? " order by d.lastUpdate "+sortDir : "")
//				  + (sortFieldName=='underwritingTime' ? " order by d.lastUpdate "+sortDir : "");
				  
		var sql = "select a.id,a.id as policyID,a.policyCustomerNo,a.policyNO,a.goodsTypeID,(select name from goodstype where id=a.goodsTypeID)as goodsTypeName,b.payOrderID,"
				  +"(select payOrderCustomerNumber from payorder where id = b.payOrderID) as payOrderCustomerNumber,"
				  +"b.id as goodsOrderID,a.goodsID,a.supplierID,a.cityID,IF(a.goodsTypeID<>0, 'N', 'Y')as isGift,"
				  +"(select goodsName from goods where id=a.goodsID)as goodsName,"
				  +"(select shortName from supplier where id=a.supplierID)as supplierShortName,"
				  +"(select cityName from city where id=a.cityID)as cityName,"
				  +"(select payMethod from payorder where id=b.payOrderID)as payMethod,"
				  +"(select payAccount from payorder where id=b.payOrderID)as payAccount,"
				  +"a.kindType,a.policyStatus,a.sumPremium,b.amount as payFee,a.carOwner as carOwner,a.carLicenseNO,a.carOwnerPhoneNO as phoneNO,"
				  +"IF(a.kindType='1', a.sumPremium, a.sumPremium+a.sumTravelTax)as policyFee,"
				  +"(select modelCName from usercar where id=a.carID)as modelCName,"
				  +"(select seatCount from usercarinfobyquery where usercarid=a.carID and supplierID = a.supplierID) as seatCount,"
				  +"(select exhaustScaleDes from usercar where id=a.carID) as exhaustScale,"
				  +"(select protectPlanName from protectplan where id=(select protectPlanID from goods where id=a.goodsID))as protectPlanName,"
				  +"a.carFrameNO,a.carLicenseNO,a.carEngineNO,a.insuredName,a.insuredCardID,a.ownerCardID,"
				  +"date_format(a.startDate,'%Y-%m-%d')as startDate,"
				  +"date_format(a.endDate,'%Y-%m-%d')as endDate,"
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
				  + (sortFieldName=='underwritingTime' ? " order by d.lastUpdate "+sortDir : "");
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
	 * 描述：查询电子保单（9 系统转保单成功）
	 * @param
	 * @return 
	 */
	listDealPolicy : function(sqlExecute, supplierID, cityID, kindType, policyNO, carOwner, phoneNo, startTime, endTime, sortFieldName, sortDir){
		var sql = "select a.id,a.id as policyID,a.policyCustomerNo,a.policyNO,a.goodsTypeID,(select name from goodstype where id=a.goodsTypeID)as goodsTypeName,b.payOrderID,b.id as goodsOrderID,"
				  +"a.goodsID,a.supplierID,a.cityID,IF(a.goodsTypeID<>0, 'N', 'Y')as isGift,a.carLicenseNO,a.insuredName,"
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
				  + (sortFieldName=='lastUpdate' ? " order by d.lastUpdate "+sortDir : "");
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
	}
};