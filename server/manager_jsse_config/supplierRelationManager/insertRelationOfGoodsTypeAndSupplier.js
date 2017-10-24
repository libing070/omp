/**
 * 	功能：新增产品与供应商的关系
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
	
	//产品线ID
	var goodsTypeID = param.goodsTypeID;	
	//产品线名称
	var goodsTypeName = param.goodsTypeName;
	//城市ID
	var cityID = param.cityID;			
	//城市名称
	var cityName = 	param.cityName;				
	//供应商ID
	var supplierID = param.supplierID;	
	//报价方式	1 人工报价	2 自动报价
	var quoteMode = param.quoteMode;				
	//投保方式	1 人工投保	2 自动投保
	var insuredMode = param.insuredMode;
	//供应商名称
	var supplierName = param.supplierName;	
	//联系人
	var contactName = param.contactName;
	//联系电话
	var contactPhone = param.contactPhone;
	//邮箱
	var email = param.email;		

	
	try {
		if(!goodsTypeID|| !cityID || !supplierID || !quoteMode || !insuredMode) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		//判断产品类别+供应商+城市 是否重复，如果重复，则不允许新增
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var relList = SupplierDomain.queryRelOfGTypeSup(sqlAdapter,goodsTypeID,cityID,supplierID);
		if(relList.length >0 ) {
			logger.error("产品线+供应商+城市不可重复，请重新选择");
			errorResponse(7008);
			return;
		}
		var status='N';
		//查询城市和供应商的关系
		var citySupplierID = SupplierDomain.findRelOfCitySup(sqlAdapter,cityID,supplierID);
		if(!citySupplierID) {
			//新增城市和供应商的关系
			var citySupRelObj = {
				supplierID:supplierID,
				cityID:cityID,
				status:status
			};
		
			citySupplierID = SupplierDomain.addRelOfCitySup(sqlAdapter,citySupRelObj);
		}
		
		//新增产品线和城市供应商的关系
		var gTypeSupRelObj = {
			goodsTypeID:goodsTypeID,
			citySupplierID:citySupplierID,
			quoteMode:quoteMode,
			insuredMode:insuredMode,
			contactName:contactName,
			contactPhone:contactPhone,
			email:email,
			status:status,
			share:"1"    //新增时，默认份额为1
		};
		var goodsTypeCitySupplierRelID = SupplierDomain.addRelOfGTypeSup(sqlAdapter,gTypeSupRelObj);
		
		$_response_$={
			errorCode:0,
			data:{
					citySupplierID:citySupplierID,		//城市和供应商关系ID
					goodsTypeCitySupplierRelID:goodsTypeCitySupplierRelID	//产品与城市供应商关系ID
			}
			
		};
		sqlAdapter.commitAndClose();//提交事务
		
	} catch (e) {
		logger.error("新增产品与城市供应商的关系失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
