/**
 * 	功能：新增供应商险别代码
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SupplierKindDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	//供应商ID
	var supplierID = param.supplierID;
	//险别ID
	var kindID = param.kindID;
	//供应商险别代码
	var supplierKindCode = param.supplierKindCode;

	
	try {
		if(!supplierID || !kindID || !supplierKindCode) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		
		//校验此供应商下的平台险种代码是否重复，如果重复，不允许新增
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var kindIDCount = SupplierKindDomain.checkSupplierKindID(sqlAdapter,supplierID,kindID);
		if(kindIDCount > 0) {
			logger.error("此供应商下的平台险种代码重复，请重新选择");
			errorResponse(7006);
			return;
		}
		
		//校验供应商险别代码是否存在，如果存在重复，不允许新增
		var supplierKindID;
		var kindCodeCount = SupplierKindDomain.checkSupplierKindCode(sqlAdapter,supplierID,supplierKindCode,supplierKindID);
		if(kindCodeCount > 0) {
			logger.error("供应商险种代码重复，请重新输入");
			errorResponse(7007);
			return;
		}
		
		var supplierKindObj = {
			supplierID:supplierID,
			kindID:kindID,
			supplierKindCode:supplierKindCode,
			status:'N'
		};
		var supplierKindID = SupplierKindDomain.addSupplierKind(sqlAdapter,supplierKindObj);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0,
			data:
				{
					supplierKindID:supplierKindID
				}
		};
	} catch (e) {
		logger.error("新增供应商险别代码失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
