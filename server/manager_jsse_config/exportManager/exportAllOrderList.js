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
	var supplierID = request.supplierID; //供应商ID
	var cityID = request.cityID; //城市ID
	var goodsID = request.goodsID; //商品ID
	var goodsOrderStatus = request.goodsOrderStatus; //商品订单状态
	var createTimeStart = request.createTimeStart; //订单创建起始时间
	var createTimeEnd = request.createTimeEnd; //订单创建结束时间
	var goodsOrderNumber = request.goodsOrderNumber; //商品订单编号
	var carOwner = request.carOwner; //车主
	var phoneNo = request.phoneNo; //联系电话
	var payOrderNumber = request.payOrderNumber; //支付订单编号
	var policyCustomerNo = request.policyCustomerNo; //电子保单号
	var sortFieldName = request.sortFieldName || 'lastUpdate'; //排序字段（lastUpdate商品订单更新时间）
	var sortDir = request.sortDir || 'DESC'; //排序 （ASC升序  DESC降序）

	if(!AuthCheck.isLogin(request.ticket, request.domain)){
		errorResponse(-1000);
		return;
	}
	
	var sqlExecute = sqlAdpterHandler.getInstance(false);

	//查询商品订单列表
	var goodsOrderList = GoodsOrderDomain.listGoodsOrder(sqlExecute, supplierID, cityID, goodsID, goodsOrderStatus, createTimeStart, createTimeEnd, goodsOrderNumber, carOwner, phoneNo, payOrderNumber, policyCustomerNo, sortFieldName, sortDir);
	logger.debug("-----------商品订单列表-----------" + JSON.stringify(goodsOrderList));

	var fileName = lo.getFileName();
	logger.debug("生成的报表文件名：" + fileName);
	require("ymt.jsse.jexcel");
	var jexcelExecute = ymt.jsse.jexcel.open("exportReportRoot", fileName);
	lo.setHead(jexcelExecute);

	var goodsOrder;
	for (var i = 0; i < goodsOrderList.length; i++) {
		goodsOrder = goodsOrderList[i];
		jexcelExecute.writeData({
			type: "content",
			data: [
				goodsOrder.payOrderNumber || '',
				goodsOrder.goodsOrderNumber || '',
				goodsOrder.goodsTypeName || '',
				goodsOrder.hcanCustomerNumber || '',
				goodsOrder.goodsName || '',
				goodsOrder.payFee || '',
				goodsOrder.carOwner || '',
				goodsOrder.phoneNO || '',
				goodsOrderStatusMap[goodsOrder.goodsOrderStatus],
				goodsOrder.createTime || '',
				goodsOrder.lastUpdate || '',
				goodsOrder.supplierShortName || '',
				goodsOrder.cityName || ''
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



function createLogic() {
	load("/common/_errorCode.js");
	load("/domain/DBUtils.js");
	load("/exportManager/uuid.js");
	load("/common/_importConfig.js");
	load("/exportManager/_statusContant.js");
	load("/exportDomain/GoodsOrderDomain.js");
	load("/lib/authCheck.js");
	load("/orderManager/common.js");
	var lo = {
		//生成报表文件名
		getFileName: function() {
			var curDate = new Date().Format('yyyyMMdd');
			var curTime = new Date().Format('yyyyMMddHHmmss');
			return curDate + "/" + "goodsOrderReport" + "/" + "订单管理" + curTime;
		},
		//设置报表头
		setHead: function(jexcelExecute) {
			jexcelExecute.writeData({
				type: "title",
				data: ["支付订单编号", "订单编号", "产品类别", "商户订单号", "商品名称", "总金额", "车主", "联系电话", "订单状态", "创建时间", "更新时间", "供应商", "城市"]
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
		}
	};
	return lo;
}