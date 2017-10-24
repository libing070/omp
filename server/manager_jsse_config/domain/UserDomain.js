/**
 * 用户领域对象
 */
var UserDomain = {
	/**
	 * 描述：查询用户总数
	 * @param
	 * @return 
	 */
	getUserCount : function(sqlExecute, userName, phoneNO, licenseNO, userStatus, registDateStart, registDateEnd){
		var sql = "select count(1)as count from ("
				  +"select a.id,a.id as userID,a.phoneNO,a.password,a.email,a.sex,a.IDDecimal,a.userStatus,a.status,"
				  +"(select carOwner from usercar where userID=a.id and isCommonUse='1')as userName,"
				  +"(select carLicense from usercar where userID=a.id and isCommonUse='1')as licenseNO,"
				  +"date_format(a.createTime, '%Y-%m-%d %H:%i:%s')as registDate,"
				  +"date_format(a.lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from users a where a.status='N' "
				  +") t where 1=1 "
 				  + (userName ? "and t.userName like @userName " : "")
				  + (phoneNO ? "and t.phoneNO like @phoneNO " : "")
				  + (licenseNO ? "and t.licenseNO like @licenseNO " : "")
				  + (userStatus ? "and t.userStatus=@userStatus " : "")
				  + (registDateStart ? "and t.registDate >= str_to_date(@registDateStart, '%Y-%m-%d %H:%i:%s') " : "")
				  + (registDateEnd ? "and t.registDate <= str_to_date(@registDateEnd, '%Y-%m-%d %H:%i:%s') " : "");
		logger.debug("查询用户总数SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				userName : '%'+userName+'%',
				phoneNO : '%'+phoneNO+'%',
				licenseNO : '%'+licenseNO+'%',
				userStatus : userStatus,
				registDateStart : registDateStart,
				registDateEnd : registDateEnd
			},
			recordType:"object",
			resultType:"string"
		});
		var userCount = JSON.parse(retStr)[0].count;
		return userCount;
	},
	
	
	/**
	 * 描述：查询用户列表
	 * @param
	 * @return 
	 */
	listUser : function(sqlExecute, userName, phoneNO, licenseNO, userStatus, registDateStart, registDateEnd, sortFieldName, sortDir, pageNumber, pageSize){
		var sql = "select * from ("
				  +"select a.id,a.id as userID,a.phoneNO,a.password,a.email,a.sex,a.IDDecimal,a.userStatus,a.status,"
				  +"(select carOwner from usercar where userID=a.id and isCommonUse='1' limit 0,1)as userName,"
				  +"(select carLicense from usercar where userID=a.id and isCommonUse='1' limit 0,1)as licenseNO,"
				  +"date_format(a.createTime, '%Y-%m-%d %H:%i:%s')as registDate,"
				  +"date_format(a.lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from users a where a.status='N' "
				  +") t where 1=1 "
 				  + (userName ? "and t.userName like @userName " : "")
				  + (phoneNO ? "and t.phoneNO like @phoneNO " : "")
				  + (licenseNO ? "and t.licenseNO like @licenseNO " : "")
				  + (userStatus ? "and t.userStatus=@userStatus " : "")
				  + (registDateStart ? "and t.registDate >= str_to_date(@registDateStart, '%Y-%m-%d %H:%i:%s') " : "")
				  + (registDateEnd ? "and t.registDate <= str_to_date(@registDateEnd, '%Y-%m-%d %H:%i:%s') " : "")
				  + (sortFieldName=='registDate' ? " order by t.registDate "+sortDir : "")
				  +" limit "+(pageNumber-1)*pageSize+","+pageSize;
		logger.debug("查询用户列表SQL：" + sql);
		var retStr = sqlExecute.query({
			sql : sql,
			param : {
				userName : '%'+userName+'%',
				phoneNO : '%'+phoneNO+'%',
				licenseNO : '%'+licenseNO+'%',
				userStatus : userStatus,
				registDateStart : registDateStart,
				registDateEnd : registDateEnd
			},
			recordType:"object",
			resultType:"string"
		});
		var userList = JSON.parse(retStr);
		return userList;
	},
	
	
	/**
	 * 描述：查询用户基本详情
	 * @param
	 * @return 
	 */
	findUserDetailByID : function(sqlExecute, userID){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.id as userID,a.phoneNO,a.password,a.email,a.sex,a.IDDecimal,a.userStatus,a.status,"
				  +"(select carOwner from usercar where userID=a.id and isCommonUse='1')as userName,"
				  +"(select carLicense from usercar where userID=a.id and isCommonUse='1')as licenseNO,"
				  +"date_format(a.createTime, '%Y-%m-%d %H:%i:%s')as registDate,"
				  +"date_format(a.lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from users a where a.id=@userID",
			param : {
				userID : userID
			},
			recordType:"object",
			resultType:"string"
		});
		var userDetail = JSON.parse(retStr)[0];
		return userDetail;
	},
	
	
	/**
	 * 描述：查询用户车辆记录
	 * @param
	 * @return 
	 */
	listCars : function(sqlExecute, userID){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.id as carID,a.userID,a.carOwner,a.carOwnerPhoneNumber,a.ownerCardID,a.cityID,a.cityName,a.brandCode,a.brandName,"
				  +"a.familyCode,a.familyName,a.exhaustscaleID,a.exhaustscale,a.modelCode,a.modelCName,a.carLicense,a.frameNO,a.engineNO,a.isCommonUse,a.status,"
				  +"(select insuredName from goodsorder where userCarID=a.id and userID=a.userID order by lastUpdate DESC limit 0,1)as insuredName,"
				  +"(select insuredCardID from goodsorder where userCarID=a.id and userID=a.userID order by lastUpdate DESC limit 0,1)as insuredCardID,"
				  +"date_format(a.enrollDate, '%Y-%m-%d')as enrollDate,"
				  +"date_format(a.createTime, '%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from usercar a where a.status='N' and a.userID=@userID",
			param : {
				userID : userID
			},
			recordType:"object",
			resultType:"string"
		});
		var carList = JSON.parse(retStr);
		return carList;
	},
	
	
	/**
	 * 描述：查询用户还款计划
	 * @param
	 * @return 
	 */
	listHirePurchaseAgreement : function(sqlExecute, userID){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.id as hirePurchaseAgreementID,a.hcanCustomerNumber,a.payOrderID,a.userID,a.payDate,a.currentTime,a.sumAmount,a.sumTime,a.terminallyAmount,"
				  +"a.noPayAmount,a.sumAmount-a.noPayAmount as payAmount,a.userRepaymentSettingID,a.status,"
				  +"(select carLicenseNO from payorder where userID=a.userID and id=a.payOrderID)as carLicenseNO,"
				  +"(select goodsName from payorder where userID=a.userID and id=a.payOrderID)as goodsName,"
				  +"date_format(a.jqxStartTime, '%Y-%m-%d')as jqxStartTime,"
				  +"date_format(a.syxStartTime, '%Y-%m-%d')as syxStartTime,"
				  +"date_format(a.curFirstRepayDate, '%Y-%m-%d')as curFirstRepayDate,"
				  +"date_format(a.curEndRepayDate, '%Y-%m-%d')as curEndRepayDate,"
				  +"date_format(a.createTime, '%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from hirepurchaseagreement a where a.userID=@userID and a.status is not null order by a.createTime DESC",
			param : {
				userID : userID
			},
			recordType:"object",
			resultType:"string"
		});
		var hirePurchaseAgreementList = JSON.parse(retStr);
		return hirePurchaseAgreementList;
	},
	
	
	
	/**
	 * 描述：查询用户商品订单列表
	 * @param
	 * @return 
	 */
	listGoodsOrder : function(sqlExecute, userID){
		var retStr = sqlExecute.query({
			sql : "select id,id as goodsOrderID,payOrderID,goodsOrderCustomerNumber,goodsTypeID,goodsTypeName,goodsID,goodsName,policyID,supplierName,supplierID,"
				  +"userCarID,userID,cityID,amount,status,status as goodsOrderStatus,kindType,carLicenseNO,carFrameNO,carEngineNo,carOwnerName,ownerCardID,insuredName,insuredCardID,"
				  +"(select phoneNO from users where id=userID)as phoneNO,"
				  +"(select cityName from city where id=cityID)as cityName,"
				  +"date_format(startTime,'%Y-%m-%d')as startTime,"
				  +"date_format(endTime,'%Y-%m-%d')as endTime,"
				  +"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from goodsorder where userID = @userID order by createtime desc",
			param : {
				userID : userID
			},
			recordType:"object",
			resultType:"string"
		});
		var goodsOrderList = JSON.parse(retStr);
		return goodsOrderList;
	},
	
	
	/**
	 * 描述：设置用户状态
	 * @param
	 * @return 
	 */
	updateUserStatus : function(sqlExecute, userID, userStatus){
		var retStr = sqlExecute.execute({
			sql:"update users set userStatus=@userStatus,lastUpdate=now() where id=@userID",
			param : {
				userID : userID,
				userStatus : userStatus
			},
			returnRowId:"false"
		});
	},
	
	/**
	 * 查询用户年龄分布
	 * @param {Object} sqlExecute
	 * @param {Object} period
	 */
	queryUserAgePeriod : function(sqlExecute, period) {
		var retStr = sqlExecute.query({
			sql : "select elt(interval(ownerAge,0, 17, 25, 35, 45, 55, 65),'period_0','period_1', 'period_2', 'period_3','period_4','period_5', 'period_6') as yb_level"
				  +", count(1) as count,(select count(1) from  usercar where ownerAge >=18 and createTime >= DATE_ADD(CURDATE(), INTERVAL -1 "
				  + period
				  +")) as sumCount from usercar where  ownerAge >=18 and createTime >= DATE_ADD(CURDATE(), INTERVAL -1 "
				  + period
				  +") group by yb_level ",
			param : {
				period : period
			},
			recordType:"object",
			resultType:"string"
		});
		var agePeriod = JSON.parse(retStr);
		return agePeriod;
	},
	
	/**
	 * 查询用户性别分布
	 * @param {Object} sqlExecute
	 * @param {Object} createTimeStart
	 * @param {Object} createTimeEnd
	 */
	queryUserSexPeriod : function(sqlExecute, period){
		var retStr = sqlExecute.query({
			sql : "select ownerSex,count(1) as count,(select count(1) from usercar where createTime >= DATE_ADD(CURDATE(), INTERVAL -1 "
				  + period
				  +"))as sumCount from usercar where "
				  +" createTime >= DATE_ADD(CURDATE(), INTERVAL -1 "
				  + period
				  +") group by ownerSex ",
			param : {
				period : period
			},
			recordType:"object",
			resultType:"string"
		});
		var sexPeriod = JSON.parse(retStr);
		return sexPeriod;
	},
	
	/**
	 * 查询用户设备分布
	 * @param {Object} sqlExecute
	 * @param {Object} period
	 */
	queryUserDevicePeriod : function(sqlExecute, period) {
		var retStr = sqlExecute.query({
			sql : "select deviceType,count(1)as count,(select count(1) from report_device where createTime >= DATE_ADD(CURDATE(), INTERVAL -1 "
				  + period
				  +"))as sumCount from  report_device where createTime >= DATE_ADD(CURDATE(), INTERVAL -1 "
				  + period
				  +") group by deviceType ",
			param : {
				period : period
			},
			recordType:"object",
			resultType:"string"
		});
		var devicePeriod = JSON.parse(retStr);
		return devicePeriod;
	},
	
	/**
	 * 查询用户地域分布
	 * @param {Object} sqlExecute
	 * @param {Object} period
	 */
	queryUserCityPeriod : function(sqlExecute, period) {
		var retStr = sqlExecute.query({
			sql : "select cityID,cityName,count(1)as count,(select count(1) from usercar where createTime >= DATE_ADD(CURDATE(), INTERVAL -1 "
				  + period
				  +"))as sumCount from  usercar where createTime >= DATE_ADD(CURDATE(), INTERVAL -1 "
				  + period
				  +") group by cityID,cityName ",
			param : {
				period : period
			},
			recordType:"object",
			resultType:"string"
		});
		var cityPeriod = JSON.parse(retStr);
		return cityPeriod;
	},
	
	/**
	 * 装机量统计
	 * @param {Object} sqlExecute
	 * @param {Object} period
	 */
	queryConversionByPeriod : function(sqlExecute,period) {
		var sql="";
		if(period=="0"){
			sql="select DATE_FORMAT(createTime,'%H:00:00') as businessTime,count(id) as count from report_device where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 DAY) "
				+" group by DATE_FORMAT(createTime,'%H:00:00')"
				+" order by createTime asc "
				;
		}else if(period=="1"){
			sql="select DATE_FORMAT(createTime,'%Y-%m-%d') as businessTime,count(id) as count from report_device where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 WEEK) "
				+" group by DATE_FORMAT(createTime,'%Y-%m-%d')"
				+" order by createTime asc "
				;
		}else if(period=="2"){
			sql="select DATE_FORMAT(createTime,'%Y-%m-%d') as businessTime,count(id) as count from report_device where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 MONTH) "
				+" group by DATE_FORMAT(createTime,'%Y-%m-%d')"
				+" order by createTime asc "
				;
		}else if(period=="3"){
			sql="select DATE_FORMAT(createTime,'%Y-%m') as businessTime,count(id) as count from report_device where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
				+" group by DATE_FORMAT(createTime,'%Y-%m')"
				+" order by createTime asc "
				;
		};
		var result=JSON.parse(sqlExecute.query({
			sql:sql,
			param:{
			}
		}));
		
		return result;
		
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
	},
	
	/**
	 * 累计用户数量
	 * @param {Object} sqlExecute
	 * @param {Object} period
	 */
	queryUserSumCountByPeriod:function(sqlExecute,period) {
		var sql="";
		if(period=="0"){
			sql="select count(1) as sumUserNum from users where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 DAY) "
				;
		}else if(period=="1"){
			sql="select count(1) as sumUserNum from users where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 WEEK) "
				;
		}else if(period=="2"){
			sql="select count(1) as sumUserNum from users where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 MONTH) "
				;
		}else if(period=="3"){
			sql="select count(1) as sumUserNum from users where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
				;
		};
		
		var result=JSON.parse(sqlExecute.query({
			sql:sql,
			param:{
			}
		}));
		return result[0].sumUserNum;
		
	},
	
	/**
	 * 新增用户量的统计（按区间统计）
	 * @param sqlExecute
	 * @param period
	 * @returns
	 */
	queryUserCountByPeriod:function(sqlExecute,period){
		var sql="";
		if(period=="0"){
			sql="select DATE_FORMAT(createTime,'%H:00:00') as businessTime,count(id) as count from users where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 DAY) "
				+" group by DATE_FORMAT(createTime,'%H:00:00')"
				+" order by createTime asc "
				;
		}else if(period=="1"){
			sql="select DATE_FORMAT(createTime,'%Y-%m-%d') as businessTime,count(id) as count from users where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 WEEK) "
				+" group by DATE_FORMAT(createTime,'%Y-%m-%d')"
				+" order by createTime asc "
				;
		}else if(period=="2"){
			sql="select DATE_FORMAT(createTime,'%Y-%m-%d') as businessTime,count(id) as count from users where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 MONTH) "
				+" group by DATE_FORMAT(createTime,'%Y-%m-%d')"
				+" order by createTime asc "
				;
		}else if(period=="3"){
			sql="select DATE_FORMAT(createTime,'%Y-%m') as businessTime,count(id) as count from users where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
				+" group by DATE_FORMAT(createTime,'%Y-%m')"
				+" order by createTime asc "
				;
		};
		logger.debug("===queryUserCountByPeriod sql==="+sql);
		var result=JSON.parse(sqlExecute.query({
			sql:sql,
			param:{
			}
		}));
		logger.debug("===queryUserCountByPeriod result==="+JSON.stringify(result));
		return result;
	}
};