/**
 * 商品订单领域对象
 */
var RecordDomain = {
	
	/**
	 * 描述：查询游戏记录清单
	 * @param
	 * @return 
	 */
	getRecordList	:	function(sqlExecute, condition){
		var sql = "select * from wx_recode where 1=1 ";
		if(condition != null){
			sql = sql + condition;
		}
		logger.debug("查询游戏记录列表SQL："+sql);
		var retStr = sqlExecute.query({
			sql	:	sql,
			recordType:"object"
		});
		logger.debug("查询结果："+retStr);
		return JSON.parse(retStr);
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