/**
 * 	功能：修改工作排程设置
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
	var settings = param.settings;//工作排程
	
	try {
		if(!month || !settings || settings.length < 1) {
			logger.error("参数缺失");
			errorResponse(-1);
			return;
		}
		var now = new Date();
		var yy = now.getFullYear();//年份
		var mm = parseInt(now.getMonth())+1;//月份
		var dd = now.getDate();//日期
		
		var parmY = parseInt(month.substring(0,4));
		var parmM = parseInt(month.substring(5,7));
		
		if(parmY < yy || parmM < mm) {
			logger.error("月份小于当月不允许进行工作排程设置");
			errorResponse(7104);
			return;
		}
		
		var scheduleDate = "";
		var parmD = "";
		var workingStart;
		var workingEnd;
		var scheduleType;
		var timeStart = "";
		var timeEnd = "";
		for(var i=0; i <settings.length;i++) {
			scheduleDate = settings[i].scheduleDate;
			if(!scheduleDate) {
				logger.error("参数缺失");
				errorResponse(-1);
				return;
			}
			//日期
			parmD = parseInt(scheduleDate.substring(8,10));
			//如果为当月，则判断所选日期是否小于当前日期
//			if(parmM == mm) {
//				if(parmD < dd) {
//					logger.error("所选日期小于或等于当前日期不允许进行工作排程设置");
//					errorResponse(7105);
//					return;
//				}
//			}
			workingStart = settings[i].workingStart;
			workingEnd = settings[i].workingEnd;
			scheduleType = settings[i].scheduleType;//排程日期类型
			
			if(scheduleType =="3") {
//				workingStart = settings[i].workingStart.toString();
//				workingEnd = settings[i].workingEnd.toString();
				if(!workingStart || !workingEnd) {
					logger.error("弹性工作日的起始时间不允许为空");
					errorResponse(7106);
					return;
				}
				var aa = scheduleDate.concat(" ").concat(workingStart).concat(":00");
				var timeStart = new Date(aa.replace(/-/g,"/")).getTime();
				var bb = scheduleDate.concat(" ").concat(workingEnd).concat(":00");
				var timeEnd = new Date(bb.replace(/-/g,"/")).getTime();
				if(timeStart >=timeEnd) {
					logger.error("弹性工作日的开始时间不允许大于或等于结束时间");
					errorResponse(7107);
					return;
				}
			}else {
				if(!workingStart) {
					settings[i].workingStart = null;
				}
				if(!workingEnd) {
					settings[i].workingEnd = null;
				}
			}
			
		}
		
		var sqlAdapter = sqlAdpterHandler.getInstance(true);
		
		SchedulingDomain.updateScheduling(sqlAdapter,settings);
		
		sqlAdapter.commitAndClose();//提交事务
		
		$_response_$={
			errorCode:0
		};
	} catch (e) {
		logger.error("修改工作排程设置失败");
		throw e;
	}
})($_request_param_$, $_request_header_$);
