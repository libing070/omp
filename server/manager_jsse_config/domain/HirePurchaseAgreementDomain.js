/**
 * 分期计划领域对象
 */
var HirePurchaseAgreementDomain = {
	/**
	 * 描述：根据商品订单ID查询分期计划
	 * @param
	 * @return 
	 */
	findHirePurchaseAgreementByGoodsOrderID : function(sqlExecute, goodsOrderID){
//		var sqlExecute = sqlAdpterHandler.getInstance(false);
		var retStr = sqlExecute.query({
			sql : "select id,id as hirePurchaseAgreementID,payOrderID,userID,payDate,currentTime,sumAmount,sumTime,terminallyAmount,noPayAmount,userRepaymentSettingID,status,"
				  +"date_format(jqxStartTime,'%Y-%m-%d')as jqxStartTime,"
				  +"date_format(syxStartTime,'%Y-%m-%d')as syxStartTime,"
				  +"date_format(curFirstRepayDate,'%Y-%m-%d')as curFirstRepayDate,"
				  +"date_format(curEndRepayDate,'%Y-%m-%d')as curEndRepayDate,"
				  +"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from hirepurchaseagreement where payOrderID = (select payOrderID from goodsorder where id=@goodsOrderID)",
			param : {
				goodsOrderID : goodsOrderID
			},
			recordType:"object",
			resultType:"string"
		});
		var hirePurchaseAgreement = JSON.parse(retStr)[0];
		return hirePurchaseAgreement;
	},
	
	
	/**
	 * 描述：更新分期计划状态
	 * @param
	 * @return 
	 */
	updatehirePurchaseAgreementStatus : function(sqlExecute, hirePurchaseAgreementID, status){
//		var sqlExecute = sqlAdpterHandler.getInstance(true);
		var retStr = sqlExecute.execute({
			sql:"update hirepurchaseagreement set status=@status,lastUpdate=now() where id=@hirePurchaseAgreementID",
			param : {
				hirePurchaseAgreementID : hirePurchaseAgreementID,
				status : status
			},
			returnRowId:"false"
		});
	},
	
	
	/**
	 * 描述：根据分期付款计划ID查询分期还款计划
	 * @param
	 * @return 
	 */
	findHirePurchaseAgreementByID : function(sqlExecute, hirePurchaseAgreementID){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.id as hirePurchaseAgreementID,a.payOrderID,a.userID,a.payDate,a.currentTime,a.sumAmount,a.sumTime,a.terminallyAmount,"
				  +"a.noPayAmount,a.sumAmount-a.noPayAmount as payAmount,a.userRepaymentSettingID,a.status,"
				  +"(select carLicenseNO from payorder where userID=a.userID and id=a.payOrderID)as carLicenseNO,"
				  +"(select goodsName from payorder where userID=a.userID and id=a.payOrderID)as goodsName,"
				  +"date_format(a.jqxStartTime, '%Y-%m-%d')as jqxStartTime,"
				  +"date_format(a.syxStartTime, '%Y-%m-%d')as syxStartTime,"
				  +"date_format(a.curFirstRepayDate, '%Y-%m-%d')as curFirstRepayDate,"
				  +"date_format(a.curEndRepayDate, '%Y-%m-%d')as curEndRepayDate,"
				  +"date_format(a.createTime, '%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from hirepurchaseagreement a where a.id=@hirePurchaseAgreementID",
			param : {
				hirePurchaseAgreementID : hirePurchaseAgreementID
			},
			recordType:"object",
			resultType:"string"
		});
		var hirePurchaseAgreement = JSON.parse(retStr)[0];
		return hirePurchaseAgreement;
	},
	
	
	
	/**
	 * 描述：查询首次/第二次未还款用户总数
	 * @param {status}	2 第一次还款失败	3 第二次还款失败
	 * @return 
	 */
	getPayFailCount : function(sqlExecute, firstPayDate, lastPayDate, carOwner, phoneNO, licenseNO, status){
		var retStr = sqlExecute.query({
			sql : "select count(1)as count "
				  +"from hirepurchaseagreement a,payorder b where a.payOrderID=b.id and a.status=@status "
				  + (firstPayDate ? "and a.curFirstRepayDate = str_to_date(@firstPayDate, '%Y-%m-%d') " : "")
				  + (lastPayDate ? "and a.curEndRepayDate = str_to_date(@lastPayDate, '%Y-%m-%d') " : "")
				  + (carOwner ? "and b.carOwner like @carOwner " : "")
				  + (phoneNO ? "and b.carOwnerPhoneNO like @phoneNO " : "")
				  + (licenseNO ? "and b.carLicenseNO like @licenseNO " : ""),
			param : {
				firstPayDate : firstPayDate,
				lastPayDate : lastPayDate,
				carOwner : '%'+carOwner+'%',
				phoneNO : '%'+phoneNO+'%',
				licenseNO : '%'+licenseNO+'%',
				status : status
			},
			recordType:"object",
			resultType:"string"
		});
		var firstPayFailCount = JSON.parse(retStr)[0].count;
		return firstPayFailCount;
	},
	
	
	/**
	 * 描述：查询首次/第二次未还款用户列表
	 * @param {status}	2 第一次还款失败	3 第二次还款失败
	 * @return 
	 */
	listPayFail : function(sqlExecute, firstPayDate, lastPayDate, carOwner, phoneNO, licenseNO, status, sortFieldName, sortDir, pageNumber, pageSize){
		var retStr = sqlExecute.query({
			sql : "select a.id,a.id as hirePurchaseAgreementID,a.payOrderID,a.userID,a.payDate,a.currentTime,a.sumAmount,a.sumTime,a.terminallyAmount,"
				  +"a.noPayAmount,a.sumAmount-a.noPayAmount as payAmount,a.userRepaymentSettingID,a.status,"
				  +"b.carOwner,b.carOwnerPhoneNO,b.carLicenseNO,b.goodsName,b.payOrderCustomerNumber,"
				  +"date_format(a.jqxStartTime, '%Y-%m-%d')as jqxStartTime,"
				  +"date_format(a.syxStartTime, '%Y-%m-%d')as syxStartTime,"
				  +"date_format(a.curFirstRepayDate, '%Y-%m-%d')as curFirstRepayDate,"
				  +"date_format(a.curEndRepayDate, '%Y-%m-%d')as curEndRepayDate,"
				  +"date_format(a.createTime, '%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(a.lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate,"
				  +"(select count(1) from followuprecord where hirePurchaseAgreementID=a.id)as followUpRecordCount "
				  +"from hirepurchaseagreement a,payorder b where a.payOrderID=b.id and a.status=@status "
				  + (firstPayDate ? "and a.curFirstRepayDate = str_to_date(@firstPayDate, '%Y-%m-%d') " : "")
				  + (lastPayDate ? "and a.curEndRepayDate = str_to_date(@lastPayDate, '%Y-%m-%d') " : "")
				  + (carOwner ? "and b.carOwner like @carOwner " : "")
				  + (phoneNO ? "and b.carOwnerPhoneNO like @phoneNO " : "")
				  + (licenseNO ? "and b.carLicenseNO like @licenseNO " : "")
				  + (sortFieldName=='firstPayDate' ? " order by a.curFirstRepayDate "+sortDir : "")
				  + (sortFieldName=='lastPayDate' ? " order by a.curEndRepayDate "+sortDir : "")
				  +" limit "+(pageNumber-1)*pageSize+","+pageSize,
			param : {
				firstPayDate : firstPayDate,
				lastPayDate : lastPayDate,
				carOwner : '%'+carOwner+'%',
				phoneNO : '%'+phoneNO+'%',
				licenseNO : '%'+licenseNO+'%',
				status : status
			},
			recordType:"object",
			resultType:"string"
		});
		var firstPayFailList = JSON.parse(retStr);
		return firstPayFailList;
	},
	
	
	/**
	 * 描述：查询还款电话跟进列表
	 * @param 
	 * @return 
	 */
	listFollowUpRecord : function(sqlExecute, hirePurchaseAgreementID){
		var retStr = sqlExecute.query({
			sql : "select id,id as followUpID,hirePurchaseAgreementID,content,"
				  +"date_format(createTime, '%Y-%m-%d %H:%i:%s')as createTime,"
				  +"date_format(lastUpdate, '%Y-%m-%d %H:%i:%s')as lastUpdate "
				  +"from followuprecord where hirePurchaseAgreementID=@hirePurchaseAgreementID order by lastUpdate DESC",
			param : {
				hirePurchaseAgreementID : hirePurchaseAgreementID
			},
			recordType:"object",
			resultType:"string"
		});
		var followUpRecordList = JSON.parse(retStr);
		return followUpRecordList;
	},
	
	
	/**
	 * 描述：新增还款电话跟进记录
	 * @param 
	 * @return 
	 */
	addFollowUpRecord : function(sqlExecute, hirePurchaseAgreementID, content){
		var followUpRecordID = sqlExecute.execute({
			sql:"insert into followuprecord(hirePurchaseAgreementID,content,createTime,lastUpdate) "
				+"values(@hirePurchaseAgreementID,@content,now(),now())",
			param : {
			   hirePurchaseAgreementID : hirePurchaseAgreementID,
			   content : content
			},
			returnRowId : true
		});
		return followUpRecordID;
	},
	
	/**
	 * 账单还款统计 分析
	 * @param{Object} queryObj{goodsID , cityID , payDateStart ,payDateEnd , failStatus , normalStatus }
	 * @return {Object} [{billType,billNumber,advancedAmount,payfee,surplusPayfee}]
	 */
	queryPayCondition:function(sqlAdapter, queryObj){
		var sql = 
			"	select '2' as billType  " +              //二次还款失败
			"	, count(1) as billNumber           " +                  // 数量
     		"	, ifnull( sum(h.sumAmount), 0) advancedAmount      " +  //垫付金额
     		"	, ifnull( ( sum(h.sumAmount) - sum(h.noPayAmount) ), 0) payfee     " +   // 已还款金额
     		"	, ifnull( sum(h.noPayAmount), 0) surplusPayfee              " +          // 未还款金额
  			"	from hirepurchaseagreement h   " +  
 			"	where h.status in ( " + (queryObj.failStatus).join(",")+ ")        "     // 二次还款失败        
   		 	;
		
		if(queryObj.payDateStart && queryObj.payDateEnd){
			   // 还款日期
			sql += (" and h.firstRepayDate between @payDateStart and @payDateEnd     " );
		}

   		// 过滤 商品、城市
   		if(queryObj.goodsID){
   			sql += 
   			(
   				"	and exists                   " +  
				"	( select 1 from payorder p    " +  
				"			      where p.id = h.payOrderID   " +  
        		"	      and p.goodsID = @goodsID )  "
   			)
   		}
   		if(queryObj.cityID){
   			sql += 
   			(
   				"	and exists                   " +  
				"	( select 1 from payorder p    " +  
				"			      where p.id = h.payOrderID   " +  
        		"	      and p.cityID = @cityID )   " 
   			)
   		}
		
		sql += ("	UNION ALL   ")
		
		sql += (
			"	select '1'  as billType                           " +  // 正常还款计划
			"	, count(1)  as billNumber                         " +  // 数量
     		"	, ifnull( sum(h.sumAmount), 0) advancedAmount     " +  // 垫付金额
     		"	, ifnull( ( sum(h.sumAmount) - sum(h.noPayAmount) ), 0) payfee    " +  // 已还款金额 (垫付金额-未还款金额)
     		"	, ifnull( sum(h.noPayAmount), 0) surplusPayfee                    " +  // 总未还款金额
  			"	from hirepurchaseagreement h    " +  
 			"	where h.status in ( " + (queryObj.normalStatus).join(",")+ " )    "    // 正常还款计划
        	);
		
		if(queryObj.payDateStart && queryObj.payDateEnd){
			// 还款日期
			sql += (" and h.firstRepayDate between @payDateStart and @payDateEnd     " );
		}
		
		// 过滤 商品、城市
   		if(queryObj.goodsID){
   			sql += 
   			(
   				"	and exists                   " +  
				"	( select 1 from payorder p    " +  
				"			      where p.id = h.payOrderID   " +  
        		"	      and p.goodsID = @goodsID  )   " 
   			)
   		}
   		if(queryObj.cityID){
   			sql += 
   			(
   				"	and exists                   " +  
				"	( select 1 from payorder p    " +  
				"			      where p.id = h.payOrderID   " +  
        		"	      and p.cityID = @cityID )   " 
   			)
   		}
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				cityID : queryObj.cityID ,
				goodsID : queryObj.goodsID ,
				payDateStart :　queryObj.payDateStart ,
				payDateEnd : queryObj.payDateEnd
			}
		});
		return JSON.parse(result);
	} ,
	
	/**
	 * 坏账还款计划分析
	 * @param{Object} queryObj{goodsID , cityID , payDateStart ,payDateEnd, failStatus}
	 * @return {Object}[{currentTime,billNumber,advancedAmount,payfee,surplusPayfee}]
	 */
	queryPayPlanForFail:function(sqlAdapter, queryObj){
		var sql = " select "
        	+ "	  h.currentTime as     currentTime " // 当前期数
			+ "	, count(1)      as     billNumber  " // 数量
     		+ "	, ifnull( sum(h.sumAmount) , 0)  as  advancedAmount " 	// 垫付金额
     		+ "	, ifnull( sum(h.terminallyAmount) , 0) * count(1) *( h.currentTime - 1)   as payfee " //已还款金额 (每期还款总金额 * 数量 * (已还款期数:当前期数-1))
     		+ "	, ifnull( sum(h.noPayAmount) , 0)  as surplusPayfee  " 	// 未还款金额
  			+ "	from hirepurchaseagreement h " 
 			+ "	where 1=1 "      
 			+ "   and h.status in (" +(queryObj.failStatus).join(",") + ")   "   // 二次还款失败
   		;
   		
   		if(queryObj.payDateStart && queryObj.payDateEnd){
			   // 还款日期
			sql += (" and h.firstRepayDate between @payDateStart and @payDateEnd     " );
		}
   		
   		// 过滤商品ID
   		if(queryObj.goodsID){
   			sql += 
   			(
   				"	and exists                    " +  
				"	( select 1 from payorder p    " +  
				"			      where p.id = h.payOrderID   " +  
        		"	      and p.goodsID = @goodsID )" 
   			)
   		}
   		// 过滤城市ID
   		if(queryObj.cityID){
   			sql += 
   			(
   				"	and exists                   " +  
				"	( select 1 from payorder p    " +  
				"			      where p.id = h.payOrderID   " +  
        		"	      and p.cityID = @cityID )   " 
   			)
   		}
   		
   		sql += ("	group by h.currentTime " ) ; 
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				cityID : queryObj.cityID ,
				goodsID : queryObj.goodsID ,
				payDateStart :　queryObj.payDateStart ,
				payDateEnd : queryObj.payDateEnd
			}
		});
		
		return JSON.parse(result);
	}
	
};