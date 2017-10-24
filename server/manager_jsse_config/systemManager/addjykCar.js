/**
 * 	功能：新增精友库DB文件
 *  @author niuxiaojie
 */
load("/common/_importConfig.js");
load("/domain/DBUtils.js");
load("/domain/JYKCarfileDomain.js");
load("/lib/authCheck.js");
load("/common/_errorCode.js");
(function(request, header) {
	var id = request.id;	//精友库车型DB文件表,主键（编辑携带，新增不携带）
	var name = request.name;
	var groupName = request.groupName;
	var remoteFileName = request.remoteFileName;
	if (!name || !groupName || !remoteFileName) {
		errorResponse(-1);
		return;
	}
	if (!AuthCheck.isLogin(request.ticket, request.domain)) {
		errorResponse(-1000, {
			logoutUrl: logoutUrl
		});
		return;
	}
	var sqlExecute = sqlAdpterHandler.getInstance(true);
	var jykCar;
	jykCar = JYKCarfileDomain.findjykCarByName(sqlExecute, name);
	if(jykCar){
		errorResponse(7102);
		return;
	}
	if(id){	//编辑
		jykCar = JYKCarfileDomain.findjykCarByID(sqlExecute, id);
		if(!jykCar || jykCar.status!='1'){
			errorResponse(7101);
			return;
		}
	}

	try {
		var sqlExecute = sqlAdpterHandler.getInstance(true);

		var httpUrl = "/" + groupName + "/" + remoteFileName;
		var fileResourceID = JYKCarfileDomain.addFileResources(sqlExecute, httpUrl, groupName, remoteFileName);
		logger.debug("------------fileResourceID---------------" + fileResourceID);
		var jykCarID = id;
		if(id){	//编辑
			JYKCarfileDomain.deleteFileResources(sqlExecute, jykCar.fileResourceID);
			JYKCarfileDomain.editjykCar(sqlExecute, id, name, fileResourceID);
		}else{	//新增
			jykCarID = JYKCarfileDomain.addjykCar(sqlExecute, name, fileResourceID, '1'); //1草稿
		}


		//提交事务
		sqlExecute.commitAndClose();
		$_response_$ = {
			errorCode: 0,
			data: {
				id: jykCarID
			}
		};
	} catch (e) {
		logger.error("新增精友库DB文件异常," + e);
		//回滚事务
		sqlExecute.rollbackAndClose();
		throw e;
	}
})($_request_param_$, $_request_header_$);