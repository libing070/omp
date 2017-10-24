/**
 * 命名规范：前缀"_" 代表当前的功能函数为私有函数，供内部进行调用
 * 
 * 
 */
var SchedulingDomain = {	
	
	/**
	 * 查询工作排程列表
	 * @param {Object} sqlAdapter
	 */
	querySchedulingList:function(sqlAdapter,schedulingTime) {
		var sql = "select id as schedulingID,scheduleDate, dayofweek as week,type as scheduleType,"
			+"date_format(workingStart,'%H:%i') as workingStart,date_format(workingEnd,'%H:%i') as workingEnd,"
			+"createTime,lastUpdate from scheduling where  date_format(scheduleDate,'%Y-%m')=@schedulingTime order by scheduleDate";
		
		var result = sqlAdapter.query({
			sql: sql,
			param: {
				schedulingTime:schedulingTime
			},
			recordType:"object",
			resultType:"string"
		});
		logger.debug("sql===================" + sql);
		var schedulingList = JSON.parse(result);
		return schedulingList;
	},
	
	/**
	 * 修改工作排程设置
	 * @param {Object} sqlAdapter
	 * @param {Object} settings
	 */
	updateScheduling:function(sqlAdapter,settings) {
		var id = JSON.parse(sqlAdapter.execute({
			sql:'update scheduling set type=@scheduleType,workingStart=@workingStart,workingEnd=@workingEnd,lastUpdate=now() where id=@schedulingID',
			param:settings
		}));
	},
	
	
	
	/**
	 * 判断是否存在工作排程
	 * @param {Object} month,年月
	 */
	isExistsScheduling:function(sqlAdapter,month) {
		var sql = "select count(1) as count from scheduling where  date_format(scheduleDate,'%Y-%m')=@month";
		
		var retStr = sqlAdapter.query({
			sql: sql,
			param:{
				month:month
			},
			recordType:"object",
			resultType:"string"
		});
		
		var isExists = false;
		if(JSON.parse(retStr).length >0 && JSON.parse(retStr)[0].count >0) {
			isExists = true;
		}
		return isExists;
		
	},
	
	/**
	 * 生成工作排程
	 * @param {Object} sqlAdapter
	 * @param {Object} schedulingStart,工作排程开始日期
	 * @param {Object} schedulingEnd,工作排程结束日期
	 */
	createScheduling:function(sqlAdapter,schedulingStart,schedulingEnd) {
		sqlAdapter.callProc({
			sql : "call proc_createScheduling(@schedulingStart,@schedulingEnd);",
			param : [
				{key:"schedulingStart",value:schedulingStart,index:"1"},
				{key:"schedulingEnd",value:schedulingEnd,index:"2"}
			]
		});
	},
	
	
	/**
	 * 设置常规工作时间
	 * @param {Object} 
	 * workingStart		//常规工作时间开始
     * workingEnd		//常规工作时间结束
	 */
	setWorkingTime:function(sqlAdapter,workingStart,workingEnd) {
		JSON.parse(sqlAdapter.execute({
			sql:"update working_time_config set workingStart=@workingStart,workingEnd=@workingEnd,lastUpdate=now()",
			param:{
				workingStart:workingStart,
				workingEnd:workingEnd
			}
		}));
	},
	
	/**
	 * 获取常规工作时间设置
	 * @param {Object} sqlAdapter
	 */
	getWorkingTime:function(sqlAdapter){
		var sql = "select date_format(workingStart,'%H:%i') as workingStart,date_format(workingEnd,'%H:%i') as workingEnd from working_time_config ";
		
		var result = sqlAdapter.query({
			sql: sql,
			recordType:"object",
			resultType:"string"
		});
		
		var workingTime = JSON.parse(result)[0];
		return workingTime;
	}
	
};

