/**
 * 分期计划领域对象
 */
var HirePurchaseAgreementDomain = {
	/**
	 * 描述：查询首次/第二次未还款用户列表
	 * @param {status}	2 第一次还款失败	3 第二次还款失败
	 * @return 
	 */
	listPayFail : function(sqlExecute, firstPayDate, lastPayDate, carOwner, phoneNO, licenseNO, status, sortFieldName, sortDir){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.id as hirePurchaseAgreementID,a.payOrderID,a.userID,a.payDate,a.currentTime,a.sumAmount,a.sumTime,a.terminallyAmount,"
				  +"a.noPayAmount,a.sumAmount-a.noPayAmount as payAmount,a.userRepaymentSettingID,a.status,"
				  +"b.carOwner,b.carOwnerPhoneNO,b.carLicenseNO,b.goodsName,"
				  +"date_format(a.jqxStartTime, '%Y-%m-%d')as jqxStartTime,"
				  +"date_format(a.syxStartTime, '%Y-%m-%d')as syxStartTime,"
				  +"date_format(a.curFirstRepayDate, '%Y-%m-%d')as curFirstRepayDate,"
				  +"date_format(a.curEndRepayDate, '%Y-%m-%d')as curEndRepayDate,"
				  +"date_format(a.createTime, '%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate,"
				  +"(select count(1) from followuprecord where hirePurchaseAgreementID=a.id)as followUpRecordCount "
				  +"from hirepurchaseagreement a,payorder b where a.payOrderID=b.id and a.status=@status "
				  + (firstPayDate ? "and a.curFirstRepayDate = str_to_date(@firstPayDate, '%Y-%m-%d') " : "")
				  + (lastPayDate ? "and a.curEndRepayDate = str_to_date(@lastPayDate, '%Y-%m-%d') " : "")
				  + (carOwner ? "and b.carOwner like @carOwner " : "")
				  + (phoneNO ? "and b.carOwnerPhoneNO like @phoneNO " : "")
				  + (licenseNO ? "and b.carLicenseNO like @licenseNO " : "")
				  + (sortFieldName=='firstPayDate' ? " order by a.curFirstRepayDate "+sortDir : "")
				  + (sortFieldName=='lastPayDate' ? " order by a.curEndRepayDate "+sortDir : ""),
			param : {
				firstPayDate : firstPayDate,
				lastPayDate : lastPayDate,
				carOwner : '%'+carOwner+'%',
				phoneNO : '%'+phoneNO+'%',
				licenseNO : '%'+licenseNO+'%',
				status : status
			},
			recordType:"object",
			resultType:"string"
		});
		var firstPayFailList = JSON.parse(retStr);
		return firstPayFailList;
	},
	
	
	
	/**
	 * 描述：查询第二次未还款用户列表(导出报表专用)
	 * @param
	 * @return 
	 */
	listLastPayFail : function(sqlExecute, lastPayDate, carOwner, phoneNO, licenseNO, sortFieldName, sortDir){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.id as hirePurchaseAgreementID,a.payOrderID,a.userID,a.payDate,a.currentTime,a.sumAmount,a.sumTime,a.terminallyAmount,"
				  +"a.noPayAmount,a.sumAmount-a.noPayAmount as payAmount,a.userRepaymentSettingID,a.status,"
				  +"b.carOwner,b.carOwnerPhoneNO,b.carLicenseNO,b.goodsName,b.insuredName,b.cityName,"
				  +"(select shortName from supplier where id=b.supplierID)as supplierShortName,"
				  +"date_format(a.jqxStartTime, '%Y-%m-%d')as jqxStartTime,"
				  +"date_format(a.syxStartTime, '%Y-%m-%d')as syxStartTime,"
				  +"date_format(a.curFirstRepayDate, '%Y-%m-%d')as curFirstRepayDate,"
				  +"date_format(a.curEndRepayDate, '%Y-%m-%d')as curEndRepayDate,"
				  +"(select policyCustomerNo from policy where id = c.policyID)as policyCustomerNo,"
				  +"(select policyNO from policy where id = c.policyID)as policyNO,"
				  +"date_format(a.createTime, '%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from hirepurchaseagreement a left join payorder b on a.payOrderID=b.id right join goodsorder c on c.payOrderID=b.id where a.status='3' "
				  + (lastPayDate ? "and a.curEndRepayDate = str_to_date(@lastPayDate, '%Y-%m-%d') " : "")
				  + (carOwner ? "and b.carOwner like @carOwner " : "")
				  + (phoneNO ? "and b.carOwnerPhoneNO like @phoneNO " : "")
				  + (licenseNO ? "and b.carLicenseNO like @licenseNO " : "")
				  + (sortFieldName=='lastPayDate' ? " order by a.curEndRepayDate "+sortDir : ""),
			param : {
				lastPayDate : lastPayDate,
				carOwner : '%'+carOwner+'%',
				phoneNO : '%'+phoneNO+'%',
				licenseNO : '%'+licenseNO+'%'
			},
			recordType:"object",
			resultType:"string"
		});
		var lastPayFailList = JSON.parse(retStr);
		return lastPayFailList;
	}
};