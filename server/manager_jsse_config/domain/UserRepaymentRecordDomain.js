/**
 * 用户还款记录领域对象
 */
var UserRepaymentRecordDomain = {
	/**
	 * 描述：根据分期付款计划ID查询用户还款记录
	 * @param
	 * @return 
	 */
	findRepaymentRecordByID : function(sqlExecute, hirePurchaseAgreementID){
		var retStr = sqlExecute.query({
			sql : "select id,id as userRepaymentRecordID,userID,hirePurchaseAgreementID,userRepaymentSettingID,payAmount,currentTime,status,"
				  +"(select payMethod from userrepaymentsetting where id=userRepaymentSettingID and userID=userID)as payMethod,"
				  +"date_format(firstPayDate,'%Y-%m-%d')as firstPayDate,firestPayFailReason,"
				  +"date_format(lastPayDate,'%Y-%m-%d')as lastPayDate,lastPayFailReason,"
				  +"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from userrepaymentrecord where hirePurchaseAgreementID = @hirePurchaseAgreementID order by currentTime ASC",
			param : {
				hirePurchaseAgreementID : hirePurchaseAgreementID
			},
			recordType:"object",
			resultType:"string"
		});
		var repaymentRecordList = JSON.parse(retStr);
		return repaymentRecordList;
	}
};