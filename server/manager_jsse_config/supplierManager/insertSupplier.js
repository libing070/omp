/**
 * 	功能：新增供应商
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SupplierDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	//供应商编码
	var supplierNumber = param.supplierNumber;
	//供应商名称
	var supplierName = param.supplierName;
	//供应商简称
	var shortName = param.shortName;
	//客服电话
	var contactPhone = param.contactPhone;
	//理赔电话
	var claimPhone = param.claimPhone;
	//合作开始时间
	var	cooperationStartTime = param.cooperationStartTime;
	//合作结束时间
	var cooperationEndTime = param.cooperationEndTime;
	
	try {
		if(!supplierNumber || !supplierName|| !shortName || !contactPhone || !claimPhone) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		
		//查询供应商编码是否已经存在，如果已经存在，则提示重复不允许新增
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var supplierID;
		var numberCount = SupplierDomain.checkSupplierNumber(sqlAdapter,supplierID,supplierNumber);
		if(numberCount > 0) {
			logger.error("供应商编码："+supplierNumber+" 重复，请重新填写");
			errorResponse(7021);
			return;
		}
		
		//查询供应商名称或简称是否已经存在，如果已经存在，则提示重复不允许新增
		var nameCount = SupplierDomain.checkSupplierName(sqlAdapter,supplierID,supplierName);
		if(nameCount > 0) {
			logger.error("供应商名称："+supplierName+" 重复，请重新填写");
			errorResponse(7003);
			return;
		}
		
		var shortNameCount = SupplierDomain.checkShortName(sqlAdapter,supplierID,shortName);
		if(shortNameCount > 0) {
			logger.error("供应商简称："+shortName+" 重复，请重新填写");
			errorResponse(7004);
			return;
		}
		
		var supplierObj={
			supplierNumber:supplierNumber,
			supplierName:supplierName,
			shortName:shortName,
			contactPhone:contactPhone,
			claimPhone:claimPhone,
			cooperationStartTime:cooperationStartTime?cooperationStartTime:null,
			cooperationEndTime:cooperationEndTime?cooperationEndTime:null,
			status:'N'
		};
		var supplierID = SupplierDomain.addSupplier(sqlAdapter,supplierObj);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0,
			data:
				{
					supplierID:supplierID
				}
		};
	} catch (e) {
		logger.error("新增供应商失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
