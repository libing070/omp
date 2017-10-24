/**
 * 用户领域对象
 */
var UserDomain = {
	/**
	 * 描述：查询用户列表
	 * @param
	 * @return 
	 */
	listUser : function(sqlExecute, userName, phoneNO, licenseNO, userStatus, registDateStart, registDateEnd, sortFieldName, sortDir){
		var sql = "select * from ("
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
				  + (registDateEnd ? "and t.registDate <= str_to_date(@registDateEnd, '%Y-%m-%d %H:%i:%s') " : "")
				  + (sortFieldName=='registDate' ? " order by t.registDate "+sortDir : "");
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
	}
};