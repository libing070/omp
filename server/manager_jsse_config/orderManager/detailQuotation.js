/**
 * 	功能：3.7.2	查询报价单详情
 *  @author niuxiaojie
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/domain/QuotationDomain.js");
load("/domain/GoodsDomain.js");
load("/domain/ProtectPlanDomain.js");
load("/common/_importConfig.js");
load("/lib/authCheck.js");
(function(request, header) {
	var quotationID = request.quotationID; //报价单ID
	var lockOwner = request.lockOwner; //锁定owner	 web_bas鉴权返回的loginName
	var lockStatus = request.lockStatus;     //锁定状态  1未锁定  2已锁定
	var q_lockStatus = lockStatus;
	
	logger.debug("quotationID="+quotationID+",lockOwner="+lockOwner+",lockStatus="+lockStatus);
	var lo = createLogic();
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	try{
		
		if(!quotationID){
			logger.error("请求没有携带报价单ID");
			errorResponse(-1);
			return;
		}
		
		var loginName = AuthCheck.getLoginName(request.ticket, request.domain);//获取当前登录操作人的loginName
		// 判断报价单的锁定OWNER="操作人ID" 与登录 的操作人ID不一致：提示“此报价单已被 它人锁定 ，请另外选一张报价单进行报价。”
		var sqlExecute = sqlAdpterHandler.getInstance(false);
		
		var owner = QuotationDomain.getLockOwnerByQuotationID(sqlExecute,quotationID);
		if( lockStatus=='2' &&loginName != owner){
			errorResponse(7019);
			return;
		}
		
		//判断报价单的锁定OWNER="无"，且锁定状态=“未锁定”：报价单的锁定OWNER变更：“登录的操作人ID”，锁定状态变更：“已锁定”。
		if(lockStatus == '1'){
			var lockObj = {
				quotationID:quotationID,
				lockOwner:loginName,
				lockStatus:2
			};
			QuotationDomain.updateLock(sqlExecute,lockObj);
		}
		
		//查询报价单详情
		var quotationInfo = lo.findQuotationDetail(sqlExecute, quotationID);
		if(!quotationInfo){
			logger.error("没有查询到报价单ID[" + quotationID + "]对应的详细信息");
			errorResponse(7108);
			return;
		}
		
		//查询报价单车辆人员信息
		var carAndCarowner = lo.findCarAndCarOwner(sqlExecute,quotationInfo);
		if(!carAndCarowner){
			logger.error("没有查询到车辆ID[" + quotationInfo.carID + "]对应的详细信息");
			return;
		}
		
		var carInfoList = {
			exhaustscale:carAndCarowner.exhaustscale ? parseFloat(parseFloat(carAndCarowner.exhaustscale)/1000).toFixed(1) : 0,//排量
			carLicense:carAndCarowner.carLicense,			//车牌号码
			frameNO:carAndCarowner.frameNO,					//车架号
			engineNO:carAndCarowner.engineNO,               //发动机号
			enrollDate:carAndCarowner.enrollDate,			//车辆登记日期
			modelCName:carAndCarowner.modelCName,			//厂牌型号
			seatCount:carAndCarowner.seatCount                //座位数
		};
		var carOwnerInfoList = {
			carOwner:quotationInfo.carOwner,					//车主
			phoneNO:quotationInfo.phoneNO,						//车主联系电话
			ownerCardID:quotationInfo.ownerCardID,				//车主身份证号码
			insuredName:quotationInfo.insuredName,				//被保险人姓名
			insuredCardID:quotationInfo.insuredCardID			//被保险人身份证
		};
				 
		quotationInfo.carInfo = carInfoList;
		quotationInfo.carOwnerInfo = carOwnerInfoList;
		
		//查询报价单险别详情
		var protectDetailList = new Array();
		if(quotationInfo.goodsTypeID == '1' || quotationInfo.goodsTypeID == '2'){  //车险白条跟天天包需要险别详情
			protectDetailList = lo.getGoodsProtectPlanDetail(sqlExecute, quotationInfo,q_lockStatus);
		}
//		logger.debug("-----------保障方案详情-----------" + JSON.stringify(protectDetailList));
		quotationInfo.kindList = protectDetailList;
		
		logger.debug("########################quotationInfo.kindList="+JSON.stringify(quotationInfo.kindList));
		
		//sqlExecute.commitAndClose();
		
		$_response_$ = {
			errorCode: 0,
			data: quotationInfo
		};
		
	}catch(e){
		logger.error("编辑操作人跟锁定状态失败");
		//sqlExecute.rollbackAndClose();
		throw e;
	}
	
	
})($_request_param_$, $_request_header_$);


function createLogic() {
	var lo = {
		//查询报价单详情
		findQuotationDetail : function(sqlExecute, quotationID){
			var quotationInfo = QuotationDomain.QuotationByQuotationID(sqlExecute, quotationID);
			return quotationInfo;
		},
		//查询报价单车辆人员信息
		findCarAndCarOwner : function(sqlExecute, quotationInfo){
			var carAndCarOwnerInfo = QuotationDomain.FindCarAndCarOwnerInfo(sqlExecute, quotationInfo.carID);
			return carAndCarOwnerInfo;
		},
		//查询报价单的商品对应的保障方案详情
		getGoodsProtectPlanDetail : function(sqlExecute, quotationInfo,q_lockStatus){
			var protectDetailList = new Array();
			var goods = GoodsDomain.findGoodsByID(sqlExecute, quotationInfo.goodsID);	//获取报价单对应的商品
			var protectDetails= ProtectPlanDomain.queryProtectPlanDetail(sqlExecute, goods.protectPlanID);	//获取商品对应的保障方案详情
//			logger.debug("protectDetails========================protectDetails="+JSON.stringify(protectDetails));
			var pdList = new Array();
			var fatherKind;
			if(protectDetails) {
				for(var a=0; a < protectDetails.length; a++) {
					var pd = protectDetails[a];
					pdList.push(pd);
					if(pd.isFree=='1') {
						fatherKind = ProtectPlanDomain.getfatherKind(sqlExecute,pd.kindID);
						if(fatherKind) {
													pdList.push(fatherKind);
						}
					}
				}
			}
			
			var q_protectDetails = QuotationDomain.queryProtectPlanDetail(sqlExecute, quotationInfo.quotationID);

			if(q_protectDetails && q_protectDetails.protectionPlan){  //表示有险别详情
				q_protectDetails = JSON.parse(q_protectDetails.protectionPlan);
				logger.debug("q_protectDetails*****表示有险别详情*********************"+q_protectDetails);
			
//				logger.debug("【有】险别详情----------------------------------------------------");
				if(quotationInfo.goodsTypeID == '2'){
					for(var i=0; i<pdList.length; i++){
						var protectDetail = pdList[i];
						
						for(var j=0; j<q_protectDetails.length; j++){
							var q_protectDetail = q_protectDetails[j];
							if(q_protectDetail.kindID == protectDetail.kindID){
								protectDetailList.push({
									kindID : protectDetail.kindID,
									kindName : protectDetail.kindName,
									mainFlag : protectDetail.mainFlag,
									premium : q_protectDetail.premium
								});
//								if(protectDetail.isFree=='1'){
//									protectDetailList.push({
//										kindID : protectDetail.kindID,
//										kindName : String(protectDetail.kindName + ',不计免赔'),
//										mainFlag : "3",
//										premium : q_protectDetail.premium
//									});
//								}
								break;
							}
						}
					}
				}else if(quotationInfo.goodsTypeID == '1'){
					for(var i=0; i<pdList.length; i++){
						var protectDetail = pdList[i];
						protectDetailList.push({
							kindID : protectDetail.kindID,
							kindName : protectDetail.kindName,
							mainFlag : protectDetail.mainFlag,
							amountShow : protectDetail.amountShow
						});
//						if(protectDetail.isFree=='1'){
//							protectDetailList.push({
//								kindID : protectDetail.kindID,
//								kindName : String(protectDetail.kindName + ',不计免赔'),
//								mainFlag : "3",
//								amountShow : protectDetail.amountShow
//							});
//						}
					}
				}
			}else{
				logger.debug("【没有】险别详情----------------------------------------------------");
				for(var i=0; i<pdList.length; i++){
					var protectDetail = pdList[i];
					protectDetailList.push({
						kindID : protectDetail.kindID,
						kindName : protectDetail.kindName,
						mainFlag : protectDetail.mainFlag,
						amountShow : protectDetail.amountShow
					});
//					if(protectDetail.isFree=='1'){
//						protectDetailList.push({
//							kindID : protectDetail.kindID,
//							kindName : String(protectDetail.kindName + ',不计免赔'),
//							mainFlag : "3",
//							amountShow : protectDetail.amountShow
//						});
//					}
				}
			}
			return protectDetailList;
		}
	};
	return lo;
}