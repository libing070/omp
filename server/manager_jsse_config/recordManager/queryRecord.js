/**
 * 	功能：查询微信H5游戏访问情况
 *  @author yaoyuming
 */
(function(request, header) {
	var beginDate = request.createTimeStart;	//查询开始时间
	var endDate = request.createTimeEnd;		//查询结束时间
	logger.info("开始时间："+beginDate)
	logger.info(endDate)
	var lo = createLogic();
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	require("ymt.jsse.sqlnew");
	var sqlExecute = ymt.jsse.sqlnew.open("wx_h5", 'wx_h5', false);
	// var sqlExecute = sqlAdpterHandler.getInstance(false);
	var recordList = lo.getRecordList(sqlExecute, beginDate, endDate);
	
	$_response_$ = {
		errorCode: 0,
		data: recordList
	};
})($_request_param_$, $_request_header_$);


/*检验时间*/
function validationDate(tempDate){
	if(tempDate != null){
		return true;
	}else{
		return false;
	}
}

function createLogic(){
	load("/common/_errorCode.js");
	load("/common/_importConfig.js");
	load("/domain/DBUtils.js");
	load("/domain/RecordDomain.js");
	load("/lib/authCheck.js");
	var logic = {
		getRecordList	:	function(sqlExecute, beginDate, endDate){
		logger.debug("BeginTime:"+beginDate+" \t&&\t EndTime:"+endDate);
			var condition = "";
			logger.info(validationDate(beginDate))
			if(validationDate(beginDate)){
				//表示输入开始时间和结束时间，根据条件查询数据
				condition += "and UNIX_TIMESTAMP(createDate) > UNIX_TIMESTAMP('"+beginDate+"') ";
			} if(validationDate(endDate)){
				condition += "and UNIX_TIMESTAMP(createDate) < UNIX_TIMESTAMP('"+endDate+"')";
			}
			logger.info("condition = "+condition);
			var recodeList = RecordDomain.getRecordList(sqlExecute, condition);
			return recodeList;
		}
	};
	return logic;
}
