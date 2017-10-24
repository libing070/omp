/**
 * 	功能：新增商品基本信息
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SystemDomain.js");
load("/domain/GoodsDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	//商品编码
	var goodsCustomNumber = param.goodsCustomNumber;	
	//商品名称
	var goodsName = param.goodsName;	
	//商品描述
	var goodsDescription = param.goodsDescription
	//产品线ID
	var goodsTypeID = param.goodsTypeID;
	//保险种类
	var insureType	= param.insureType;
	//保障方案ID
	var protectPlanID = param.protectPlanID ? Number(param.protectPlanID) : null;
	//起保间隔当天最小小时
	var minIntervalTime = param.minIntervalTime;	
	//购买最少天数
	var minDay = param.minDay;	
	//服务费率
	var serviceRate	 = param.serviceRate;	
	
	try {
		if(!goodsCustomNumber || !goodsName || !goodsDescription || !goodsTypeID
			|| !insureType || !protectPlanID || !minIntervalTime || !minDay || !serviceRate) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
			
		//判断商品自定义编码是否重复，如果重复，不允许新增
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		var id;
		var numCount = GoodsDomain.checkGoodsCustomNumber(sqlAdapter,id,goodsCustomNumber);
		if(numCount >0) {
			logger.error("商品编码重复");
			errorResponse(7011);
			return;
		}
		
		//判断商品名称是否重复，如果重复，不允许新增
		var nameCount = GoodsDomain.checkGoodsName(sqlAdapter,id,goodsName);
		if(nameCount >0) {
			logger.error("商品名称重复");
			errorResponse(7012);
			return;
		}
		//获取产品线名称
		var goodsTypeName = SystemDomain.getGoodsTypeName(sqlAdapter,goodsTypeID);
		
		//如果产品类别为：车险白条，则支付方式为分期付款。
		var payType;
		if(goodsTypeID == "2") {
			payType = "2";
		}else {
			payType = "1";
		}
		//定义商品基本信息对象
		var goodsObj = {
			goodsCustomNumber:goodsCustomNumber,
			goodsName:goodsName,
			goodsDescription:goodsDescription,
			goodsTypeID:goodsTypeID,
			goodsTypeName:goodsTypeName,
			insureType:insureType,
			protectPlanID:protectPlanID,
			payType:payType,//支付方式
			minIntervalTime:minIntervalTime,
			minDay:minDay,
			kindType:"1",	//险种类型，1-商业险，2-交强险
			serviceRate:serviceRate,
			goodsStatus:"1",//新增的商品状态，默认为1-草稿
			status:"N",		//默认为N-正常
			priority:"1"  //新增时，排序默认为1
		};
		
		var goodsID = GoodsDomain.addGoodsBaseInfo(sqlAdapter,goodsObj);
		
		sqlAdapter.commitAndClose();//提交事务
			
		$_response_$={
			errorCode:0,
			data:{
				goodsID:goodsID
			}
			
		};
	} catch (e) {
		logger.error("新增商品基本信息失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
