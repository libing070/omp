/**
 * 	功能：生成工作排程设置
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
	
	var schedulingTime = param.schedulingTime;//工作排程（年月）
	try {
		if(!schedulingTime) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		
		//判断该年月是否存在工作排程
		var isExist = SchedulingDomain.isExistsScheduling(sqlAdapter,schedulingTime);
		
		if(!isExist) {
			var schedulingMonth = schedulingTime.substring(5,7);
			logger.debug("schedulingMonth===================" + schedulingMonth);
			
			var schedulingStart = schedulingTime.concat("-01");
			var schedulingEnd = "";
			logger.debug("schedulingStart===================" + schedulingStart);
			//1 3 5 7 8 10 12 月固定都是31号
			if(schedulingMonth==1 || schedulingMonth==3||schedulingMonth==5||schedulingMonth==7||schedulingMonth==8
				||schedulingMonth==10||schedulingMonth==12) {
				schedulingEnd = schedulingTime.concat("-31");
				
			//4 6 9 11 月固定都是30号
			}if(schedulingMonth==4||schedulingMonth==6||schedulingMonth==9||schedulingMonth==11) {
				schedulingEnd = schedulingTime.concat("-30");
				
			}else if(schedulingMonth==2) {
				var schedulingYear = schedulingTime.substring(0,4);
				//如果为闰年，则2月份有29号
				var yy = parseInt(schedulingYear)/4;
				//正则表达式判断是否为整数
				var flag = /^\d+$/.test(yy);
				if(flag) {
					//闰年2月是29号
					schedulingEnd = schedulingTime.concat("-29");
				}else {
					//平年2月是28号
					schedulingEnd = schedulingTime.concat("-28");
				}
			}
			logger.debug("schedulingEnd===================" + schedulingEnd);
			SchedulingDomain.createScheduling(sqlAdapter,schedulingStart,schedulingEnd);
			$_response_$={
				errorCode:0
			};
			
		}else {
			logger.debug("schedulingTime===================" + schedulingTime);
			var schedulingList = SchedulingDomain.querySchedulingList(sqlAdapter,schedulingTime);
			
			var arrTem=[];
			logger.info("schedulingList___________________:"+schedulingList.length);
			var m= 0, n= parseInt(schedulingList[0].week)- 2;
			arrTem[m]=[];
			var k;
			if(n>0){
				 k=n;
			}else  if(n==-1){
				k=6;
			}

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
			$_response_$={
				errorCode:0,
				data:arrTem
			};
		}
		
		sqlAdapter.commitAndClose();//提交事务
		
	} catch (e) {
		logger.error("生成工作排程失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
