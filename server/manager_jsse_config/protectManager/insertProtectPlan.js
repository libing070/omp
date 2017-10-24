/**
 * 	功能：新增保障方案
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/ProtectPlanDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//保障方案名称
	var protectPlanName = param.protectPlanName;
	//保障方案险别详情列表
	var protectDetailList = param.protectDetailList;
	
	
	try {
		if(!protectPlanName || protectDetailList.length < 1) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter=sqlAdpterHandler.getInstance(true);
		//校验保障方案名称是否已经存在，如果已经存在，则提示重复不允许新增
		var id;
		var nameCount = ProtectPlanDomain.checkProtectPlanDetail(sqlAdapter,id,protectPlanName);
		if(nameCount >0) {
			logger.error("保障方案名称重复，请重新填写");
			errorResponse(7009);
			return;
		}
		
		//新增保障方案(主表)
		var protectPlanObj = {
			protectPlanName:protectPlanName,
			status:'N'
		};
		var protectPlanID = ProtectPlanDomain.addProtectPlan(sqlAdapter,protectPlanObj);
		//新增保障方案详情
		var detailList = new Array();
		var detailObj;
		var isFree;
		for(var i=0;i<protectDetailList.length;i++) {
			if(protectDetailList[i].isFree == "1") {
				isFree = "1";
			}else {
				isFree = "0";
			}
			
			detailObj = {
				protectPlanID:protectPlanID,
				kindID:protectDetailList[i].kindID,
				amount:protectDetailList[i].amount,
				mainFlag:protectDetailList[i].mainFlag,
				isFree:isFree
			};
			
			logger.debug("amount----"+protectDetailList[i].amount);
			logger.debug("isFree----"+protectDetailList[i].isFree);
			
			detailList.push(detailObj);
		}
		ProtectPlanDomain.addProtectPlanDetail(sqlAdapter,detailList);
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0,
			data:{
				protectPlanID:protectPlanID
			}
			
		};
	} catch (e) {
		logger.error("新增保障方案失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
