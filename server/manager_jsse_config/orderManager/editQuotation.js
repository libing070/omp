/**
 * 	功能：编辑报价单
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/common/PushUtils.js");
load("/lib/userAuth.js");
load("/domain/QuotationDomain.js");
load("/domain/GoodsDomain.js");
load("/domain/UserMessagesDomain.js");
load("/domain/UserDomain.js");
load("/orderManager/common.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	var quotationID	= param.quotationID;			//报价单ID
	var quotationStatus = param.quotationStatus;	//报价单状态	2已报价3报价失败
	var failDescription = param.failDescription;	//无法报价原因	quotationStatus=3此值有效
	var businessInsurance = param.businessInsurance;//商业险
//		premium										//保费金额	
//		proposalNO									//投保单号
	var trafficInsurance = param.trafficInsurance;	//交强险
//		lastYearEndDate         					//上年终保日期
//		premium										//保费金额
//		sumTravelTax								//车船税金额
//		proposalNO									//投保单号
	var kindList = param.kindList;  				//险别信息
//		kindID										//平台险别ID
//		kindName									//平台险别名称
//		premium										//保费
	var amount = param.amount;						//报价单总金额
	var goodsTypeID = param.goodsTypeID;			//产品线ID
//	var phoneNO = param.phoneNO;					//联系电话
	var lockStatus = param.lockStatus;				//锁定状态    1未锁定  2已锁定

	logger.debug("====================JSON.stringify(kindList)="+JSON.stringify(kindList));
	try {
		if(!quotationID || !quotationStatus || !goodsTypeID || !lockStatus || (quotationStatus =="2" && !amount)) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		
		var quotationInfo = QuotationDomain.QuotationByQuotationID(sqlAdapter, quotationID);
		
		if(quotationInfo.syxStartDate) {
			businessInsurance['startDate'] = quotationInfo.syxStartDate;
		}
		if(quotationInfo.syxEndDate) {
			businessInsurance['endDate'] = quotationInfo.syxEndDate;
		}
		if(quotationInfo.jqxStartDate) {
			trafficInsurance['startDate'] = quotationInfo.jqxStartDate;
		}
		if(quotationInfo.jqxEndDate) {
			trafficInsurance['endDate'] = quotationInfo.jqxEndDate;
		}
		
		//如果有上年终保日期更新报价单中的交强险上年终保日期（jqxLastYearEndDate）
		if(trafficInsurance.lastYearEndDate && quotationStatus == '2'){
			QuotationDomain.updateLastYearEndDate(sqlAdapter,quotationID,trafficInsurance.lastYearEndDate);
			var jqxStartDateNew = new Date(new Date((trafficInsurance.lastYearEndDate).replace(/-/g, "/")).getTime() + 24 * 60 * 60 * 1000).Format("yyyy-MM-dd");
			var jqxEndDateNew = new Date(new Date((trafficInsurance.lastYearEndDate).replace(/-/g, "/")).getTime() + 365 * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd");
			trafficInsurance['startDate'] = jqxStartDateNew;
			trafficInsurance['endDate'] = jqxEndDateNew;
		}
		
		//查询userID 查询联系电话，用于发送短信
		var userObj = UserDomain.findUserDetailByID(sqlAdapter, quotationInfo.userID);
		var phoneNO = userObj.phoneNO;
		
		//根据 carID 和 goodsID, 确定报价单的的有效字段
		logger.debug("========quotationInfo.quotationID===="+quotationInfo.quotationID);
		var carID = quotationInfo.goodsID;
		var goodsID = quotationInfo.goodsID;
		var maxQuotationID = QuotationDomain.getMaxQuotationID(sqlAdapter, carID, goodsID);
		logger.debug("========maxQuotationID===="+maxQuotationID);
		logger.debug("========原报价单的有效标志===="+quotationInfo.isValid);
		var isValid;
		//报价成功，如果修改的报价单 为 该车辆该商品的最大的报价单，若该报价单为无效状态，则需要将该报价单改成：有效
		logger.debug("-------------------quotationStatus----------"+quotationStatus);
		if(quotationStatus == "2" && quotationInfo.isValid =="N" && quotationInfo.quotationID == maxQuotationID) {
			isValid = "Y";
		}else {
			isValid = quotationInfo.isValid;
		}
		logger.debug("========最终的有效标志===="+isValid);
		
		
		var quotationObj = {
			quotationID:quotationID,
			quotationStatus:quotationStatus,
			failDescription:"",
			businessInsurance:businessInsurance ? JSON.stringify(businessInsurance) : null,
			trafficInsurance:trafficInsurance ? JSON.stringify(trafficInsurance) : null,
			protectionPlan:kindList ? JSON.stringify(kindList) : null,
			jqxProposalNO:trafficInsurance ? trafficInsurance.proposalNO : null,
			syxProposalNO:businessInsurance ? businessInsurance.proposalNO : null,
			amount:amount ? amount : 0,
			isValid:isValid
		};

		var lo = getInvalid();
		var timeExpire;
		if(quotationStatus == '3'){  //如果报价为失败状态，修改isValid是否有效为N
			quotationObj['isValid'] = 'N';
			quotationObj['failDescription'] = failDescription;
		}else if(quotationStatus == '2'){  //已经报价  回写报价单失效日期     //quotationValidDay 
			timeExpire = lo.queryQuotationInvalid(sqlAdapter,quotationInfo);
			quotationObj['timeExpire'] = timeExpire;
		}
		
		QuotationDomain.editQuotation(sqlAdapter,quotationObj);
		
//		logger.debug("-------------------timeExpire----------"+timeExpire);
		var messagesCount = UserMessagesDomain.findUserMessagesByQuotaionID(sqlAdapter,quotationID);
		
		logger.debug("==========messagesCount===="+messagesCount);
		if(messagesCount == "0") {// 第一次报价才会发送短信和push消息
			if(quotationStatus == '2') {//报价成功
				quotationInfo['timeExpire'] = timeExpire;//报价有效期
				quotationInfo['amount'] = amount;		//报价单总金额
				quotationInfo['phoneNO'] = phoneNO;		//联系电话
				
				notifyMessageForQuotation(sqlAdapter, '1', quotationInfo);
				
			}else if(quotationStatus == '3') {//报价失败
				quotationInfo['failDescription'] = failDescription;//无法报价原因
				quotationInfo['phoneNO'] = phoneNO;		//联系电话
				
				notifyMessageForQuotation(sqlAdapter, '2', quotationInfo);
			}
		}
		
		sqlAdapter.commitAndClose();//提交事务
			$_response_$={
				errorCode:0
			};
	} catch (e) {
		logger.error("编辑报价单失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);

//push报价消息 和短信
function notifyMessageForQuotation(sqlAdapter, notifyType, quotationInfo) {
//	logger.debug("-------------------报价单ID：quotationID----------"+quotationInfo.quotationID);
	var content = {};
	
	//报价成功，则计算商品的最终报价
	var sumAmount = 0;
	if(notifyType == "1") {
		var goodsID = quotationInfo.goodsID;	//商品ID
		//查询商品的服务费率，用于计算最终的价格
		var goodsObj = GoodsDomain.findGoodsByID(sqlAdapter,goodsID);
		var serviceRate = 0;
		if(goodsObj) {
			serviceRate = goodsObj.serviceRate;
		}
		logger.debug("-------------商品服务费率：-------------"+serviceRate);
		//最终报价价格
		sumAmount = parseFloat(quotationInfo.amount * (1 + (parseFloat(serviceRate) / 100))).toFixed(2);
		logger.debug("-------------商品最终的报价价格：-------------"+sumAmount);
	}
				

	var title;
	switch(notifyType){
		case '1':		//1报价成功
			title = quotationInfo.goodsName + "报价成功";  //商品名称 + 消息类型
			content['quotationStatus'] = '2';	//2 已报价
			content['goodsTypeID'] = quotationInfo.goodsTypeID;	//1天天保 2车险白条  4交强险
			content['carLicense'] = quotationInfo.carLicenseNO;//车牌号
			content['companyName'] = quotationInfo.supplierName;//承保公司
			//报价金额（白条为每个月的金额，天天保为每天的金额，交强险为总金额
			if(quotationInfo.goodsTypeID == "1") {//天天保
				//每日保费
				var dayAmount = parseFloat((parseFloat(sumAmount + "") / 365).toFixed(2)); 
				content['quotationAmount'] = dayAmount;
			}else if(quotationInfo.goodsTypeID == "2") {//车险白条
				//每月保费
				var monthAmount = parseFloat((parseFloat(sumAmount + "") / 12).toFixed(2)); 
				content['quotationAmount'] = monthAmount;
				content['sumAmount'] = sumAmount;
			}else if(quotationInfo.goodsTypeID == "4") {//交强险
				content['quotationAmount'] = sumAmount;
			}
			var timeExpire = quotationInfo.timeExpire; //报价有效期
			var timeExpireYear = timeExpire.substring(0,4);//年
			var timeExpireMonth = timeExpire.substring(5,7);//月
			var timeExpireDate = timeExpire.substring(8,10);//日
			var tip = "在"+ timeExpireYear + "年" + timeExpireMonth + "月" + timeExpireDate+ "日之前,您的报价有效，请在此日期前完成支付。";
			content['tip'] = '报价有效期为:'+ tip;
			break;
		case '2':		//2报价失败
			title = quotationInfo.goodsName + "报价失败";
			content['quotationStatus'] = '3';	//报价失败
			content['goodsTypeID'] = quotationInfo.goodsTypeID;	//1天天保 2车险白条  4交强险
			content['carLicense'] = quotationInfo.carLicenseNO;//车牌号
			content['companyName'] = quotationInfo.supplierName;//承保公司
			content['tip']='报价失败原因：很抱歉，您的报价失败，相关详细情况，请咨询承保公司。';
			break;
	}
	
	//新增消息记录
	_addMessageForQuotation(sqlAdapter, quotationInfo.userID, title, JSON.stringify(content), quotationInfo.quotationID);
	
	
	//开启线程，push消息+发送短信
	switch (notifyType) {
			case '1': //1报价成功
			
				//一、push消息
				var customerID = quotationInfo.userID;
				var pushLabel = quotationInfo.goodsName +"报价成功";
				PushUtils.pushMsg('Customer', 'U', '2', pushLabel, new Array(customerID), {quotationID:quotationInfo.quotationID}, '1005');
				
				
				
				//二、发送短信
				var carLicenseNO = quotationInfo.carLicenseNO; //车牌号
				var timeExpire = quotationInfo.timeExpire; //报价有效期
				var supplierName = quotationInfo.supplierName; //承保公司
				var timeExpireYear = timeExpire.substring(0,4);//年
				var timeExpireMonth = timeExpire.substring(5,7);//月
				var timeExpireDate = timeExpire.substring(8,10);//日
				
				var msgContent = "你的车牌号码为"+carLicenseNO+"，购买车险商品为"+quotationInfo.goodsName+"，车险保费报价如下："
				//1天天保 2车险白条  4交强险
				if(quotationInfo.goodsTypeID == "1") {//天天保
					//每日保费
					var dayAmount = parseFloat((parseFloat(sumAmount + "") / 365).toFixed(2)); 
					
					msgContent = msgContent +""+ dayAmount + "元/天，保险公司：" + supplierName + "，在"
								+ timeExpireYear + "年" + timeExpireMonth + "月" + timeExpireDate+ "日之前报价有效，请进入APP查看您的报价详情。";
				
				}else if(quotationInfo.goodsTypeID == "2") {//车险白条
					//每月保费
					var monthAmount = parseFloat((parseFloat(sumAmount + "") / 12).toFixed(2)); 
					
					msgContent = msgContent +""+ monthAmount + "元/月，分12个月还款，总还款：" + sumAmount + "元，保险公司：" + supplierName
								 + "，在"+ timeExpireYear + "年" + timeExpireMonth + "月" + timeExpireDate+ "日之前报价有效，请进入APP查看您的报价详情。";
					
				}else if(quotationInfo.goodsTypeID == "4") {//交强险
					var jqxStartDate = quotationInfo.jqxStartDate;//交强险起保日期
					var jqxEndDate = quotationInfo.jqxEndDate;//交强险终保日期
					
					msgContent = msgContent + "" +sumAmount + "元，保障日期从【"+jqxStartDate + "】到【" + jqxEndDate + "】，保险公司：" + supplierName
								+ "，在"+ timeExpireYear + "年" + timeExpireMonth + "月" + timeExpireDate+ "日之前报价有效，请进入APP查看您的报价详情。";
				}
				
				USERAUTH.sendMsg2SMSModule('6', quotationInfo.phoneNO.toString(), msgContent);
				logger.debug("---------发送报价成功短信内容msgContent---------"+msgContent);
				return;
			case '2': //2报价失败	
				//一、push消息
				var customerID = quotationInfo.userID;
				var pushLabel = quotationInfo.goodsName+"报价失败";
				PushUtils.pushMsg('Customer', 'U', '2', pushLabel, new Array(customerID), {quotationID:quotationInfo.quotationID}, '1006');
				
				
				
				//二、发送短信
				var carLicenseNO = quotationInfo.carLicenseNO; //车牌号
				var msgContent = "";
				if(quotationInfo.goodsTypeID == "1" || quotationInfo.goodsTypeID == "2") {//天天保 或者  车险白条
					msgContent = "你的车牌号码为"+ carLicenseNO + "的车险报价失败，可能是您的车辆信息填写有误, 请进入APP查看您的报价详情，并更正您的车辆信息。";
					USERAUTH.sendMsg2SMSModule('6', quotationInfo.phoneNO.toString(), msgContent);
					
				} else if(quotationInfo.goodsTypeID == "4") {//交强险
					msgContent = "你的车牌号码为"+ carLicenseNO + "的车险报价失败，请进入APP查看详情。 ";
					USERAUTH.sendMsg2SMSModule('6', quotationInfo.phoneNO.toString(), msgContent);
				}
				logger.debug("---------发送报价失败短信内容msgContent---------"+msgContent);
				return;
		}
	
}

/**
 * 描述：新增消息
 * @param
 * @return 
 */
