/**
 * 错误信息返回工具类
 */
// 定义错误码：顾客子系统对应的错误信息
var __error_info_config__={
	n_1 : '请求参数缺失!{0}',
	p_1002 : '未登录',
	p_1003 : "短信验证码不正确",
	p_6006 : "注册失败",
	p_6007 : "",
	p_6008 : "验证码发送失败",
	p_6012 : "余额不足",
	p_6112 : "Lack of online balance!",
	p_6010 : "Invalid appid or appsecret!",
	p_6011 : "Invalid member phone number!",
	p_6013 : "Trans_no must be unique or Server busy, please try again later!",
	p_6014 : "The switch off!",
	p_6015 : "Invalid trans_no!!",
	p_6016 : "Revoke Fail!",
	p_6017 : "The TransNo repeat!!",
	p_6020 : "The switch off for Online to offline!" ,
	p_9999 : "系统内部错误"
};

function statusResponse(errorCode,data){
	$_response_$ = {
		status : errorCode,
		data:data
	};
	
	if(errorCode < 0){
		$_response_$.message=_processErrorString(__error_info_config__['n_'+Math.abs(errorCode)],arguments);
	}else{
		$_response_$.message=_processErrorString(__error_info_config__['p_'+Math.abs(errorCode)],arguments);
	}
}

/**
 * 通过错误码、返回数据生成响应报文
 * @param errorCode
 * @param data
 */
function errorResponse(errorCode,data){
	$_response_$ = {
		errorCode : errorCode,
		data:data
	};
	
	if(errorCode < 0){
		$_response_$.errorMsg=_processErrorString(__error_info_config__['n_'+Math.abs(errorCode)],arguments);
	}else{
		$_response_$.errorMsg=_processErrorString(__error_info_config__['p_'+Math.abs(errorCode)],arguments);
	}
}

/**
 * 通过错误码返回错误信息
 * @param errorCode
 * @returns
 */
function errorString(errorCode){
	if(errorCode<0){
		return _processErrorString(__error_info_config__['n_'+Math.abs(errorCode)],arguments);
	}else{
		return _processErrorString(__error_info_config__['p_'+Math.abs(errorCode)],arguments);
	}
}

/*
 * 消息占位符替换
 */
function _processErrorString(msg,newArguments){
	var i,resultMsg=msg;
	for(i = 2 ; i < newArguments.length; i++){
		resultMsg = resultMsg.replace('{'+(i-2)+'}',newArguments[i]);
	}
	return resultMsg;
}