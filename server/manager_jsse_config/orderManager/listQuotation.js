/**
 * @author yanglin
 * @description 查询询价单列表
 * 
 */
(function(request,header){
	//获取基本参数
	var supplierID=request.supplierID; //供应商ID
	var cityID=request.cityID;    //城市ID
//	var goodsID=request.goodsID;  //商品ID
	var goodsTypeID=request.goodsTypeID;  //产品线ID
	var quoteMode=1;  //报价方式：1-人工 2-自动  目前只查1
	var lockStatus=request.lockStatus;//1-未锁定 2-锁定
	var quotationStatus=request.quotationStatus;//报价单状态	1未报价2已报价3报价失败
	var lockOwnerChoice=request.lockOwnerChoice||"101"; //锁定owner前台的选择	000分别对应本人、他人、无，0未勾1勾
	var carOwner=request.carOwner;//车主
	var phoneNo=request.phoneNo;  //联系电话
	var sortFieldName=request.sortFieldName||'createTime';//排序字段
	var sortDir=request.sortDir||'ASC';//asc 升序 desc降序
	var pageNumber=request.pageNumber; //页码
	var pageSize=request.pageSize;  //页大小
	var lo = createLogic();
	//登录校验
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	var sqlExecute=sqlAdpterHandler.getInstance(false);
	//传入参数校验
	var errMsg=lo.checkParam(sortFieldName,sortDir,pageNumber,pageSize);
	if(errMsg){
		errorResponse(-1,errMsg);
		return;
	}
	//具体的业务逻辑
	var lockOwner=AuthCheck.getLoginName(request.ticket,request.domain);//通过接口请求,当前的登录名
	//解析lockOwnerChoice字段
	var me,he,non;
	me=parseInt(lockOwnerChoice.charAt(0));//锁定且loginOwner相等
	he=parseInt(lockOwnerChoice.charAt(1));//锁定且loginOwner不等
	non=parseInt(lockOwnerChoice.charAt(2));//未锁定
	var listCount=lo.getQuotationCount(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo);
	var list=lo.listQuotation(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo,sortFieldName,sortDir,pageNumber,pageSize);
	//增加loginname和operationStatus字段（报价、更改报价、无法报价）
	for(var i=0;i<list.length;i++){
		var item=list[i];
		var operationStatus;//1报价  2更改报价 3无法报价（被他人锁定）
		var quotationStatus=item.quotationStatus;
		if(item.lockStatus==1){
			//未锁定
			operationStatus=1;//报价
		}else if(item.lockStatus==2){
			//锁定,需判断是否本人
			var b=lockOwner==item.lockOwner?true:false;
			if(quotationStatus==1){
				//未报价,本人可报价，他人不行
				operationStatus=b?1:3;
			}else if(quotationStatus==2){
				//已报价，本人可修改，他人不行
				operationStatus=b?2:3;
			}else if(quotationStatus==3){
				//报价失败，本人可报价，他人不行
				operationStatus=b?2:3;
			} else{
				logger.error('quotationSatus值异常：'+JSON.stringify(item));
				errorResponse(7120,'quotationSatus值异常');
				return ;
			}
		}else{
			logger.error('item.lockStatus值异常:'+JSON.stringify(item));
			errorResponse(7120,'lockStatus值异常');
			return ;
		}
		item.operationStatus=operationStatus;
	}
	
	logger.debug('--------询价单列表-------'+JSON.stringify(list));
	$_response_$={
		errorCode:0,
		data:{
			totalCount:listCount,
			quotationList:list
		}
	};
})($_request_param_$,$_request_header_$);
function createLogic () {
	load('/common/_errorCode.js');
	load('/common/_importConfig.js');
	load('/lib/authCheck.js');
	load('/domain/DBUtils.js');
	load('/domain/QuotationDomain.js');
	var lo={
		//检验参数
		checkParam:function(sortFieldName,sortDir,pageNumber,pageSize){
			var errMsg;
			if (sortFieldName && ['createTime'].indexOf(sortFieldName) == -1) {
				errMsg = "请求携带参数[sortFieldName]不合法";
			} else if (sortDir && ['ASC', 'DESC'].indexOf(sortDir) == -1) {
				errMsg = "请求携带参数[sortDir]不合法";
			} else if (!pageNumber || !pageSize || typeof pageNumber != 'number' || typeof pageSize != 'number') {
				errMsg = "请求携带参数[pageNumber]或[pageSize]不合法";
			}
			return errMsg;
		},
		//其它的业务逻辑
		getQuotationCount:function(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo){
			return QuotationDomain.getQuotationCount(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo);
		},
		listQuotation:function(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo,sortFieldName,sortDir,pageNumber,pageSize){
			return QuotationDomain.listQuotation(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo,sortFieldName,sortDir,pageNumber,pageSize);
		}
	};
	return lo;
}
