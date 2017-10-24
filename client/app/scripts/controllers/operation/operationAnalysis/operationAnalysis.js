'use strict';
/**
 * by libing
 * function operationAnalysisCtrl
 */
app.controller('operationAnalysisCtrl', function($scope, $http, $timeout,
		$location, serverUrl, openCity, userAuth, httpUtils) {
	$scope.goTo = function(add) {
		$location.path(add);
	};
	$scope.isActive = 1;
	$scope.isActiveDay=1;
	$scope.period=0;
	listSupplier(); //加载供应商列表
	listGoods(); //加载商品列表
	getResult();
	$scope.userPropertyAnalysisShow=true;
	$scope.firstShowEcharts=true;
	$scope.showFind=true;
	$scope.setActive = function(num) {
		$scope.period=0;
		$scope.isActiveDay=1;
		$scope.isActive = num;
		if($scope.isActive==1){
			$scope.userPropertyAnalysisShow=true;
			$scope.showFind=true;
		}else if($scope.isActive==2){
			$scope.userPropertyAnalysisShow=true;
			$scope.showFind=true;
		}else{
			$scope.userPropertyAnalysisShow=true;
			$scope.showFind=false;
			
		}
		var params = getParams();
		params["period"]=$scope.period;
		getResult();
	};
	$scope.setActiveDay=function(num){
		$scope.isActiveDay = num;
		if(num==1){
			$scope.period=0;
		}else if(num==2){
			$scope.period=1;
		}else if(num==3){
			$scope.period=2;
		}else {
			$scope.period=3;
		}
		var params = getParams();
		params["period"]=$scope.period;
		getResult();
	}
	

	//查找按钮
	$scope.findResult = function() {
		getResult();
	}
	//获取参数信息
	function getParams() {
		var obj = {
			cityID: $scope.search_cityID || "",
			supplierID:$scope.search_supplierID||"",
			goodsID:$scope.search_goodsID||"",
			period:$scope.period||"",
			ticket: $location.$$search.ticket,
			domain: $location.$$search.domain
		}
		return obj;
	}
	//准备绘图信息
	function getResult() {
		var params = getParams();
		params["period"]=$scope.period;
		$scope.operationoption5={};
		if($scope.isActive==1){
			var firstList = getInfo(params, '/dataManager/queryTradeStatisticsCondition');
				$scope.operationoption5 = getLine(firstList, '单位(/元)','商品交易额');
		}else if($scope.isActive==2){
			var secondList = getInfo(params, '/dataManager/queryTradeCount');
			$scope.operationoption5 = getLine(secondList, '单位(/单)','订单交易数量');
		}else{
			var threeList = getInfo(params, '/dataManager/queryUserTradeCountARate');
			$scope.operationoption5 = getLineLast(threeList, '单位(/人)',["用户交易数","用户交易转化率"]);
			
		}
		
	
	}
	
	function getLine(result, title,legends) {
		var xDataArr = new Array();
		var seriesData = new Array();
		var small = null;
		if(result!=""&&result.amountList.length>0){
			for(var i=0;i<result.amountList.length;i++){
				xDataArr.push(result.amountList[i].businessTime);
				seriesData.push(Number(result.amountList[i].count));
			}
		}
		var seriesD={"name":legends,"type":"line","data":seriesData,showAllSymbol: true,itemStyle : { normal: {label : {show: true}}}};
		var legend={"left":"left","data":[legends]};
		var tooltip={trigger : 'item',formatter : '{a} <br/>{b} : {c}'}
		var series=new Array();
		series.push(seriesD);
		var yAxis ={type : 'value',name : ''};
		small ={title: title,tooltip:tooltip,yAxis:yAxis,legend:legend,xData: xDataArr,series: series};
		return small;
	}
	function getLineLast(result, title,legends) {
		var xDataArr = new Array();
		var seriesData1 = new Array();
		var seriesData2 = new Array();
		var small = null;
		if(result!=""&&result.amountList.length>0){
			for(var i=0;i<result.amountList.length;i++){
				xDataArr.push(result.amountList[i].businessTime);
				seriesData1.push(Number(result.amountList[i].count));
				if(result.amountList[i].rate=="0"){
					seriesData2.push(Number(result.amountList[i].rate));
				}else{
					seriesData2.push(Number(result.amountList[i].rate).toFixed(2));
				}
			}
		}
		var series1={"name":legends[0],"type":"line","data":seriesData1,showAllSymbol: true,itemStyle : { normal: {label : {show: true}}}};
		var series2={"name":legends[1],"type":"line","data":seriesData2,showAllSymbol: true,yAxisIndex: 1,itemStyle : { normal: {label : {show: true,formatter :'{c}%'}}}};
		var legend=new Array();
		legend.push(legends[0]);
		legend.push(legends[1]);
		var leg={"left":"left","data":legend};
		var series=new Array();
		series.push(series1);
		series.push(series2);
		var yAxis=new Array();
		var yAxis1={type:'value',name:legends[0]};
		var yAxis2={type:'value',name:legends[1], axisLabel : {formatter: '{value} %'}};
		yAxis.push(yAxis1);
		yAxis.push(yAxis2);
		console.log(yAxis);
		var tooltip={trigger : 'axis', formatter:  function(params) {
            return params[0].name + '<br/>'
            + params[0].seriesName + ' : ' + params[0].value + '<br/>'
            + params[1].seriesName + ' : ' + params[1].value + '%';
             }}
		small ={title: title,tooltip:tooltip,yAxis:yAxis,legend:leg,xData: xDataArr,series: series};
		return small;
	}
	/**
	 * 获取数据
	 * @param {Object} param
	 * @param {Object} serverPath
	 */
	function getInfo(params, serverPath) {
		var result = "";
		httpUtils.req(JSON.stringify(params), serverUrl + serverPath)
			.then(function successCallback(response) {
					if (response.data.errorCode == 0) {
						console.info(response.data);
						$scope.list=response.data;
						result = $scope.list;
					} else {
						userAuth.isLogin(response.data);
					}
				},
				function errorCallback(response) {});
		return result;
	}

	
	
	//导出提示
	$scope.exportTip = function(){
		$scope.params = setArr();
		$scope.popShow = true;
	}
	
	/**
	 * 获取查找参数信息
	 */
	function setArr (){
		console.log($scope.dates.maxDate);
		var result = new Array();
		$scope.isReal = false;
		var param = {};
		if($scope.dates.search_startTime&&$scope.dates.search_startTime!=null){
			param.key = "交易开始日期:";
			//param.value =(new Date($scope.dates.search_startTime+1)).toLocaleDateString().replace(/\//g, "-");
			param.value =document.getElementById("search_startTime").value;
			$scope.startTimeParam=param.value;
			result.push(param);
			$scope.isReal = true;
		}
		
		param = {};
		if($scope.dates.search_endTime&&$scope.dates.search_endTime!=null){
			param.key = "交易结束日期:";
			param.value =document.getElementById("search_endTime").value;
			$scope.endTimeParam=param.value;
			result.push(param);
			$scope.isReal = true;
		}

		
		return result;
	}
	/**
	 * 导出excel
	 */
	$scope.exportExcel = function() {
		var obj = $scope.getParams || {};
		obj['businessStartDate']=document.getElementById("search_startTime").value;//交易开始日期
		obj['businessEndDate']=document.getElementById("search_endTime").value;
		obj['ticket'] = $location.$$search.ticket;
		obj['domain'] = $location.$$search.domain;
		exportReport(obj);
	};


	/**
	 * 导出excel
	 * @param {Object} obj
	 */
	function exportReport(obj) {
		$http({
			method: 'post',
			data: obj,
			url: serverUrl + 'exportManager/exportTradeStatisticsCondition'
		}).then(function successCallback(response) {
			if (response.data.errorCode == 0) {
				$scope.popShow = false;
				$scope.modalGoodsSuccess=true;
    			$timeout(function(){$scope.modalGoodsSuccess=false},2000);
				$scope.reportUrl = response.data.data.reportUrl;
				window.location.href = $scope.reportUrl;
			} else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "导出excel失败!";
				$scope.PopHide = true;
			}
		})
	}
	/**
	 * 取消提示
	 */
	$scope.cancelExport = function() {
		$scope.popShow = false;
	};
	
	
	
	
	
	
	
	
	
	
	
	

	/**
	 * 获取供应商列表
	 */
	function listSupplier() {
		$http({
			method: 'post',
			data: {
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain
			},
			url: serverUrl + 'supplierManager/querySupplierList'
		}).then(function successCallback(response) {
			if (response.data.errorCode == 0) {
				$scope.suppliers = response.data.data;
			} else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "加载供应商列表失败!";
				$scope.PopHide = true;
			}
		})
	}

	/**
	 * 获取商品列表
	 */
	function listGoods() {
		$http({
			method: 'post',
			data: {
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain
			},
			url: serverUrl + 'goodsManager/queryGoodsList'
		}).then(function successCallback(response) {
			if (response.data.errorCode == 0) {
				$scope.goods = response.data.data;
			} else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "加载商品列表失败!";
				$scope.PopHide = true;
			}
		})
	}
	
	/**
	 * 获取开通城市列表
	 */
	openCity.getOpenList().then(function successCallback(response) {
		if (response.data.errorCode == 0) {
			$scope.citys = response.data.data;
			console.log(response.data.data)
		} else {
			userAuth.isLogin(response.data);
			showError.showErrorMsg("获取开通城市列表失败");
		}
	}, function errorCallback() {
		showError.showErrorMsg("网络异常加载城市列表失败");
	});
	
	/**
	 * 获取时间
	 */
	function getTimeFun(num) {
		var dd = new Date();
		dd.setDate(dd.getDate()+num);
		var y = dd.getFullYear();
		var m_ = dd.getMonth()+1;//获取当前月份的日期
		var d_ = dd.getDate();
		return  y+"-"+(m_>9?m_+"":"0"+m_)+"-"+(d_>9?d_+"":"0"+d_);
		} 
	$scope.dates = {
			today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
			minDate: moment(getTimeFun(-30)), 
			maxDate: moment(getTimeFun(-1)), 
			search_startTime: moment(getTimeFun(-30)),
			search_endTime: moment(getTimeFun(-1)) 
		};
	//监控开始时间 改变时广播通知页面修改最小日期
	$scope.$watch('dates.search_startTime', function() {
		$scope.dates.minDate = $scope.dates.search_startTime || '';
		$scope.$broadcast('pickerUpdate', ['search_endTime'], {
			minDate: $scope.dates.minDate,
		});
	});

	//监控结束时间 改变时广播通知页面修改最大日期
	$scope.$watch('dates.search_endTime', function() {
		$scope.dates.maxDate = $scope.dates.search_endTime || '';
		$scope.$broadcast('pickerUpdate', ['search_startTime'], {
			maxDate: $scope.dates.maxDate,
		});
	});
});