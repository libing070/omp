/**
*统计-城市/供应商/用户交易数Domain
**/
var CountUserOrderAddDomain={
	/**
	 * 查处交易数的原始数据
	 * @param sqlExecute
	 * @param period
	 */	
	queryUserOrderByPeriod:function(sqlExecute,period){
		var sql="";
		if(period=="0"){
			sql="select countTime as businessTime,count(userID) as count from count_city_supplier_goods_userorderadd where countDate<CURDATE() and countDate>=DATE_ADD(CURDATE(), INTERVAL -1 DAY) "
				+" group by countTime "
				+" order by countDate asc,countTime asc "
				;
		}else if(period=="1"){
			sql="select countDate as businessTime,count(userID) as count from count_city_supplier_goods_userorderadd where countDate<CURDATE() and countDate>=DATE_ADD(CURDATE(), INTERVAL -1 WEEK) "
			+" group by countDate"
			+" order by countDate asc,countTime asc "
			;
		}else if(period=="2"){
			sql="select countDate as businessTime,count(userID) as count from count_city_supplier_goods_userorderadd where countDate<CURDATE() and countDate>=DATE_ADD(CURDATE(), INTERVAL -1 MONTH) "
			+" group by countDate"
			+" order by countDate asc,countTime asc "
			;
		}else if(period=="3"){
			sql="select  date_format(countDate,'%Y-%m') as businessTime,count(userID) as count from count_city_supplier_goods_userorderadd where countDate<CURDATE() and countDate>=DATE_ADD(CURDATE(), INTERVAL -1 YEAR) "
			+" group by  date_format(countDate,'%Y-%m')"
			+" order by  date_format(countDate,'%Y-%m') asc"
			;
		};
		logger.debug("===queryUserOrderByPeroid sql==="+sql);
		var result=JSON.parse(sqlExecute.query({
			sql:sql,
			param:{
			}
		}));
		logger.debug("===queryUserOrderByPeroid result==="+JSON.stringify(result));
		return result;
	}
}