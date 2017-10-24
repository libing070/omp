/**
 * 顾客端专用：工具函数库
 * @author
 */
load("/common/_errorCode.js");
var TOOLS = {
	
	/**
	 * 随机从一个数组中取出一个元素
	 * @param {源数据} arr
	 * @return 返回一个具体的元素
	 */
	ReturnRandomEle : function(arr){
		return arr[Math.floor(Math.random()*arr.length)];
	},
	
	/**
	 * 工具函数：提供访问一个网络请求
	 * @param {网络地址} httpUrl
	 * @param {请求参数} param
	 * @return 返回响应结果
	 */
	httpInvoke : function(httpUrl,param){
		logger.debug("线上调用线下接口，请求参数："+JSON.stringify(param));
		require("ymt.jsse.http");
		var httpExecute = ymt.jsse.http.open();
		var resultStr = httpExecute.invoke({
			path: httpUrl,
			method: "post",
			request: {
				contentType: "json",
				charset: "UTF-8",
				body: JSON.stringify(param)
			},
			response: {
				contentType: "json",
				charset: "UTF-8"
			}
		});
		logger.debug("#### 发起Http请求，请求响应数据为##############");
		logger.debug(resultStr);
		return JSON.parse(resultStr);
	},
	
	/**
	 * 解析Redis返回的结构
	 * @param {待解析的Reids结构} redisFieldObj
	 * @return 返回解析后的数组对象
	 */
	 parseRedisFieldObj : function (redisFieldObj) {
		redisFieldObj = redisFieldObj ? redisFieldObj : new Array();
		var result = new Array();
		for (var i = 0, len = redisFieldObj.length; i < len ; i++) {
			var fieldObj = redisFieldObj[i];
			for (var n in fieldObj) {
				var obj = fieldObj[n];
				try{
					result.push(JSON.parse(obj));
				}catch(e){
					logger.debug("解析Redis结构是，value的值不是有效的对象！！");
				}
				
			}
		}
		logger.debug("解析Redis结构，返回结果为：" + JSON.stringify(result));
		return result;
	},
	
	/**
	 * 提取结合中指定的属性为链接字符串
	 * @param {源数组} arr
	 * @param {切分的属性} prop
	 */
	 getPropsStr : function(arr,prop) {
		if (arr) {
			var idsStr = [];
			for (var i = 0, len = arr.length; i < len; i++) {
				var obj = arr[i];
				idsStr.push(obj[prop]);
			}
			return idsStr.join(",");
		}
		return "";
	},
	
	/**
	 * 获取当前时间格式：yyyy-MM-dd HH:mm:ss
	 */
	getCurrentTime : function(){
		var df = new  java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		var nowTimestamp = df.format(new java.util.Date());
		return nowTimestamp;
	},
	
	/**
	 * 获取yyyyMMMddHHmmss格式的时间戳
	 */
	getCurrentTimeMillis : function(){
		var df = new  java.text.SimpleDateFormat("yyyyMMddHHmmss");
		var nowTimestamp = df.format(new java.util.Date());
		return nowTimestamp;
	},
	
	/**
	 * 获取当前时间时间戳
	 */
	getNowTimestamp : function(){
		var df = new  java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		var nowTimestamp = new  java.util.Date().getTime();
		return nowTimestamp;
	},
	
	/**
	 * 根据时间获取时间戳
	 * @param {时间字符串 yyyy-MM-dd HH:mm:ss} dateStr
	 * @return 返回时间戳
	 */
	getTimestampByDate : function(dateStr){
		var df = new  java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		var timestamp = df.parse(dateStr).getTime();
		return timestamp;
	},
	
	/**
	 * 比较两个时间大小
	 * @param {起始时间 yyyy-MM-dd HH:mm:ss} startTime
	 * @param {结束时间yyyy-MM-dd HH:mm:ss} endTime
	 * @return true 起始时间大于结束时间  false 起始时间小于结束时间
	 */
	compareTime : function(startTime , endTime){
		if(startTime && endTime){
			var df = new  java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			var start = df.parse(startTime).getTime();
			var end = df.parse(endTime).getTime();
			if(start > end){	// 开始大于结束
				return true
			}
		}
		return false;
	},
	
	/**
	 * 去除数组中的重复项
	 * @param {有重复元素的数组} arr
	 * @return 返回不包含重复元素的数组对象
	 */
	unique : function (arr) {
	    var result = [], hash = {};
	    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
	        if (!hash[elem]) {
	            result.push(elem);
	            hash[elem] = true;
	        }
	    }
	    return result ? result : new Array();
	},
	
	/**
	 * 获取数组中随机个数值
	 * @param {"arry":[],"range":3} opt
	 * @return 返回随机后的数组
	 */
	getRandom : function (opt) {
		var old_arry = opt.arry ? this.unique(opt.arry) : new Array();
	    var random = opt.random;
	    //防止超过数组的长度
	    random = random > old_arry.length? old_arry.length : random;
	    var newArray = [].concat(old_arry); //拷贝原数组进行操作就不会破坏原数组
	    var valArray = [];
	    for (var n = 0; n < random; n++) {
	        var r = Math.floor(Math.random() * (newArray.length));
	        valArray.push(newArray[r]);
	        //在原数组删掉，然后在下轮循环中就可以避免重复获取
	        newArray.splice(r, 1);
	    }
	    return valArray;
	},
	
	/**
	 * 根据用户状态（是否是灰度用户）提取Redis中满足条件的商品列表
	 * @param {包含上架信息的商品状态} goodsArr
	 * @param {是否是灰度用户 true 是灰度用户status = A/D false 非灰度用户 status = A} isGray
	 * @return 返回满足条件的商品列表
	 */
	getGoodsByUserStatus : function(goodsArr,isGray){
		if(goodsArr){
			var result = new Array();
			if(isGray){	// 灰度
				for(var i = 0 ; i < goodsArr.length ; i++){
					var obj = goodsArr[i];
					if(obj.status == 'A' || obj.status == 'D'){
						result.push(obj);
					}
				}
			}else{	// 普通用户
				for(var i = 0 ; i < goodsArr.length ; i++){
					var obj = goodsArr[i];
					if(obj.status == 'A'){
						result.push(obj);
					}
				}
			}
			return result;
		}
		return null;
	},
	
	/**
	 * 判断是否是灰度用户
	 * 规则：先取Redis进行判断，如果Redis没有则去DB进行判断
	 * @param {顾客ID} customerID
	 * @return 返回校验结果 true 是灰度用户  false 不是灰度用户
	 */
	isGrayUser : function(customerID){
		var field = customerID;
		var cusRedis = this.isGrayUserFromRedis(customerID);
		if(cusRedis){	// Redis为空 ，DB获取
			var cusObj = JSON.parse(cusRedis[field]);
			if(cusObj.status == 'D'){
				logger.debug("########## Redis 判断灰度用户 ：true ########");
				return true;
			}else{
				return false;
			}
		}else{
			var cusDB = this.isGrayUserFromDB(customerID);
			if(cusDB.status == 'D'){					// 灰度用户，同步Redis ，返回true
				var cacheParam = {};
				cacheParam.hashKey = "user_customer"; 	// Key
				cacheParam.field = customerID; 			// Field
				cacheParam.cache = cusDB; 				// value
				this.syncDataDBToRedis(cacheParam);
				return true;
			}else{	// 非灰度用户
				return false;
			}
		}
	},
	
	/**
	 * 通过DB判断是否是灰度用户
	 * @param {顾客ID} customerID
	 * @return 返回DB中 顾客的数据
	 */
	isGrayUserFromDB : function(customerID){
		var customerSqlExecute = customerSqlAdapterHandler.getInstance(customerID, false);
		var retStr = customerSqlExecute.query({
			sql:"select id,phoneNumber,name,password,email,icon,sex,cardID,status,"
				+"date_format(createTime,'%Y-%m-%d %H:%i:%s')as createTime,"
				+"date_format(lastUpdate,'%Y-%m-%d %H:%i:%s')as lastUpdate "
				+"from customer where id = @customerId",
			param : {
				   customerId : customerID
			},
			recordType:"object",
			resultType:"string"
		});
		var customer = JSON.parse(retStr)[0];
		return customer;
	},
	
	/**
	 * 判断是否是灰度用户
	 * 规则：先取Redis进行判断，如果Redis没有则去DB进行判断
	 * @param {顾客ID} customerID
	 * @return 返回Redis中缓存的数据
	 */
	isGrayUserFromRedis : function(customerID){
		var field = customerID;
		logger.debug("###################Redis 获取数据参数############");
		logger.debug("Redis 获取数据：Field =" +field);
		logger.debug("###############################################");
		var jedisExecute = jedisClusterHandler.getInstance();
		var retObj = JSON.parse(jedisExecute.hget("user_customer",[field]));
		logger.debug("Redis 获取缓存数据结构为:"+JSON.stringify(retObj));
		return retObj ? retObj[0] : null; 
	},

	/**
	 * 验证当前 userToken 是否有效
	 * @param {会话标识} userToken
	 */
	isLogin : function(customerID,userToken){
		// 参见用户认证引擎
		return USERAUTH.validateToken(customerID, userToken);
//		return true;
	},
	
	/**
	 * 将数据从DB同步到Redis中
	 * @param {goodsID:"",cache : "缓存体"} params
	 * @return 返回同步结果
	 */
	syncDataDBToRedis : function(params){
		logger.debug("####################DB同步Redis参数说明##############");
		logger.debug("Redis Key:"+params.hashKey);
		logger.debug("Redis Field:"+params.field);
		logger.debug("Redis cache:"+params.cache);
		logger.debug("####################----------------##############");
		var jedisExecute = jedisClusterHandler.getInstance();
		var hashKey = params.hashKey;
		var field = params.field;
		var cacheContent = params.cache;		// K-F-V 缓存体
		var param = {};
		param[field] = cacheContent;
		if(!cacheContent){
			logger.debug("DB同步Redis，缓存数据为空！同步失败！！");
			return false;
		}
		var result = jedisExecute.hset({
			hash : hashKey,
			params : param
		});
		logger.debug("DB同步Redis成功，同步数据为:"+JSON.stringify(params.cache));
		return result;
	},
	
	/**
	 * 批量同步数据到Redis
	 * @param {同步参数} params
	 */
	batchSyncDataDBToRedis : function(params){
		logger.debug("####################DB批量同步Redis参数说明##############");
		logger.debug("Redis Key:"+params.hashKey);
		logger.debug("Redis Field:"+params.param);
		logger.debug("####################----------------##############");
		var jedisExecute = jedisClusterHandler.getInstance();
		var hashKey = params.hashKey;
		var param = params.param;
		if(!param){
			logger.debug("DB同步Redis，缓存数据为空！同步失败！！");
			return false;
		}
		var result = jedisExecute.hset({
			hash : hashKey,
			params : param
		});
		logger.debug("DB批量同步Redis成功，同步数据为:"+JSON.stringify(param));
		return result;
	}
	
};
