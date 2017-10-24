/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 */
var CountOrderAddDomain = {
	
	/**
	 * 根据城市查询订单统计信息
	 * @param {Object} sqlAdapter
	 * @param {Object} cityID
	 * @return [{cityID 城市ID supplierID 供应商ID count 数量 countDate 统计日期 }]
	 */
	queryOrderAddListByCityID:function(sqlAdapter, cityID) {
		var sql = "select   date_format(countDate,'%Y-%m-%d') as countDate   " +
				  "       , ifnull(sum(count),0) count  " +
   			      " from count_orderadd where 1 = 1 " +
   			      "  and countDate >= DATE_SUB(curdate(),INTERVAL 1 MONTH) ";
   			    
		//如果 cityID 不传，则查询所有
		if(cityID) {
			sql += (' and cityID = @cityID ' ) ;
		}
		sql += (" group by  date_format(countDate,'%Y-%m-%d') ") ;
		sql += (" order by countDate desc") ;
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				cityID : cityID
			}
		});
		return JSON.parse(result);
	},
	
	/**
	 * 根据城市ID 统计订单
	 * @param {Object} sqlAdapter
	 * @param {Object} cityID
	 */
	queryCountOrderAddByCityID:function(sqlAdapter, cityID){
//		var sql = "select ifnull(sum(count),0) as totalOrder from count_orderadd " +
//		          " where countDate >= DATE_SUB(curdate(),INTERVAL 1 MONTH) ";

		var sql = "select IFNULL(sum(count),0) as totalOrder from count_orderadd where 1=1 ";
   			    
		//如果 cityID 不传，则查询所有
		if(cityID) {
			sql += (' and cityID = @cityID ' ) ;
		}
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				cityID : cityID
			}
		});
		return JSON.parse(result);
	},
	
	
	/**
	 * 订单交易 按日统计
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj{goodsID,supplierID,cityID,monthDate}
	 * @return [{supplierID,businessDate,orderNumber-每日新增订单数量}]
	 */
	queryOrderAddByDay:function(sqlAdapter, queryObj) {
		var sql = "select    u.supplierID    " +
				 "        ,  u.countDate " +
		          "       , (select s.supplierName from supplier s where s.id = u.supplierID) as supplierName " +
		          "       , ifnull(sum(u.count) , 0) count " +
   			      " from count_orderadd u "  +
   			      " where 1 = 1  "
   			      ;
   			    
		if(queryObj.supplierID) {
			sql += (' and u.supplierID = @supplierID ' ) ;
		}
		if(queryObj.goodsID) {
			sql += (' and u.goodsID = @goodsID ' ) ;
		}
		if(queryObj.cityID) {
			sql += (' and u.cityID = @cityID' ) ;
		}
		if(queryObj.monthDate){
			sql += (" and @monthDate = date_format(u.countDate,'%Y-%m')" ) ;
		}
		
		sql += (" group by u.supplierID ,  u.countDate ") ;
// 		sql += (" order by u.countDate ") ;
   		if(!queryObj.supplierID){
   			sql += ("	UNION ALL   ") ;
	   		sql += ( "select   'all' as supplierID " +
			          "       , u.countDate " +
			          "       , '所有供应商' as supplierName " +
			          "       , ifnull(sum(u.count) , 0) count " +
	   			      " from count_orderadd u where 1 = 1 " 
	   			    ) ;
	   		if(queryObj.monthDate){
				sql += (" and @monthDate = date_format(u.countDate,'%Y-%m')" ) ;
			}
	   		if(queryObj.goodsID) {
				sql += (' and u.goodsID = @goodsID ' ) ;
			}
			if(queryObj.cityID) {
				sql += (' and u.cityID = @cityID' ) ;
			}
	   		sql += (" group by 'all', u.countDate ") ;
   		}
   		
   		
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				cityID : queryObj.cityID ,
				goodsID : queryObj.goodsID ,
				supplierID : queryObj.supplierID ,
				monthDate : queryObj.monthDate 
			}
		});
		return JSON.parse(result);
	},
	
	/**
	 * 订单 根据日期区间 交易总额统计
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj
	 */
	queryCountOrderATurnover:function(sqlAdapter, queryObj) {
		var sql = "select ifnull(sum(t.count),0) as sumAmount " +
				  " from count_turnoveradd t , count_orderadd o" +
				  " where t.cityID = o.cityID" +
				  "   and t.supplierID = o.supplierID " +
				  "   and t.goodsID = o.goodsID " 
   			      ;

		if(queryObj.supplierID) {
			sql += (' and t.supplierID = @supplierID ' ) ;
		}
		if(queryObj.goodsID) {
			sql += (' and t.goodsID = @goodsID ' ) ;
		}
		if(queryObj.cityID) {
			sql += (' and t.cityID = @cityID' ) ;
		}
		
		if(queryObj.type == '1'){
			if(queryObj.monthDate){
				sql += (" and @monthDate = date_format(t.countDate,'%Y-%m') " ) ;
			}
		}else if(queryObj.type == '2'){
			sql += (" and t.countDate >= DATE_ADD(CURDATE(), INTERVAL -1 YEAR) " ) ;
		}
		
		
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				cityID : queryObj.cityID ,
				goodsID : queryObj.goodsID ,
				supplierID : queryObj.supplierID ,
				monthDate : queryObj.monthDate
			}
		});
		return JSON.parse(result);
	},
	
	
	/**
	 * 订单交易  按月统计
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj{ goodsID, supplierID, cityID, monthDate }
	 * @return [{supplierID, businessMonth, orderNumber-每月新增订单数量}]
	 */
	queryOrderAddByMonth:function(sqlAdapter, queryObj) {
		var sql = "select   u.supplierID     " +
				  "       , date_format(u.countDate,'%Y-%m') as countDate " +
				  "       , (select s.supplierName from supplier s where s.id = u.supplierID) as supplierName " +
				  "       , ifnull(sum(u.count) , 0 ) sumAmount  " +
   			      " from count_orderadd u " +
   			      " where 1 = 1 " +
   			      " and u.countDate >= DATE_ADD(CURDATE(), INTERVAL -1 YEAR)"
   			      ;
   			    
		if(queryObj.supplierID) {
			sql += (' and u.supplierID = @supplierID ' ) ;
		}
		if(queryObj.goodsID) {
			sql += (' and u.goodsID = @goodsID ' ) ;
		}
		if(queryObj.cityID) {
			sql += (' and u.cityID = @cityID' ) ;
		}
		sql += (" group by u.supplierID , date_format(u.countDate,'%Y-%m') ") ;
// 		sql += (" order by u.countDate ") ;
		
		if(!queryObj.supplierID){
			sql += ("	UNION ALL   ") ;
	   		sql += ( "select   'all' as supplierID " +
			          "       , date_format(u.countDate,'%Y-%m') as countDate " +
			          "       , '所有供应商' as supplierName " +
			          "       , ifnull(sum(u.count) , 0 ) sumAmount " +
	   			      " from count_orderadd u where 1 = 1 " +
	   			      " and u.countDate >= DATE_ADD(CURDATE(), INTERVAL -1 YEAR)"
	   			    ) ;
	   		if(queryObj.goodsID) {
				sql += (' and u.goodsID = @goodsID ' ) ;
			}
			if(queryObj.cityID) {
				sql += (' and u.cityID = @cityID' ) ;
			}	    
	   		sql += (" group by 'all', date_format(u.countDate,'%Y-%m') ") ;
		}
		
		
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				cityID : queryObj.cityID ,
				goodsID : queryObj.goodsID ,
				supplierID : queryObj.supplierID 
			}
