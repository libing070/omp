/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 */
var CountTurnoverAddDomain = {
	
	/**
	 * 根据城市查询交易额统计信息
	 * @param {Object} sqlAdapter
	 * @param {Object} cityID
	 * @return [{cityID 城市ID supplierID 供应商ID goodsID 商品ID count 数量 countDate 统计日期 }]
	 */
	queryTurnoverListByCityID:function(sqlAdapter, cityID) {
		var sql = "select   date_format(countDate,'%Y-%m-%d') as countDate    " +
				  "       , ifnull(sum(count),0) count  " +
   			      " from count_turnoveradd where 1 = 1 " +
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
	 * 根据城市ID 统计交易额  日期区间
	 * @param {Object} sqlAdapter
	 * @param {Object} cityID
	 * return 
	 */
	queryCountTurnoverByCityID:function(sqlAdapter, cityID){
//		var sql = "select ifnull(sum(count),0) as totalAmount from count_turnoveradd " +
//		          " where countDate >= DATE_SUB(curdate(),INTERVAL 1 MONTH) ";

		var sql = "select ifnull(sum(count),0) as totalAmount from count_turnoveradd where 1=1 ";
   			    
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
	 * 根据日期区间查询 统计供应商交易额
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj {supplierID,businessStartDate,businessEndDate}
	 * @return [{supplierID, supplierName, count}]
	 */
	queryTurnoverListByDay:function(sqlAdapter, queryObj) {
		var sql = "select   u.supplierID    " +
		          "       , (select s.shortName from supplier s where s.id = u.supplierID) as supplierName " +
		          "       , ifnull(sum(u.count),0) amount  " +
   			      "  from count_turnoveradd u " +
   			      " where 1 = 1 "  +
   			      "   and u.countDate between @businessStartDate and @businessEndDate "
   			      ;
		
		if(queryObj.supplierID){
   			sql += ( " and u.supplierID = @supplierID " );
   		}
   		sql += (" group by u.supplierID ") ;
   		sql += (" order by u.countDate ") ;
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				supplierID : queryObj.supplierID ,
				businessStartDate : queryObj.businessStartDate ,
				businessEndDate : queryObj.businessEndDate
			}
		});
		return JSON.parse(result);
	},
	
	/**
	 * 根据日期区间查询 统计供应商交易总额
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj {supplierID,businessStartDate,businessEndDate}
	 * @return [{sumAmount}]
	 */
	queryCountTurnoverByDay:function(sqlAdapter, queryObj){
		var sql = "select ifnull(sum(u.count),0) sumAmount  " +
   			      " from count_turnoveradd u  " +
   			      " where 1 = 1 " +
   			      " and u.countDate between @businessStartDate and @businessEndDate "
   			      ;
   			      
   		if(queryObj.supplierID){
   			sql += ( " and u.supplierID = @supplierID " );
   		}

		var result = sqlAdapter.query({
			sql: sql,
			param: {
				supplierID : queryObj.supplierID ,
				businessStartDate : queryObj.businessStartDate ,
				businessEndDate : queryObj.businessEndDate
			}
		});
		return JSON.parse(result);
	},
	
	/**
	 * 根据供应商ID 获取最近一年交易额   按年月分组
	 * @param {Object} queryObj{supplierID}
	 * @return [{businessMonth, supplierID, amount}]
	 */
	queryTurnoverListByMonth:function(sqlAdapter, queryObj){
		var sql = "select   u.supplierID " +
		          "       , date_format(u.countDate,'%Y-%m') as businessMonth    " +
		          "       , (select s.supplierName from supplier s where s.id = u.supplierID) as supplierName " +
		          "       , ifnull(sum(u.count),0) amount  " +
   			      " from count_turnoveradd u where 1 = 1 " +
   			      " and u.countDate >= DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
   			      ;
		if(queryObj.supplierID){
   			sql += ( " and u.supplierID = @supplierID " );
   		}
		sql += (" group by u.supplierID, date_format(u.countDate,'%Y-%m') ") ;
// 		sql += (" order by u.countDate ") ;
   		
   		//全部供应商
   		if(!queryObj.supplierID){
   			sql += ("	UNION ALL   ") ;
	   		sql += ( "select   'all' as supplierID " +
			          "       , date_format(u.countDate,'%Y-%m') as businessMonth    " +
			          "       , '所有供应商' as supplierName " +
			          "       , ifnull(sum(u.count),0) amount  " +
	   			      " from count_turnoveradd u where 1 = 1 " +
	   			      " and u.countDate >= DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
	   			    ) ;
	   		sql += (" group by 'all', date_format(u.countDate,'%Y-%m') ") ;
	// 		sql += (" order by u.countDate ") ;  
   		}
   		
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				supplierID : queryObj.supplierID 
			}
		});
		return JSON.parse(result);
	},
	
	/**
	 * 根据供应商ID 获取最近一年交易总额
	 * @param {Object} supplierID
	 * @return[{}]
	 */
	queryCountTurnoverByMonth:function(sqlAdapter, queryObj){
		var sql = "select ifnull(sum(u.count),0) sumAmount  " +
   			      "  from count_turnoveradd u  where 1 = 1 " +
   			       " and u.countDate >= DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
   			      ;
   			      
   		if(queryObj.supplierID){
   			sql += ( " and u.supplierID = @supplierID " );
   		}

		var result = sqlAdapter.query({
			sql: sql,
			param: {
				supplierID : queryObj.supplierID 
			}
		});
		return JSON.parse(result);
	} ,
	
	/**
	 * 商品交易按日统计
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj {goodsID,cityID,businessStartDate,businessEndDate}
	 * @return [{goodsID,amount}]
	 */
	queryGoodsByDay:function(sqlAdapter, queryObj){
		var sql = " select  " +
   			      "   t.goodsID " +
   			      " , (select g.goodsName from goods g where g.id = goodsID) as goodsName" +
   			      " , ifnull(sum(t.count),0) as amount " +
   			      "   from count_turnoveradd t " +
   			      " where 1=1 " +
   			      "   and t.countDate between @businessStartDate and @businessEndDate"
   			      ;
   			      
   		if(queryObj.goodsID){
   			sql += ( " and t.goodsID = @goodsID " );
   		}
   		if(queryObj.cityID){
   			sql += ( " and t.cityID = @cityID " );
   		}

		sql += (" group by t.goodsID ") ;
   		sql += (" order by t.countDate ") ;
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				goodsID : queryObj.goodsID ,
				cityID : queryObj.cityID ,
				businessStartDate : queryObj.businessStartDate ,
				businessEndDate : queryObj.businessEndDate 
			}
		});
		return JSON.parse(result);
	} ,
	
	/**
	 * 商品交易按日统计 (获取交易总金额)
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj {goodsID,cityID,businessStartDate,businessEndDate}
	 * @return [{goodsID,amount}]
	 */
	queryCountGoodsByDay:function(sqlAdapter, queryObj){
		var sql = " select  " +
   			      "   ifnull(sum(t.count),0) as sumAmount " +
   			      "   from count_turnoveradd t " +
   			      " where 1=1 " +
   			      "   and t.countDate between @businessStartDate and @businessEndDate"
   			      ;
   			      
   		if(queryObj.goodsID){
   			sql += ( " and t.goodsID = @goodsID " );
   		}
   		if(queryObj.cityID){
   			sql += ( " and t.cityID = @cityID " );
   		}
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				goodsID : queryObj.goodsID ,
				cityID : queryObj.cityID ,
				businessStartDate : queryObj.businessStartDate ,
				businessEndDate : queryObj.businessEndDate 
			}
		});
		return JSON.parse(result);
	} ,
	
	
	/**
	 * 商品交易按月统计
	 * @param {Object} queryObj{goodsID,cityID}
	 * @return [{businessMonth, amount}]
	 */
	queryGoodsByMonth:function(sqlAdapter, queryObj){
		var sql = "select   "  +
		          "   date_format(u.countDate,'%Y-%m') as businessMonth " +
		          " , ifnull(sum(u.count),0) amount  " +
   			      " from count_turnoveradd u  " +
   			      " where 1 = 1 " +
   			      " and u.countDate >= DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
   			      ;
		
		if(queryObj.goodsID){
   			sql += ( " and u.goodsID = @goodsID " );
   		}
   		if(queryObj.cityID){
   			sql += ( " and u.cityID = @cityID " );
   		}
		
		sql += (" group by date_format(u.countDate,'%Y-%m') ") ;
   		sql += (" order by u.countDate ") ;
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				goodsID : queryObj.goodsID ,
				cityID:queryObj.cityID
			}
		});
		return JSON.parse(result);
	} ,
	
	/**
	 * 商品交易按月统计 (获取交易总金额)
	 * @param {Object} queryObj{goodsID,cityID}
	 * @return [{sumAmount}]
	 */
	queryCountGoodsByMonth:function(sqlAdapter, queryObj){
		var sql = " select   "  +
		          "  ifnull(sum(u.count),0) as sumAmount  " +
   			      " from count_turnoveradd u " +
   			      " where 1 = 1  " + 
   			      " and u.countDate >= DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
   			      ;
		
		if(queryObj.goodsID){
   			sql += ( " and u.goodsID = @goodsID " );
   		}
   		if(queryObj.cityID){
   			sql += ( " and u.cityID = @cityID " );
   		}
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				goodsID : queryObj.goodsID ,
				cityID:queryObj.cityID
			}
		});
		return JSON.parse(result);
	},
	/**
	 * 查询交易额的统计
	 * @param sqlExecute
	 * @param period
	 */
	queryOrderTurnoverByPeriod:function(sqlExecute,supplierID,cityID,goodsID,period){
		var sql="";
		var condition=(supplierID?" and supplierID=@supplierID ":"")
			+(cityID?" and cityID=@cityID ":"")
			+(goodsID?" and goodsID=@goodsID ":"")
			;
		logger.debug(condition);
		if(period=="0"){
			sql="select countTime as businessTime,count from count_turnoveradd where countDate>=DATE_ADD(CURDATE(), INTERVAL -1 DAY) "
				+condition
				+" order by countDate asc,countTime asc "
				;
		}else if(period=="1"){
			sql="select countDate as businessTime,sum(count) as count from count_turnoveradd where countDate>=DATE_ADD(CURDATE(), INTERVAL -1 WEEK) "
			+condition
			+" group by countDate"
			+" order by countDate asc,countTime asc "
			;
		}else if(period=="2"){
			sql="select countDate as businessTime,sum(count) as count from count_turnoveradd where countDate>=DATE_ADD(CURDATE(), INTERVAL -1 MONTH) "
			+condition
			+" group by countDate"
			+" order by countDate asc,countTime asc "
			;
		}else if(period=="3"){
			sql="select date_format(countDate,'%Y-%m') as businessTime,sum(count) as count from count_turnoveradd where countDate>=DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
			+condition
			+" group by date_format(countDate,'%Y-%m')"
			+" order by date_format(countDate,'%Y-%m') asc "
			;
		};
		logger.debug("===queryOrderTurnoverByPeroid sql==="+sql);
		var result=JSON.parse(sqlExecute.query({
			sql:sql,
			param:{
				supplierID:supplierID,
				cityID:cityID,
				goodsID:goodsID
			}
		}));
		logger.debug("===queryOrderTurnoverByPeroid result==="+JSON.stringify(result));
		return result;
	}
	
	
};
