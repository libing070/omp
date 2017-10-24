/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 */
var CountUserAddDomain = {
	
	/**
	 * 根据城市查询用户注册统计信息 homePage
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj:{cityID}
	 * @return [{cityID 城市ID supplierID 供应商ID count 数量 createTime 统计日期 }]
	 */
	queryCountUserAddListByCityID:function(sqlAdapter, queryObj) {
		var sql = "select  date_format(createTime,'%Y-%m-%d') as createTime   " +
				  "       , ifnull(count(1),0) count  " +
   			      " from users where 1 = 1 " +
   			      "  and createTime >= DATE_SUB(curdate(),INTERVAL 1 MONTH) ";
   			    
		//如果 cityID 不传，则查询所有
//		if(queryObj.cityID) {
//			sql += (' and cityID = @cityID ' ) ;
//		}
		sql += (" group by  date_format(createTime,'%Y-%m-%d') ") ;
		sql += (" order by createTime desc") ;
		
		var result = sqlAdapter.query({
			sql: sql
		});
		return JSON.parse(result);
	},
	
	/**
	 * 统计累计注册用户　homePage
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj {cityID}
	 */
	queryCountUserAddSumByCityID:function(sqlAdapter, queryObj){
//		var sql = "select ifnull(sum(count),0) as totalUser from count_useradd " +
//		          " where countDate >= DATE_SUB(curdate(),INTERVAL 1 MONTH) ";
		var sql = "select IFNULL(count(1),0) as totalUser from users where 1=1 ";
   			    
		//如果 cityID 不传，则查询所有
//		if(queryObj.cityID) {
//			sql += (' and cityID = @cityID ' ) ;
//		}
		var result = sqlAdapter.query({
			sql: sql
		});
		return JSON.parse(result);
	},
	
	
	/**
	 * 新增用户趋势统计(按日统计)
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj {statisticsType , supplierID , registDate}
	 * @return {Object} [{}]
	 */
	queryCountUserByDay:function(sqlAdapter, queryObj) {
		var sql = " select  u.supplierID	" +
				 "	, date_format(u.countDate,'%Y-%m-%d')  countDate	" +
      			  "	, (select s.supplierName from supplier s where s.id = u.supplierID) as supplierName	" +
      			  "	, ifnull(sum(u.count),0 ) userNum			        " +
				  "	from count_useradd u " +
				  " where 1 = 1 " +
				  " and @registDate = date_format(u.countDate,'%Y-%m') 	"
				  ;
				  
		if(queryObj.supplierID){
			sql += (" and supplierID = @supplierID");
		}
		sql += (" group by u.supplierID , date_format(u.countDate,'%Y-%m-%d') ") ;
		
		//全部供应商
		if(!queryObj.supplierID){
			sql += ("	UNION ALL   ") ;
			sql += (  "   select  'all' as supplierID	" +
					  "	, date_format(u.countDate,'%Y-%m-%d')  countDate	" +
	      			  "	, '所有供应商' as supplierName	" +
	      			  "	, ifnull(sum(u.count),0 ) userNum			        " +
					  "	from count_useradd u " +
					  " where 1 = 1 " +
					  " and @registDate = date_format(u.countDate,'%Y-%m') 	"
					  )
					;
			sql += (" group by 'all' , date_format(u.countDate,'%Y-%m-%d') ") ;	
		}
   			  
		
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				registDate : queryObj.registDate ,
				supplierID : queryObj.supplierID 
			}
		});
		return JSON.parse(result);
	},
	
	/**
	 * 新增用户趋势统计(按月统计)
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj {statisticsType , supplierID}
	 * @return {Object} [{}]
	 */
	queryCountUserByMonth:function(sqlAdapter, queryObj) {
		var sql = " select  u.supplierID	" +
		      	  "	, date_format(u.countDate,'%Y-%m')  countDate	" +
      			  "	, (select s.supplierName from supplier s where s.id = u.supplierID) as supplierName	" +
      			  "	, ifnull(sum(u.count),0 ) userNum			 " +
				  "	from count_useradd u " +
				  "	where 1=1			 " +
				  " and u.countDate >= DATE_SUB(curdate(),INTERVAL 12 MONTH) "
				  ;
		
		if(queryObj.supplierID){
			sql += (" and supplierID = @supplierID");
		}
		
		sql += (" group by u.supplierID , date_format(u.countDate,'%Y-%m') ") ;
		//全部供应商
		if(!queryObj.supplierID){
			sql += ("	UNION ALL   ") ;
			sql += (  "   select  'all' as supplierID	" +
					  "	, date_format(u.countDate,'%Y-%m')  countDate	" +
	      			  "	, '所有供应商' as supplierName	" +
	      			  "	, ifnull(sum(u.count),0 ) userNum			        " +
					  "	from count_useradd u " +
					  " where 1 = 1 " +
					  " and u.countDate >= DATE_SUB(curdate(),INTERVAL 12 MONTH) "
					  )
					;
			sql += (" group by 'all' , date_format(u.countDate,'%Y-%m') ") ;	
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
	 * 新增用户总量统计
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj {supplierID }
	 * @return {Object} [{}]
	 */
	queryCountUser:function(sqlAdapter, queryObj){
		var sql = " select ifnull(sum(u.count),0) as allUserNumber" +
				  "	from count_useradd u" +
				  "	where 1=1			" 
				  ;
		
		if(queryObj.supplierID){
			sql += (" and supplierID = @supplierID");
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
	 * 供应商用户量比对
	 * @param {Object} sqlAdapter
	 * @param {Object} queryObj {startTime,endTime}
	 * @return {Object} [{}]
	 */
	queryCountUserContrast:function(sqlAdapter, queryObj) {
		var sql = " select  u.supplierID	" +
      			  "	, (select s.shortName from supplier s where s.id = u.supplierID) as supplierName	" +
      			  "	, date_format(u.countDate,'%Y-%m-%d')  countDate	" +
      			  "	, ifnull(sum(u.count),0 ) userNum			        " +
				  "	from count_useradd u " +
				  " where 1 = 1 " 
				  ;
				  
		if(queryObj.startTime && queryObj.endTime){
			sql += (" and u.countDate between @startTime and @endTime ");
		}
		sql += (" group by u.supplierID ") ;
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				startTime : queryObj.startTime ,
				endTime : queryObj.endTime 
			}
		});
		return JSON.parse(result);
	},
	
	/**
	 * 查询供应商用户量对比
	 * @param {Object} sqlExecute
	 * @param {Object} period
	 */
	queryRegistUserForSupplier:function(sqlExecute,period) {
		var sql="";
		if(period=="0"){
			sql="select supplierID,(select s.shortName from supplier s where s.id = supplierID) as supplierName,"
				+"count(1) as userNum from count_city_supplier_useradd  where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 DAY)"
				+"group by supplierID order by supplierID"
				;
		}else if(period=="1"){
			sql="select supplierID,(select s.shortName from supplier s where s.id = supplierID) as supplierName,"
				+"count(1) as userNum from count_city_supplier_useradd  where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 WEEK)"
				+"group by supplierID order by supplierID"
				;
		}else if(period=="2"){
			sql="select supplierID,(select s.shortName from supplier s where s.id = supplierID) as supplierName,"
				+"count(1) as userNum from count_city_supplier_useradd  where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 MONTH)"
				+"group by supplierID order by supplierID"
				;
		}else if(period=="3"){
			sql="select supplierID,(select s.shortName from supplier s where s.id = supplierID) as supplierName,"
				+"count(1) as userNum from count_city_supplier_useradd  where createTime<CURDATE() and createTime>=DATE_ADD(CURDATE(), INTERVAL -1 YEAR)"
				+"group by supplierID order by supplierID"
				;
		}
		
		var result=JSON.parse(sqlExecute.query({
			sql:sql,
			param:{
			}
		}));
		
		return result;
	}
	
	
};
