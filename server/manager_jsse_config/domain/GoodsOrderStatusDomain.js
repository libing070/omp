/**
 * 商品订单状态领域对象
 */
var GoodsOrderStatusDomain = {
	/**
	 * 描述：新增商品订单状态记录
	 * @param
	 * @return 
	 */
	addGoodsOrderStatus : function(sqlExecute, goodsOrderID, orderStatus, description){
//		var sqlExecute = sqlAdpterHandler.getInstance(true);
		//新增商品订单状态记录
		var orderStatusID = sqlExecute.execute({
			sql:"insert into goodsorder_status_record(goodsOrderID,status,description,createTime,lastUpdate) "
				+"values(@goodsOrderID,@orderStatus,@description,now(),now())",
			param : {
			   goodsOrderID : goodsOrderID,
			   orderStatus : orderStatus,
			   description : description
			},
			returnRowId : true
		});
		return orderStatusID;
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