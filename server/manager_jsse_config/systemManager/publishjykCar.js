/**
 * 	功能：发布精友库DB文件
 *  @author niuxiaojie
 */
load("/common/_importConfig.js");
load("/domain/DBUtils.js");
load("/domain/JYKCarfileDomain.js");
load("/lib/authCheck.js");
load("/common/_errorCode.js");
(function(request, header) {
	var id = request.id;
	if (!id) {
		errorResponse(-1);
		return;
	}
	
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	try {
		var sqlExecute = sqlAdpterHandler.getInstance(true);
		
		JYKCarfileDomain.updatejykcarFileStatus(sqlExecute, '', '2');	//2, 发布
		JYKCarfileDomain.updatejykcarFileStatus(sqlExecute, id, '3');	//3, 有效
		
		//提交事务
		sqlExecute.commitAndClose();
		$_response_$ = {
			errorCode: 0
		};
	} catch (e) {
		logger.error("发布精友库DB文件异常," + e);
		//回滚事务
		sqlExecute.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);