function _addMessageForQuotation(sqlAdapter, userID, title, content, quotationID){
	var userMessage = {
		userID : userID,
		messageType : 3,	//消息类型	1.订单进度消息，2.扣款提醒消息,3.报价单消息
		title : title,
		content : content,
		quotationID : quotationID
	};
	
	UserMessagesDomain.addUserMessagesForQuotaion(sqlAdapter, userMessage);
}


function getInvalid() {
	var lo = {
		//查询报价单失效日期
		queryQuotationInvalid : function(sqlAdapter, quotationInfo){
			var timeExpire;
			var goodsTypeID = quotationInfo.goodsTypeID;
			if(goodsTypeID == '1'){  //天天保 ：报价单的失效日期=今天+有效期天数
				timeExpire = new Date(new Date().getTime() + quotationValidDay * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd");
			}else if(goodsTypeID == '2'){  //车险白条 ： 报价单的失效日期= MIN【商业险的起保日期，交强险的起保日期】
				var syxStartDate = quotationInfo.syxStartDate;  //商业险的起保日期
				var jqxStartDate = quotationInfo.jqxStartDate;  //交强险的起保日期
				var st = new Date(new Date(syxStartDate.replace(/-/g,"/")).getTime()).Format("yyyy-MM-dd");
				var ed = new Date(new Date(jqxStartDate.replace(/-/g,"/")).getTime()).Format("yyyy-MM-dd");
				if(st>ed){
					timeExpire = jqxStartDate;
				}else if(st<ed){
					timeExpire = syxStartDate;
				}else if(st==ed){
					timeExpire = jqxStartDate;
				}
			}else if(goodsTypeID == '4'){  //交强险  ： 报价单的失效日期=交强险的起保日期
				timeExpire = quotationInfo.jqxStartDate;
			}
			return timeExpire;
		}
	};
	return lo;
}