//			param: {
//				supplierID : queryObj.cityID ,
//				businessStartDate : queryObj.goodsID ,
//				businessEndDate : queryObj.supplierID 
//			}
		});
		return JSON.parse(result);
	},
	/**
	 * 查询一定周期类所有的统计数据
	 */
	queryOrderDataByPeriod:function(sqlExecute,supplierID,cityID,goodsID,period){
		var sql="";
		var condition=(supplierID?" and supplierID=@supplierID ":"")
			+(cityID?" and cityID=@cityID ":"")
			+(goodsID?" and goodsID=@goodsID ":"")
			;
		logger.debug(condition);
		if(period=="0"){
			sql="select countTime as businessTime,count from count_orderadd where countDate<CURDATE() and countDate>=DATE_ADD(CURDATE(), INTERVAL -1 DAY) "
				+condition
				+" order by countDate asc,countTime asc "
				;
		}else if(period=="1"){
			sql="select countDate as businessTime,sum(count) as count from count_orderadd where countDate<CURDATE() and countDate>=DATE_ADD(CURDATE(), INTERVAL -1 WEEK) "
			+condition
			+" group by countDate"
			+" order by countDate asc,countTime asc "
			;
		}else if(period=="2"){
			sql="select countDate as businessTime,sum(count) as count from count_orderadd where countDate<CURDATE() and countDate>=DATE_ADD(CURDATE(), INTERVAL -1 MONTH) "
			+condition
			+" group by countDate"
			+" order by countDate asc,countTime asc "
			;
		}else if(period=="3"){
			sql="select date_format(countDate,'%Y-%m') as businessTime,sum(count) as count from count_orderadd where countDate<CURDATE() and countDate>=DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
			+condition
			+" group by date_format(countDate,'%Y-%m')"
			+" order by date_format(countDate,'%Y-%m') asc"
			;
		};
		logger.debug("===queryOrderDataByPeroid sql==="+sql);
		var result=JSON.parse(sqlExecute.query({
			sql:sql,
			param:{
				supplierID:supplierID,
				cityID:cityID,
				goodsID:goodsID
			}
		}));
		logger.debug("===queryOrderDataByPeroid result==="+JSON.stringify(result));
		return result;
	}
	
};
