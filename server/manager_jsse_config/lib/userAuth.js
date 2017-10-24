/**
使用说明：
参数配置(jsse根目录下)：userAuth_config.json
{
	"": true,	//是否是开发状态（针对发送验证码）
	"testValicode": "0000",	//开发状态时，此设置有效
	"token_key": "pagodabaiguoyuan", //生成用户token的私钥值（根据系统分别设置）
	"keyType": {
		"userIDWithToken": "miUserService-userID", //（根据系统分别设置）
		"tokenWithUserID": "miUserService-token", //（根据系统分别设置）
		"phoneNumberWithUserID": "miUserService-phoneNumber", //（根据系统分别设置）
	},
	"smsModule":"smsModule", //短信系统调用：此处为短信模块在jsse_config.json中的key值
	"sendPath":"/sms_module/sendMsg", //短信发送请求路径
	"validatePath":"/sms_module/validateCode", //验证短信请求路径
	"codeLenth": 4,	//验证码长度，默认是4
	"action": ["注册", "编辑密码", "账户绑定", "登录"], //发送短信类型
	"smsContent": "您此次{action}验证码为{valiCode},此验证码有效期为10分钟。" //消息体。
}

句柄：USERAUTH
公共调用接口：
1,获取发送短信验证码： USERAUTH.sendMsg2SMSModule(smsType, phoneNumber);
					 USERAUTH.sendMsg2SMSModule(smsType, phoneNumber, smsContent);
					 USERAUTH.sendMsg2SMSModule(smsType, phoneNumber, smsContent, valiCode);

2,验证短信验证码：USERAUTH.validateCode(smsType, phoneNumber, valiCode);

3,获取token并保存token与userID的映射关系，反映射关系：USERAUTH.getSession(userID);

4,通过userID获取已保存的token: USERAUTH.getTokenByUserID(userID);

5,通过token获取已保存的userID：USERAUTH.getUserIDByToken(token);

6,删除token与userID的映射关系以及反映射关系（logout时调用）:USERAUTH.removeSession(userID);

7,保存手机号码与userID的映射关系：USERAUTH.mapPhoneNumberWithUserID(phoneNumber, userID);

8,通过手机号码获取userID: USERAUTH.getUserIDByPhoneNumber(phoneNumber);

9,验证token: USERAUTH.validateToken(key, token, isPhoneNumber);//当isPhoneNumber == true时 key表示手机号码，否则表示userID

10,md5加密：USERAUTH.md5(password);

11,保存关联账户与userID的映射关系：USERAUTH.mapAccountWithUserID(keyType,account, userID);

12,通过关联账户获取userID: USERAUTH.getUserIDByAccount(keyType,account);
* */
var USERAUTH = (function() {
	var jedisAdapter = null,
		config = null,
		codecEnabler = null;
	try {
		require("ymt.jsse.CodecEnabler");
		codecEnabler = ymt.jsse.CodecEnabler;
		require("ymt.jsse.redis");
		jedisAdapter = ymt.jsse.redis.open("jedis-yibaohui");
		config = (function() {
			var configStr = $_application_$.get('userAuth:config');
			var config;
			if (configStr) {
				config = JSON.parse(configStr);
			}
			if (!config) {
				require("ymt.jsse.ConfigEnabler");
				require("ymt.jsse.FileEnabler");
				var absolutePath = ymt.jsse.ConfigEnabler.getContextPath() + '/userAuth_config.json';
				var data = ymt.jsse.FileEnabler.readFileContent({
					srcPath: absolutePath,
					charset: 'utf-8'
				});
				config = JSON.parse(data);
				$_application_$.put('userAuth:config', data);
			}
			return config;
		})();
	} catch (e) {
		logger.info(e);
		return;
	}

	/**
	 * 调用SMS Module http接口发送消息
	 * 调用一（验证型）：
	 * @param {短信类型} smsType
	 * @param {手机号码} phoneNumber
	 *
	 * 调用二（通知型）：
	 * @param {短信类型} smsType
	 * @param {手机号码} phoneNumber
	 * @param {短信内容} smsContent
	 *
	 * 调用三（验证型）：
	 * @param {短信类型} smsType
	 * @param {手机号码} phoneNumber
	 * @param {短信内容} smsContent
	 * @param {验证码} valiCode
	 */
	function sendMsg2SMSModule(smsType, phoneNumber, smsContent, valiCode) {
		if (config.develop) {
			//测试保留
			return 0;
		}
		//通用信息生成验证码
		if (!valiCode && !smsContent) {
			valiCode = createValiCode();
			smsContent = config.smsContent.replace("{action}", config.action[smsType - 1]).replace("{valiCode}", valiCode);
		}
		var msgBody = {
			phoneNumber: phoneNumber,
			smsType: smsType,
			valiCode: valiCode,
			smsContent: smsContent
		};
		require("ymt.jsse.http");
		var httpExecute = ymt.jsse.http.open(config.smsModule);
		var resultStr = httpExecute.invoke({
			path: config.sendPath,
			method: "post",
			request: {
				contentType: "json",
				charset: "UTF-8",
				body: JSON.stringify(msgBody)
			},
			response: {
				contentType: "json",
				charset: "UTF-8"
			}
		});
		var resultObj = JSON.parse(resultStr);
		return resultObj["errorCode"];

	}

	/**
	 * 验证验证码的合法性
	 * @param {短信类型} smsType
	 * @param {手机号码} phoneNumber
	 * @param {验证码} valiCode
	 */
	function validateCode(smsType, phoneNumber, valiCode) {
		if (config.develop) {
			//测试保留
			if (valiCode == config.testValicode) {
				return 0;
			}
			return 1;
		}
		var msgBody = {
			valiCode: valiCode,
			phoneNumber: phoneNumber,
			smsType: smsType
		};
		require("ymt.jsse.http");
		var httpExecute = ymt.jsse.http.open(config.smsModule);
		var resultObj = JSON.parse(httpExecute.invoke({
			path: config.validatePath,
			method: "post",
			request: {
				contentType: "json",
				charset: "utf-8",
				body: JSON.stringify(msgBody)
			},
			response: {
				contentType: "json",
				charset: "utf-8"
			}
		}));
		return resultObj["errorCode"];
	};

	/**
	 * 产生随机数（手机验证码）
	 */
	function createValiCode() {
		var valiCode = "",
			number = config.codeLenth;
		for (var i = 0; i < number; i++) {
			valiCode = valiCode + parseInt(Math.random() * 10);
		}
		return valiCode;
	}

	/**
	 * redis操作k-k-v,存储值
	 * @param {Object} keyType
	 * @param {Object} key
	 * @param {Object} value
	 */
	function hset(keyType, key, value) {
		if (!keyType || !key) {
			return;
		}
		var params = {};
		if (typeof value !== 'string') {
			value = JSON.stringify(value);
		}
		params[key] = value;
		return jedisAdapter.hset({
			hash: keyType,
			params: params
		});
	}

	/**
	 * redis操作k-k-v,获取值
	 * @param {Object} keyType
	 * @param {Object} key
	 */
	function hget(keyType, key) {
		if (!keyType || !key) {
			return;
		}
		var data = jedisAdapter.hget(keyType, [key]);
		data = JSON.parse(data);
		if (data && data.length) {
			return data[0][key];
		}
		return null;
	}

	/**
	 * redis操作k-k-v,删除值
	 * @param {Object} keyType
	 * @param {Object} key
	 */
	function hdelete(keyType, key) {
		if (!keyType || !key) {
			return;
		}
		if (jedisAdapter.hisExists(keyType, key)) {
			jedisAdapter.hdelete(keyType, [key]);
		}
	}

	var _USERAUTH = {
		sendMsg2SMSModule: sendMsg2SMSModule,
		validateCode: validateCode,
		/**
		 * 将用户明文密码进行md5加密
		 * @param {Object} password
		 */
		md5: function(password) {
			password = codecEnabler.md5(password);
			return password;
		},
		/**
		 * 数据加密
		 * @param {Object} data
		 */
		encryptData: function(data, key) {
			if (typeof data !== 'string') {
				data = JSON.stringify(data);
			}
			return String(codecEnabler.AESEncrypt(data, key));
		},
		/**
		 * 数据解密
		 * @param {Object} data
		 */
		decryptData: function(data, key) {
			return String(codecEnabler.AESDecrypt(data, key).trim());
		},
		/**
		 * 获取token并存储到redis中
		 * @param {Object} userID
		 */
		getSession: function(userID) {
			var time = new Date().getTime();
			//过期时间
			var expiration = (config.expiration) * 60 * 60 * 100;
			if (expiration) {
				expiration = time + 　expiration;
			}
			//用户密钥
			var userSecretKey = userID + "_" + time + "" + parseInt(Math.random() * 1000);
			logger.info("userSecretKey:" + userSecretKey);
//			userSecretKey = this.encryptData(userSecretKey, config.AESKEY);
//			logger.info("userSecretKey:" + userSecretKey);
			//生成userToken
			var userToken = userID + "|" + userSecretKey + "|" + expiration;
			logger.info("userToken:" + userToken);
			userToken = this.encryptData(userToken, config.AESKEY);
			logger.info("userToken:" + userToken);
			//保存到redis中
			this._saveSession(userID, userToken);
			return String(userToken);
		},
		/**
		 * 解析token
		 * @param {Object} token
		 */
		decryptToken: function(token) {
			var data = this.decryptData(token, config.AESKEY).split("|");
			var expiration = data[2] - 0;
			if (expiration) {
				var time = new Date().getTime();
				if (time > expiration) {
					return null;
				}
			}
			return data;
		},
		/**
		 * 验证token的合法性
		 * @param {Object} key
		 * @param {Object} token
		 * @param {Boolean} isPhoneNumber //默认false,表示userID, true表示是手机号码
		 */
		validateToken: function(key, token, isPhoneNumber) {
			if (!token || token.replace(/\s/g, "").length == 0) {
				return false;
			}
			if (isPhoneNumber) {
				if (!key || isNaN(key) || key.length < 11) {
					return false;
				}
				key = this.getUserIDByPhoneNumber(key);
			}
			if (!key || isNaN(key)) {
				return false;
			}
			return this.getTokenByUserID(key) == token;
		},
		/**
		 * 保存会话令牌
		 * @param {Object} userID
		 * @param {Object} token
		 */
		_saveSession: function(userID, token) {
			//销毁上次登录时保存的会话令牌信息
			this.removeSession(userID);
			hset(config.keyType.userIDWithToken, userID, token);
			hset(config.keyType.tokenWithUserID, token, userID);
		},
		/**
		 * 删除会话令牌
		 * @param {Object} userID
		 */
		removeSession: function(userID) {
			var token = this.getTokenByUserID(userID);
			hdelete(config.keyType.userIDWithToken, userID);
			hdelete(config.keyType.tokenWithUserID, token);
		},
		getUserIDByToken: function(token) {
			return hget(config.keyType.tokenWithUserID, token);
		},
		getTokenByUserID: function(userID) {
			return hget(config.keyType.userIDWithToken, userID);
		},
		getUserIDByPhoneNumber: function(phoneNumber) {
			return hget(config.keyType.phoneNumberWithUserID, phoneNumber);
		},

		getUserIDByAccount: function(keyType, account) {
			return hget(config.keyType[keyType], account);
		},

		mapPhoneNumberWithUserID: function(phoneNumber, userID) {
			hset(config.keyType.phoneNumberWithUserID, phoneNumber, userID);
		},

		mapAccountWithUserID: function(keyType, account, userID) {
			return hset(config.keyType[keyType], account, userID);
		}
	};
	return _USERAUTH;
})();

