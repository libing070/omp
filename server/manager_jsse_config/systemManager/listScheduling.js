/**
 * 	功能：查询工作排程列表
 *  
 *  @author nongjinmei
 */
load("/common/_errorCode.js");
load("/domain/DBUtils.js");
load("/lib/authCheck.js");
load("/common/_importConfig.js");
load("/domain/SchedulingDomain.js");
(function(param, header) {
	if(!AuthCheck.isLogin(param.ticket, param.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	var month = param.month;//查询年月
	
	try {
		if(!month) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(false);
		
		var schedulingList = new Array();
		//判断该年月是否存在工作排程
		var isExist = SchedulingDomain.isExistsScheduling(sqlAdapter,month);
		var arrTem=[];
		if(isExist) {
			schedulingList = SchedulingDomain.querySchedulingList(sqlAdapter,month);
			logger.info("schedulingList___________________:"+schedulingList.length);
			var m= 0, n= parseInt(schedulingList[0].week)- 2;
			arrTem[m]=[];
			var k;
			if(n>0){
				 k=n;
			}else  if(n==-1){
				k=6;
			}
			//else {
			//	 k=5;
			//}

				var temNull={
					schedulingID	:"",	//工作排程自增ID
					scheduleDate	:"",	//排程日期
					week	:"",			//所属星期
					scheduleType	:"",	//排程设置1 休息日
					workingStart	:"",	//弹性工作时间开始（type=3此字段有值）
					workingEnd	:"",	//弹性工作时间结束（type=3此字段有值）
					createTime	:"",		//创建时间
					lastUpdate	:""		//最后更新时间
				};
				while (k>0){
					schedulingList.unshift(temNull);
					k--;
				}


			for(var i=0;i<Math.ceil(schedulingList.length/7);i++){
				arrTem[i]=schedulingList.slice(i*7,i*7+7);
			}
		}
		
		$_response_$={
			errorCode:0,
			data:arrTem
		};
	} catch (e) {
		logger.error("获取工作排程列表失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
