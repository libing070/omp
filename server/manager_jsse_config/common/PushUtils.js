/**
 * 消息引擎：PUSH函数库
 * @author	niuxiaojie
 */
var PushUtils={
	_toCustomerApp:['http://192.168.0.58:25000/jsse/msgSyncService/pushMsg',
	              'http://192.168.0.58:25000/jsse/msgSyncService/pushMsg',
	              'http://192.168.0.58:25000/jsse/msgSyncService/pushMsg'],
	
	_getHostAndPort:function(systemCode){
		var address=this['_to'+systemCode+'App'];
		return address[Math.floor(Math.random()*address.length)];
	},
	
	pushMsg:function(systemCode,msgType,mode,label,receivers,msgContent,cd){
		var serviceURL = this._getHostAndPort(systemCode);
		var reqBody = { 
				label:label,
				msgContent:msgContent,			
				sender:'fscxServer',
				receivers:receivers,
				mode:mode,
				msgType:msgType,
				cd:cd
		};
		if(!ymt.jsse.http){
			require("ymt.jsse.http");
		}
		var httpExecute = ymt.jsse.http.open();
		var str = httpExecute.invoke({
			path:serviceURL,
			method:'post',
			request:{
				contentType:'json',
				body:JSON.stringify(reqBody)
			},
			response:{
				contentType	: "json",
				charset:"utf-8"
			}
		});
		var result = JSON.parse(str);
		return result;
		logger.debug("-----------push消息返回内容------------" + result);
	}
};