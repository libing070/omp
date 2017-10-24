/**
 * 用户消息领域对象
 */
var UserMessagesDomain = {
	/**
	 * 描述：新增消息
	 * @param
	 * @return 
	 */
	addIncomeStatement : function(sqlExecute, userMessage){
		//新增消息
		var messageID = sqlExecute.execute({
			sql:"insert into usermessages(userID,messageType,title,content,payOrderID,createTime,lastUpdate) "
				+"values(@userID,@messageType,@title,@content,@payOrderID,now(),now())",
			param : userMessage,
			returnRowId : true
		});
		return messageID;
	},
	
	/**
	 * 查询报价单是否发送过报价信息
	 * @param {Object} sqlExecute
	 * @param {Object} quotationID
	 */
	findUserMessagesByQuotaionID: function(sqlExecute, quotationID){
		var sql = "select count(*) as count from usermessages where messageType='3' and quotationID=@quotationID";
		
		var result = sqlExecute.query({
			sql: sql,
			param: {
				quotationID:quotationID
			},
			recordType:"object",
			resultType:"string"
		});
		
		var count = JSON.parse(result)[0].count;
		return count;
	},
	/**
	 * 新增报价消息
	 * @param {Object} sqlExecute
	 * @param {Object} userMessage
	 */
	addUserMessagesForQuotaion: function(sqlExecute, userMessage){
		//新增消息
		var messageID = sqlExecute.execute({
			sql:"insert into usermessages(userID,messageType,title,content,quotationID,createTime,lastUpdate) "
				+"values(@userID,@messageType,@title,@content,@quotationID,now(),now())",
			param : userMessage,
			returnRowId : true
		});
		return messageID;
	}
};