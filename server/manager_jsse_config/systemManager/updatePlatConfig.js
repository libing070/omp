/**
 * 	功能：编辑平台属性
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SystemDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}

	//平台属性ID
	var platConfigID = param.platConfigID
	//平台客服热线
	var serviceHotline = param.serviceHotline;
	//邮寄地址
	var address = param.address;
	//邮编
	var postcode = param.postcode;
	//收件人
	var receiver = param.receiver;
	//收件人电话
	var phone = param.phone;
	//营业时间提示语
	var serviceTimePrompt = param.serviceTimePrompt;


	try {
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		
		var platConfigObj = {
				platConfigID:platConfigID,
				serviceHotline:serviceHotline,
				address:address,
				postcode:postcode,
				receiver:receiver,
				phone:phone,
				serviceTimePrompt:serviceTimePrompt
		};
		SystemDomain.updatePlatConfig(sqlAdapter,platConfigObj);
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
			
		};
	} catch (e) {
		logger.error("编辑平台属性失败");
		sqlAdapter.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);
