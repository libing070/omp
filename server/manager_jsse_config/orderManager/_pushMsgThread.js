/**
 * 	功能：PUSH消息线程
 *  @author niuxiaojie
 */
load("/common/PushUtils.js");
load("/lib/userAuth.js");
(function(inject) {
	try {
		logger.info("pushMsgThread begin; inject=" + JSON.stringify(inject));

		var notifyType = inject.notifyType; //1完成出单(投保成功)	2已退费		3已取消    	4已退保
		switch (notifyType) {
			case '1': //1完成出单(投保成功)
				var customerID = inject.userID;
				var phoneNO = inject.phoneNO;
				var carLicense = inject.carLicense; //车牌号
				var startDate = inject.startDate; //投保起始日期
				var endDate = inject.endDate; //投保结束日期
				var policyNO = inject.policyNO;	//保单号
				var kindTypeName = inject.kindTypeName;	//1商业险 2交强险
				var pushLabel = "订单进度消息：完成出单";
				var msgContent = "你的车牌号码为" + carLicense + "的" + kindTypeName + "订单已生效，保障日期从【" + startDate + "】到【" + endDate + "】，保单号："+ policyNO +"，祝您出行愉快。"

				PushUtils.pushMsg('Customer', 'U', '2', pushLabel, new Array(customerID), {}, '1001');
				USERAUTH.sendMsg2SMSModule('6', phoneNO, msgContent);
				return;
			case '2': //2已退费	
				var customerID = inject.userID;
				var phoneNO = inject.phoneNO;
				var carLicense = inject.carLicense; //车牌号
				var pushLabel = "订单进度消息：已退费";
				var msgContent = "你的车牌号码为" + carLicense + "的保险订单已退费，请查收。"

				PushUtils.pushMsg('Customer', 'U', '2', pushLabel, new Array(customerID), {}, '1001');
				USERAUTH.sendMsg2SMSModule('6', phoneNO, msgContent);
				return;
			case '3': //3已取消
				var customerID = inject.userID;
				var phoneNO = inject.phoneNO;
				var carLicense = inject.carLicense; //车牌号
				var policyStatus = inject.policyStatus;	//保单状态
				var pushLabel = "订单进度消息：已取消";
				var msgContent = policyStatus == '6' ? "由于保险公司拒保，你的车牌号码为" + carLicense + "的保险订单已取消。" : "由于保险公司系统问题，你的车牌号码为" + carLicense + "的保险订单已取消。"

				PushUtils.pushMsg('Customer', 'U', '2', pushLabel, new Array(customerID), {}, '1001');
				USERAUTH.sendMsg2SMSModule('6', phoneNO, msgContent);
				return;
			case '4': //4已退保
				var customerID = inject.userID;
				var phoneNO = inject.phoneNO;
				var pushLabel = "订单进度消息：已退保";
				var msgContent = "退保通知：您好，您的车险保单已退保，保险公司不再受理您的理赔申请。客服电话："+inject.serviceHotline+"。"

				PushUtils.pushMsg('Customer', 'U', '2', pushLabel, new Array(customerID), {}, '1001');
				USERAUTH.sendMsg2SMSModule('6', phoneNO, msgContent);
				return;
		}
	} catch (e) {
		logger.error("pushMsgThread execption end; nmessage:" + e.toString());
	}
})($_inject_$);