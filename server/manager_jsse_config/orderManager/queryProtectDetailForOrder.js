/**
 * 	功能：查看商品订单保障方案详情
 *  @author niuxiaojie
 */
(function(request, header) {
	var goodsOrderID = request.goodsOrderID; //商品订单ID
	var lo = createLogic();
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	if(!goodsOrderID){
		logger.error("请求没有携带商品订单ID");
		errorResponse(-1);
		return;
	}
	var sqlExecute = sqlAdpterHandler.getInstance(false);
	//查询电子保单详情
	var policyInfo = lo.findPolicyByGoodsOrderID(sqlExecute, goodsOrderID);
	if(!policyInfo){
		logger.error("没有查询到商品订单ID[" + goodsOrderID + "]对应的电子保单");
		errorResponse(7104);
		return;
	}
	
	//查询电子保单保障方案详情
	var protectDetailList;
	if(policyInfo.goodsTypeID=='2' && policyInfo.kindType=='1'){	//车险白条(商业险)，查询保单险别明细
		protectDetailList = lo.listProtectDetail(sqlExecute, policyInfo.policyID);
	}else if(policyInfo.goodsTypeID=='1'){	//天天保，查询商品对应的保障方案
		protectDetailList = lo.getGoodsProtectPlanDetail(sqlExecute, policyInfo);
	}
	
	logger.debug("-----------保障方案详情-----------" + JSON.stringify(protectDetailList));

	policyInfo.kindList = protectDetailList;
	
	$_response_$ = {
		errorCode: 0,
		data: policyInfo
	};
})($_request_param_$, $_request_header_$);


function createLogic() {
	load("/common/_errorCode.js");
	load("/domain/DBUtils.js");
	load("/domain/PolicyDomain.js");
	load("/domain/GoodsDomain.js");
	load("/domain/ProtectPlanDomain.js");
	load("/common/_importConfig.js");
	load("/lib/authCheck.js");
	var lo = {
		//查询电子保单详情
		findPolicyByGoodsOrderID : function(sqlExecute, goodsOrderID){
			var policyInfo = PolicyDomain.findPolicyByGoodsOrderID(sqlExecute, goodsOrderID);
			return policyInfo;
		},
		//查询电子保单保障方案详情
		listProtectDetail : function(sqlExecute, policyID){
			var protectDetailList = PolicyDomain.listProtectDetail(sqlExecute, policyID);
			return protectDetailList;
		},
		//查询商品对应的保障方案详情
		getGoodsProtectPlanDetail : function(sqlExecute, policyInfo){
			var protectDetailList = new Array();
			var goods = GoodsDomain.findGoodsByID(sqlExecute, policyInfo.goodsID);	//获取电子保单对应的商品
			var protectDetails= ProtectPlanDomain.queryProtectPlanDetail(sqlExecute, goods.protectPlanID);	//获取商品对应的保障方案详情
			for(var i=0; i<protectDetails.length; i++){
				var protectDetail = protectDetails[i];
				protectDetailList.push({
					kindName : protectDetail.kindName,
					premium : ''
				});
				if(protectDetail.isFree=='1'){
					protectDetailList.push({
						kindName : String(protectDetail.kindName + ',不计免赔'),
						premium : ''
					});
				}
			}
			return protectDetailList;
		}
	};
	return lo;
}