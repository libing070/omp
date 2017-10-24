/**
 * @author yanglin
 * @description 导出报价单列表
 * 
 */
(function(request,header){
	//获取基本参数
	var businessStartDate=request.businessStartDate; //交易开始日期
	var businessEndDate=request.businessEndDate;   //交易结束日期
	var lo = createLogic();
	//登录校验
	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000, {logoutUrl : logoutUrl});
		return;
	}
	
	//传入参数校验
	var errMsg=lo.checkParam(businessStartDate,businessEndDate);
	if(errMsg){
		errorResponse(-1,errMsg);
		return;
	}
	//查数据库和写文件的逻辑放到具体的类中去做
	var fileName=lo.writeToExcel(businessStartDate,businessEndDate);
	$_response_$={
		errorCode:0,
		data:{
			reportUrl:String(reportUrlPre + fileName + ".xls")
		}
	};
})($_request_param_$,$_request_header_$);
function createLogic () {
	load('/common/common.js');
	load('/common/_errorCode.js');
	load('/common/_importConfig.js');
	load('/lib/authCheck.js');
	load('/domain/DBUtils.js');
	load('/exportDomain/TradeDomain.js');
	var lo={
		//检验参数
		checkParam:function(businessStartDate,businessEndDate){
			var errMsg;
			if(businessEndDate&&businessStartDate){
				errMsg=null;
			}else{
				errMsg="businessStartDate和businessEndDate不能为空";
			}
			return errMsg;
		},
		queryTradeStatics:function(sqlExecute,startTime,endTime){
			return TradeDomain.queryTradeStatics(sqlExecute,startTime,endTime);
		},
		getFileName:function(){
			var curDate = new Date().Format('yyyyMMdd');
			var curTime = new Date().Format('yyyyMMddHHmmss');
			return curDate + "/" + "tradeStaticsReport" + "/" + "运营数据管理" + curTime;
		},
		setHead:function(jexcelExecute){
			jexcelExecute.writeData({
				type: "title",
				data: ["日期","供应商名称","城市名称", "产品类别", "商品名称","用户成功交易数", "用户成功交易转换率", "订单数","交易额"]
			});
			// 设置列号
			jexcelExecute.setColumnWidth(0, 20);
			jexcelExecute.setColumnWidth(1, 20);
			jexcelExecute.setColumnWidth(2, 20);
			jexcelExecute.setColumnWidth(3, 20);
			jexcelExecute.setColumnWidth(4, 20);
			jexcelExecute.setColumnWidth(5, 20);
			jexcelExecute.setColumnWidth(6, 20);
			jexcelExecute.setColumnWidth(7, 20);
			jexcelExecute.setColumnWidth(8, 20);
			jexcelExecute.setColumnWidth(9, 20);
		
		},
		setContent:function(jexcelExecute,list){
				for (var i = 0; i < list.length; i++) {
				var line = list[i];
				jexcelExecute.writeData({
					type: "content",
					data: [
						line.countDate || '',
						line.supplierName || '',
						line.cityName || '',
						line.goodsTypeName || '',
						line.goodsName || '',
						line.userJYS || '',
						line.rate || '',
						line.jys || '',
						line.jye || ''
					]
					});
				}
		},
		writeToExcel:function(startTime,endTime){
			//返回excel的文件名地址
			require("ymt.jsse.jexcel");
			var fileName=this.getFileName();
			var sqlExecute=sqlAdpterHandler.getInstance(false);
			var list=lo.queryTradeStatics(sqlExecute,startTime,endTime);
			logger.debug('--------导出列表-------'+JSON.stringify(list));
			var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
			this.setHead(jexcelExecute);
			this.setContent(jexcelExecute,list);
			jexcelExecute.close();
			return fileName;
		}
	};
	return lo;
}
