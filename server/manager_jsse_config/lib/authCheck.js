/**
 * 	功能：用户登录校验
 *  @author niuxiaojie
 */

var AuthCheck = {
	isLogin: function(ticket, domain) {
		return true;
		/*if (!ticket || !domain) {
			return false;
		}
		return this._authProcess(ticket, domain);*/
	},
	

	/**
	 * 用户登录校验
	 * @param {令牌} ticket
	 * @param {域名} domain
	 */
	_authProcess: function(ticket, domain) {
		var responseBody = this._userAuth(ticket, domain);
		if (!responseBody) {
			return false;
		}

		// 新的获取参数方式
		var staffId;
		var loginName;
		var realName;
		var departmentId;
		var departmentName;
//		var authResult;

		var params = responseBody.split(",");
		for (var i = 0; i < params.length; i++) {
			if (params[i]) {
				if (params[i].startsWith("STAFF_ID=")) {
					staffId = params[i].substring("STAFF_ID=".length);
				}
				if (params[i].startsWith("LOGIN_NAME=")) {
					loginName = params[i].substring("LOGIN_NAME=".length);
				}
				if (params[i].startsWith("REAL_NAME=")) {
					realName = params[i].substring("REAL_NAME=".length);
				}
				if (params[i].startsWith("department.departmentId=")) {
					departmentId = params[i].substring("department.departmentId=".length);
				}
				if (params[i].startsWith("department.departmentName=")) {
					departmentName = params[i].substring("department.departmentName=".length);
				}
//				if (params[i].startsWith("authResult=")) {
//					authResult = params[i].substring("authResult=".length);
//				}
			}
		}
		if (!staffId || !loginName) {
			return false;
		}
		return true
	},


	/**
	 * 向webbas门户请求认证
	 * @param {令牌} ticket
	 * @param {域名} domain
	 */
	_userAuth: function(ticket, domain) {
		try {
			require("ymt.jsse.http");
			var httpExecute = ymt.jsse.http.open("authCheck");
			var reqBody = {
				ticket: ticket,
				domain: domain,
				subsystem: 'admin',
				subsystemSessionId: 'fscx',
				logoutUrl: 'logoutUrl',
				addressUri: '',
				paramMap: '',
				isAuth: false,
				contextPath: '/admin'
			};
			var str = httpExecute.invoke({
				path: '/admin/userAuth.ajax',
				method: 'POST',
				request: {
					headers: {
						'Cookie': 'JSESSIONID=' + ticket
					},
					contentType: 'form',
					body: reqBody
				},
				response: {　　
					contentType: "json",
					charset: "GBK"　　
				}
			});
			logger.debug("webbas门户认证返回结果：" + str);
		} catch (e) {
			logger.error("webbas门户认证异常：" + e.message);
			str = null;
		}
		return str;
	},
	
	getLoginName: function(ticket, domain){	//获取员工ID
		/*var loginName;
		var responseBody = this._userAuth(ticket, domain);
		if (!responseBody) {
			loginName = "";
		}
		var params = responseBody.split(",");
		for (var i = 0; i < params.length; i++) {
			if (params[i]) {
				if (params[i].startsWith("LOGIN_NAME=")) {
					loginName = params[i].substring("LOGIN_NAME=".length);
				}
			}
		}*/
		//return loginNam;
		return "admin";
	}
};