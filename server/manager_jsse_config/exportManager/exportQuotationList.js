/**
 * @author yanglin
 * @description 导出报价单列表
 * 
 */
(function(request,header){
	//获取基本参数
	var supplierID=request.supplierID; //供应商ID
	var cityID=request.cityID;    //城市ID
	var goodsTypeID=request.goodsTypeID;  //商品ID
	var quoteMode=1;  //报价方式：1-人工 2-自动  目前只查1
	var lockStatus=request.lockStatus;//1-未锁定 2-锁定
	var quotationStatus=request.quotationStatus;//报价单状态	1未报价2已报价3报价失败
	var lockOwnerChoice=request.lockOwnerChoice||"101"; //锁定owner前台的选择	000分别对应本人、他人、无，0未勾1勾
	var carOwner=request.carOwner;//车主
	var phoneNo=request.phoneNo;  //联系电话
	var sortFieldName=request.sortFieldName||'createTime';//排序字段
	var sortDir=request.sortDir||'DESC';//asc 升序 desc降序
	var lo = createLogic();
	//登录校验
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	//传入参数校验
	var errMsg=lo.checkParam(sortFieldName,sortDir);
	if(errMsg){
		errorResponse(-1,errMsg);
		return;
	}
	//解析lockOwnerChoice字段
	var me,he,non;
	me=parseInt(lockOwnerChoice.charAt(0));//锁定且loginOwner相等
	he=parseInt(lockOwnerChoice.charAt(1));//锁定且loginOwner不等
	non=parseInt(lockOwnerChoice.charAt(2));//未锁定
	var lockOwner=AuthCheck.getLoginName(request.ticket,request.domain);//通过接口请求,当前的登录名
	//查数据库和写文件的逻辑放到具体的类中去做
	var fileName=lo.writeToExcel(supplierID, cityID, goodsTypeID, quoteMode, lockStatus, quotationStatus, lockOwner, me, he, non, carOwner, phoneNo, sortFieldName, sortDir);
	$_response_$={
		errorCode:0,
		data:{
			reportUrl:String(reportUrlPre + fileName + ".xls")
		}
	};
})($_request_param_$,$_request_header_$);
function createLogic () {
	load('/common/_errorCode.js');
	load('/common/_importConfig.js');
	load('/lib/authCheck.js');
	load('/domain/DBUtils.js');
	load('/exportDomain/QuotationDomain.js');
	load('/exportManager/_statusContant.js');
	load('/orderManager/common.js');
	var lo={
		//检验参数
		checkParam:function(sortFieldName,sortDir){
			var errMsg;
			if (sortFieldName && ['createTime'].indexOf(sortFieldName) == -1) {
				errMsg = "请求携带参数[sortFieldName]不合法";
			} else if (sortDir && ['ASC', 'DESC'].indexOf(sortDir) == -1) {
				errMsg = "请求携带参数[sortDir]不合法";
			} 
			return errMsg;
		},
		listQuotation:function(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo,sortFieldName,sortDir){
			return QuotationDomain.listQuotation(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo,sortFieldName,sortDir);
		},
		getFileName:function(){
			var curDate = new Date().Format('yyyyMMdd');
			var curTime = new Date().Format('yyyyMMddHHmmss');
			return curDate + "/" + "quotationReport" + "/" + "报价单管理" + curTime;
		},
		setHead:function(jexcelExecute){
			jexcelExecute.writeData({
				type: "title",
				data: ["报价单编号", "产品类型", "商品名称","车主", "联系电话", "报价单状态", "锁定状态","锁定OWNER","总金额","报价单创建时间", "供应商", "城市"]
			});
			// 设置列号
			jexcelExecute.setColumnWidth(0, 30);
			jexcelExecute.setColumnWidth(1, 20);
			jexcelExecute.setColumnWidth(2, 20);
			jexcelExecute.setColumnWidth(3, 20);
			jexcelExecute.setColumnWidth(4, 20);
			jexcelExecute.setColumnWidth(5, 20);
			jexcelExecute.setColumnWidth(6, 20);
			jexcelExecute.setColumnWidth(7, 20);
			jexcelExecute.setColumnWidth(8, 20);
			jexcelExecute.setColumnWidth(9, 20);
			jexcelExecute.setColumnWidth(10, 20);
			jexcelExecute.setColumnWidth(11, 20);
		
		},
		setContent:function(jexcelExecute,list){
				for (var i = 0; i < list.length; i++) {
				var line = list[i];
				jexcelExecute.writeData({
					type: "content",
					data: [
						line.quotationCustomerNumber || '',
						line.goodsTypeName || '',
						line.goodsName || '',
						line.carOwner || '',
						line.phoneNO || '',
						line.quotationStatus?quotationQSMap[line.quotationStatus]:'',
						line.lockStatus?quotationLSMap[line.lockStatus]:'',
						line.lockOwner || '',
						line.amount || '',
						line.createTime || '',
						line.shortName || '',
						line.cityName || ''
					]
					});
				}
		},
		writeToExcel:function(supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo,sortFieldName,sortDir){
			//返回excel的文件名地址
			require("ymt.jsse.jexcel");
			var fileName=this.getFileName();
			var sqlExecute=sqlAdpterHandler.getInstance(false);
			var list=lo.listQuotation(sqlExecute,supplierID,cityID,goodsTypeID,quoteMode,lockStatus,quotationStatus,lockOwner,me,he,non,carOwner,phoneNo,sortFieldName,sortDir);
//			logger.debug('--------导出询价单列表-------'+JSON.stringify(list));
			var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
			this.setHead(jexcelExecute);
			this.setContent(jexcelExecute,list);
			jexcelExecute.close();
			return fileName;
		}
	};
	return lo;
}
