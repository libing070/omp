/**
 * 	功能：编辑产品与供应商的关系
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
	//产品与供应商、城市的关系ID
	var goodsTypeCitySupplierRelID	= param.goodsTypeCitySupplierRelID; 
	//报价方式	1 人工报价	2 自动报价
	var quoteMode = param.quoteMode;
	//投保方式	1 人工投保	2 自动投保
	var insuredMode = param.insuredMode;
	//联系人
	var contactName = param.contactName;
	//联系电话
	var contactPhone = param.contactPhone;
	//邮箱
	var email = param.email;		

	
	try {
		var gTypeSupRelObj = {
			goodsTypeCitySupplierRelID:goodsTypeCitySupplierRelID,
			quoteMode:quoteMode,
			insuredMode:insuredMode,
			contactName:contactName,
			contactPhone:contactPhone,
			email:email
		};
		
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		SupplierDomain.updateRelOfGTypeSup(sqlAdapter,gTypeSupRelObj);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
		};
	} catch (e) {
		logger.error("编辑产品与供应商的关系失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