function Action(func) {
	var configStr = $_application_$.get('userAuth:config');
	var config = JSON.parse(configStr);
	try {
		init($_request_param_$);
		func.call({}, $_request_param_$, $_request_header_$);
	} catch (e) {
		logger.error("用户身份认证失败，非有效平台密钥 !");
		$_response_$ = {
			errorCode: -1004
		}
	} finally {
		try {
			end();
		} catch (e) {
			logger.error("加密失败！");
			$_response_$ = {
				errorCode: -1004
			}
		}
	}

	function developTools(param) {
		logger.info("original-->$_request_param_$:" + JSON.stringify(param));
		if (!param.original) {
			return param;
		}
		delete param.original;
		if (!param.userToken) {
			param.data = USERAUTH.encryptData(param.data, config.AESKEY);
		} else {
			var userSecretKey = JSON.parse(USERAUTH.decryptData(param.data, key))[1];
			param.data = USERAUTH.encryptData(param.data, userSecretKey);
		}
		logger.info("encrypt-->$_request_param_$:" + JSON.stringify(param));
		return param;
	}

	function init(param) {
		//如果没有token,可能是登录，或者注册(data使用平台密钥对数据进行加密)
		var key, tokenParse;
		if (config.develop) {
			param = developTools(param);
		}
		if (param.userToken) {
			tokenParse = USERAUTH.decryptToken(param.userToken, config.AESKEY);
			if (!tokenParse) {
				throw new Error("decryptToken error!");
			}
			key = tokenParse[1];
		} else {
			key = config.AESKEY;
		}
		logger.info("config.AESKEY:" + key);
		var request = JSON.parse(USERAUTH.decryptData(param.data, key));
		if (param.userToken) {
			request.userToken = param.userToken;
			request.userID = tokenParse[0];
			request.userSecretKey = tokenParse[1];
			request.expiration = tokenParse[2];
		}
		if (!request) {
			throw new Error("decryptData error!");
		}
		logger.info("$_request_param_$:" + JSON.stringify(request));
		$_request_param_$ = request;
	}

	function end() {
		var data = $_response_$.data;
		if (data) {
			var userSecretKey = $_request_param_$.userSecretKey;
			if (!userSecretKey) {
				userSecretKey = config.AESKEY;
			}
			$_response_$.data = data;
			$_response_$.data = USERAUTH.encryptData(data, userSecretKey);
			if (config.develop) {
				logger.info(JSON.stringify(USERAUTH.decryptData($_response_$.data, userSecretKey)));
			}
		}
	}
}