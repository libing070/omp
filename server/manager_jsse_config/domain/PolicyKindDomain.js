/**
 * 保单险别领域对象
 */
var PolicyKindDomain = {
	/**
	 * 描述：根据电子保单ID查询保单险别列表
	 * @param
	 * @return 
	 */
	listPolicyKindByPolicyID : function(sqlExecute, policyID){
		var retStr = sqlExecute.query({
			sql : "select id,id as policyKindID,policyID,kindID,kindName,unitAccount,quantity,freeRate,account,basePremium,premium,discount,"
				  +"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from policykind where policyID = @policyID order by createTime ASC",
			param : {
				policyID : policyID
			},
			recordType:"object",
			resultType:"string"
		});
		var policyKindList = JSON.parse(retStr);
		return policyKindList;
	}
};