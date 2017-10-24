var TradeDomain={
	queryTradeStatics:function(sqlExecute,startTime,endTime){
		var sql="select"  
				+" jys.countDate as countDate,"
				+" (select supplierName from supplier s where s.id=jys.supplierID) as supplierName,"
				+" (select cityName from city c where c.id=jys.cityID) as cityName,"
				+" (select goodsTypeName from goods g where g.id=jys.goodsID) as goodsTypeName,"
				+" (select goodsName from goods g where g.id=jys.goodsID) as goodsName,"
				+" sum(count) as jys,"
				//用户交易数
				+" (select count(*) from count_city_supplier_goods_userorderadd uo "
				+" where uo.supplierID=jys.supplierID and uo.cityID=jys.cityID and uo.goodsID=jys.goodsID " 
				+" and uo.countDate>=@startTime and uo.countDate<=jys.countDate) "
				+" as userJYS,"
				//rate
				+" (select count(*) from count_city_supplier_goods_userorderadd uo "
				+" where uo.supplierID=jys.supplierID and uo.cityID=jys.cityID and uo.goodsID=jys.goodsID  "
				+" and uo.countDate>=@startTime and uo.countDate<=jys.countDate)/"
				+" (select count(*) from count_city_supplier_useradd cu "
				+" where cu.supplierID=jys.supplierID and cu.cityID=jys.cityID and cu.goodsID=jys.goodsID  "
				+" and cu.countDate>=@startTime and cu.countDate<=jys.countDate) as rate,"
				//交易额
				+" (select sum(count) from count_turnoveradd ct "
				+" where ct.supplierID=jys.supplierID and ct.cityID=jys.cityID and ct.goodsID=jys.goodsID  and ct.countDate=jys.countDate)" 
				+" as jye"
				+" from count_orderadd jys "
				+" where jys.countDate>=@startTime and jys.countDate<=@endTime"
				+" group by jys.supplierID,jys.cityID,jys.goodsID,jys.countDate"
				+" order by jys.countDate asc"
				;
		var result=JSON.parse(sqlExecute.query({
			sql:sql,
			param:{
				startTime:startTime,
				endTime:endTime
			}
		}));
		return result;
	}
}