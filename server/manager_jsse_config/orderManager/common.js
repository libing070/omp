Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"H+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}



/**
 * 描述：PUSH消息 + 发送短信
 * @param
 * @return 
 */
function notifyMessage(sqlExecute, notifyType, policy, goodsOrder){
	var content = {		//用户消息表内容体
		goodsTypeID: goodsOrder.goodsTypeID,	//产品线ID
		carLicense: policy.carLicenseNO, //车牌号码
		startDate: policy.startDate, //投保起始日期
		endDate: policy.endDate, //投保结束日期
		kindType: policy.kindType,  // 1商业险 2交强险
		companyName: policy.supplierName //保险公司
	};	
	switch(notifyType){
		case '1' : 		//1完成出单(投保成功)	
			content['goodsOrderStatus'] = '7';	//7完成出单
			content['policyNO'] = policy.policyNO;	//险企保单号
			break;
		case '2' :		//2已退费 
			content['goodsOrderStatus'] = '8';	//8已退费
			content['tip'] = '退保费用已打入您的付款帐户';
			
			break;
		case '3' :		//3已取消 
			content['goodsOrderStatus'] = '9';	//9已取消
			content['kindType'] = policy.kindType;	//1商业险 2交强险
			content['tip'] = '由于保险公司系统问题，订单已取消';
			
			break;
		case '4' :		//4已退保 
			content['goodsOrderStatus'] = '11';	//11 已退保
			content['kindType'] = policy.kindType;	//1商业险 2交强险
			content['tip'] = '您的保单已退保，保险公司将不再提供理赔服务，请悉知';
			
			break;
	}
	if(content.goodsOrderStatus){
		//新增消息记录
		_addMessage(sqlExecute, goodsOrder.userID, policy.goodsName+'订单进度消息', JSON.stringify(content), goodsOrder.payOrderID);
		//开启线程，push消息+发送短信
		var inject = {
			notifyType : notifyType,
			userID: goodsOrder.userID,
			phoneNO: goodsOrder.mainPhoneNO,
			carLicense: policy.carLicenseNO,
			startDate: policy.startDate,
			endDate: policy.endDate,
			policyNO: policy.policyNO,
			kindTypeName: policy.kindType == '1' ? '商业险' : '交强险',
			policyStatus: policy.policyStatus,
			serviceHotline: policy.serviceHotline
		};
		newThread("/orderManager/_pushMsgThread.js", JSON.stringify(inject));
	}
}


/**
 * 描述：新增消息
 * @param
 * @return 
 */
function _addMessage(sqlExecute, userID, title, content, payOrderID){
	load("/domain/UserMessagesDomain.js");
	var userMessage = {
		userID : userID,
		messageType : 1,	//消息类型	1.订单进度消息，2.扣款提醒消息
		title : title,
		content : content,
		payOrderID : payOrderID
	};
	UserMessagesDomain.addIncomeStatement(sqlExecute, userMessage);
}