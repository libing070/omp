/**
 * 描 述：
 * 		导出商品订单
 * 走 向：
 * 		
 * 规 则：
 * 		
 * 时 机：
 *
 * @author niuxiaojie
 */
(function(request, header) {
	var lo = createLogic();
	// var supplierID = request.supplierID; //供应商ID
	// var cityID = request.cityID; //城市ID
	// var goodsID = request.goodsID; //商品ID
	// var goodsOrderStatus = request.goodsOrderStatus; //商品订单状态
	// var createTimeStart = request.createTimeStart; //订单创建起始时间
	// var createTimeEnd = request.createTimeEnd; //订单创建结束时间
	// var goodsOrderNumber = request.goodsOrderNumber; //商品订单编号
	// var carOwner = request.carOwner; //车主
	// var phoneNo = request.phoneNo; //联系电话
	// var payOrderNumber = request.payOrderNumber; //支付订单编号
	// var policyCustomerNo = request.policyCustomerNo; //电子保单号
	// var sortFieldName = request.sortFieldName || 'lastUpdate'; //排序字段（lastUpdate商品订单更新时间）
	// var sortDir = request.sortDir || 'DESC'; //排序 （ASC升序  DESC降序）

	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000);
		return;
	}
	
	
	var beginDate = request.createTimeStart;	//查询开始时间
	var endDate = request.createTimeEnd;		//查询结束时间
	require("ymt.jsse.sqlnew");
	var sqlExecute = ymt.jsse.sqlnew.open("wx_h5", 'wx_h5', false);
	var recordList = lo.getRecordList(sqlExecute, beginDate, endDate);

	var fileName = lo.getFileName();
	logger.debug("生成的报表文件名：" + fileName);
	require("ymt.jsse.jexcel");
	var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
	lo.setHead(jexcelExecute);

	var record;
	for (var i = 0; i < recordList.length; i++) {
		record = recordList[i];
		jexcelExecute.writeData({
			type: "content",
			data: [
				record.id || '',
				record.openId || '',
				record.scene || '',
				record.createDate || '',
				record.isVisitedPortal || '',
				record.isVisitedLast || '',
				record.isShareProduct || '',
				record.isPlay,
				record.carPrice || '',
				record.buyYear || '',
				record.isCalculate || '',
				record.isShareGame || '',
				record.isCalculateOtherCar || ''
			]
		});
	}

	jexcelExecute.close();
	$_response_$ = {
		errorCode: 0,
		data: {
			reportUrl: String(reportUrlPre + fileName + ".xls")
		}
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

function createLogic() {
	load("/common/_errorCode.js");
	load("/domain/DBUtils.js");
	load("/exportManager/uuid.js");
	load("/common/_importConfig.js");
	load("/exportManager/_statusContant.js");
	load("/exportDomain/GoodsOrderDomain.js");
	load("/domain/RecordDomain.js");
	load("/lib/authCheck.js");
	load("/orderManager/common.js");
	var lo = {
		//生成报表文件名
		getFileName: function() {
			var curDate = new Date().Format('yyyyMMdd');
			var curTime = new Date().Format('yyyyMMddHHmmss');
			return curDate + "/" + "wechatRecord" + "/" + "微信端数据统计" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["数据编号", "用户编号", "时间", "访问渠道", "是否访问欢迎页", "是否访问结束页", "是否分享产品", "是否进入算价游戏", "车辆价格", "购车年份", "是否点击算价", "是否分享游戏", "是否计算另一台车价格"]
			});
			// 设置列号
			jexcelExecute.setColumnWidth(0, 30);
			jexcelExecute.setColumnWidth(1, 30);
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
			jexcelExecute.setColumnWidth(12, 20);
		},
		
		getRecordList	:	function(sqlExecute, beginDate, endDate){
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
	return lo;
}