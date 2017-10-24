/**
 * 电子保单状态领域对象
 */
var PolicyStatusDomain = {
	/**
	 * 描述：新增电子保单状态记录
	 * @param
	 * @return 
	 */
	addPolicyOrderStatus : function(sqlExecute, policyID, orderStatus, description){
//		var sqlExecute = sqlAdpterHandler.getInstance(true);
		//新增电子保单状态记录
		var policyStatusID = sqlExecute.execute({
			sql:"insert into policystatusrecord(policyID,status,description,createTime,lastUpdate) "
				+"values(@policyID,@orderStatus,@description,now(),now())",
			param : {
			   policyID : policyID,
			   orderStatus : orderStatus,
			   description : description
			},
			returnRowId : true
		});
		return policyStatusID;
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