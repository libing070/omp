'use strict';

app.
controller('userAnalysisCtrl', ["$scope", "$http", "$timeout", "$location", "serverUrl", "openCity","userAuth","httpUtils",function($scope, $http, $timeout, $location, serverUrl, openCity,userAuth,httpUtils) {
    $scope.goTo=function(add){
      $location.path(add);
    };
	$scope.billTypeTemp = ['正常还款计划', '坏账还款计划'];
    var myDate = new Date();
    var nowDay = myDate.getDate();
    $scope.nowDay = nowDay;
	//初始化当月下拉列表
	$scope.months = getDate();
	$scope.monthsInfo = $scope.months;
	$scope.monthsInfo = $scope.monthsInfo.slice(1);
    supplierList(); //加载供应商列表
    listGoods(); //加载商品列表
    initializationDate(); //初始化时间
    
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
    $scope.$watch('payDates.search_registDateStart', function() {
		$scope.payDates.minDate = $scope.payDates.search_registDateStart || "";
		$scope.$broadcast('pickerUpdate', ['search_registDateEnd'], {
			minDate: $scope.payDates.minDate,
		});

	});
	$scope.$watch('payDates.search_registDateEnd', function() {
		$scope.payDates.maxDate = $scope.payDates.search_registDateEnd || "";
		$scope.$broadcast('pickerUpdate', ['search_registDateStart'], {
			maxDate: $scope.payDates.maxDate,
		});
	});
	
	$scope.$watch('payDates.search_payDateStart', function() {
		$scope.payDates.minDate = $scope.payDates.search_payDateStart || "";
		$scope.$broadcast('pickerUpdate', ['search_payDateEnd'], {
			minDate: $scope.payDates.minDate,
		});

	});
	$scope.$watch('payDates.search_payDateEnd', function() {
		$scope.payDates.maxDate = $scope.payDates.search_payDateEnd || "";
		$scope.$broadcast('pickerUpdate', ['search_payDateStart'], {
			maxDate: $scope.payDates.maxDate,
		});
	});
	/**
	 * 获取查询参数
	 */
	function getQueryParam() {
		var queryParam = {
			supplierID: $scope.search_supplierID || '',
			cityID: $scope.search_cityID || '',
			goodsID: $scope.search_goodsID || '',
			statisticsType:$scope.search_type || 1,//统计类型
			startTime: $scope.dates.search_startTime ? $scope.dates.search_startTime.format('YYYY-MM-DD') : "",
			endTime: $scope.dates.search_endTime ? $scope.dates.search_endTime.format('YYYY-MM-DD') : "",
			payDateStart: $scope.payDates.search_payDateStart ? $scope.payDates.search_payDateStart.format('YYYY-MM-DD') : "",
			payDateEnd: $scope.payDates.search_payDateEnd ? $scope.payDates.search_payDateEnd.format('YYYY-MM-DD') : "",
			registDate: $scope.months[($scope.search_month || 0)],
			ticket : $location.$$search.ticket,
			domain : $location.$$search.domain
		};
		return queryParam;
	}
	function initializationDate() {
		//获取初始时间
		var startTime = getLastMonthYestdy() || '';
		var endTime = getCurrentMonthYestdy() || '';
		$scope.dates = {
			today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
			minDate: moment(startTime), //初始化最小值
			maxDate: moment(endTime), //初始化最大值
			search_startTime: moment(startTime), //初始化开始时间
			search_endTime: moment(endTime) //初始化结束时间
		};
		$scope.payDates = {
			today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
			minDate: moment("2015-12-06 12:13:24")
		};
		$scope.startDate = startTime;
		$scope.endDate = endTime;
		$scope.currentDate = $scope.months[0];
		$scope.search_supplierID = '';
		$scope.search_cityID = '';
		$scope.search_goodsID = '';
		$scope.search_type = '';
		$scope.search_month = '';
	}
	/**
	 * tab页签切换
	 * @param {Object} num
	 */
	$scope.setActive = function(num) {
		$scope.isActive = num;
		//切换置空数据或默认数据
		initializationDate();
		var params = getQueryParam();
		/*if($scope.isActive==1){
			$scope.findButton=true;
			$scope.exportShow=false;
			var result = listNewUserForRegist(params);
			if(params.statisticsType != 2){
				newUserForRegistDay(result);
			}else{
				newUserForRegistMonth(result);
			}
		}else */if($scope.isActive==2){
			$scope.findButton=true;
			$scope.exportShow=false;
			listRegistUserForSupplier(params);
		}else if($scope.isActive==3){
			$scope.findButton=true;
			$scope.exportShow=true;
			listPayCondition(params);
		}else if($scope.isActive==4){
			$scope.findButton=true;
			$scope.exportShow=true;
			listPayPlanForFail(params);
		}else{
			$scope.isActiveDay=1;
			$scope.findButton=false;
			$scope.exportShow=false;
			var param=getParams();
			param["period"]=0;
			getResult();
		}
	};
	
	/**
	 * 新增用户趋势--按日按月统计切换事件
	 */
	$scope.change = function() {
		var startTime = getLastMonthYestdy() || '';
		var endTime = getCurrentMonthYestdy() || '';
		$scope.dates = {
			today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
			minDate: moment(startTime), //初始化最小值
			maxDate: moment(endTime), //初始化最大值
			search_startTime: moment(startTime), //初始化开始时间
			search_endTime: moment(endTime) //初始化结束时间
		};
		$scope.payDates = {
			today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
			minDate: moment("2015-12-06 12:13:24")
		};
		$scope.startDate = startTime;
		$scope.endDate = endTime;
		$scope.currentDate = $scope.months[0];
		$scope.search_supplierID = '';
		$scope.search_cityID = '';
		$scope.search_goodsID = '';
		$scope.search_month = '';
		var params = getQueryParam();
		var result = listNewUserForRegist(params);
		if(params.statisticsType != 2){
			newUserForRegistDay(result);
		}else{
			newUserForRegistMonth(result);
		}
	};
	
	 /**
	 * 查找按钮
	 */
	$scope.findResult = function(){
		var params = getQueryParam(); //初始化参数信息
		$scope.oldInfo = params;
		$scope.startDate = $scope.oldInfo.startTime;
		$scope.endDate = $scope.oldInfo.endTime;
		/*if($scope.isActive==1){
			var result = listNewUserForRegist($scope.oldInfo);
			if(params.statisticsType != 2){
				newUserForRegistDay(result);
			}else{
				newUserForRegistMonth(result);
			}
		}else*/ if($scope.isActive==2){
			listRegistUserForSupplier(params);
		}else if($scope.isActive==3){
			listPayCondition(params);
		}else if($scope.isActive==4){
			listPayPlanForFail(params);
		}
	};
	/**
	 * 获取商品列表
	 */
	function listGoods() {
		$http({
			method: 'post',
			data: {payType:2,ticket:$location.$$search.ticket,domain:$location.$$search.domain},
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
		} else {
			userAuth.isLogin(response.data);
		}

	}, function errorCallback() {
		showError.showErrorMsg("网络异常加载城市列表失败");
	});


    var supplierNamesObj = new Array();
    var supplierNamesArr = new Array();
	//获取供应商列表
	function supplierList() {
		$http({
			method: 'post',
			data: {ticket:$location.$$search.ticket,domain:$location.$$search.domain,status:'N'},
			url: serverUrl + '/supplierManager/querySupplierList'
		}).then(function successCallback(response) {
			if (response.data.errorCode == 0) {
				$scope.suppliers = response.data.data;
				var suppliers = new Array(); //供应商数组
				suppliers = response.data.data;
				for (var s in suppliers) {
					var supplierNameItem = {
						name: suppliers[s].supplierName,
						color: '#666'
					}
					supplierNamesObj.push(supplierNameItem);
					supplierNamesArr.push(suppliers[s].supplierName);
				}
			} else {
				userAuth.isLogin(response.data);
				showError.showErrorMsg('获取供应商列表失败');
			}
		}, function errorCallback(response) {
			showError.showErrorMsg('获取供应商列表失败--网络错误');
		});
	};

	/**
	 * 新增用户趋势
	 */
	function listNewUserForRegist(obj) {
		var result = new Object();
		console.log("---新增用户趋势--参数 ：");
		console.log(obj);
		httpUtils.req(JSON.stringify(obj), serverUrl + 'userManager/queryNewUserForRegist')
			.then(function successCallback(response) {//同步，先获取数据再绘图
					console.log("---新增用户趋势--response ："+response);
					if (response.data.errorCode == 0) {
						$scope.newUserNumber = response.data.data.newUserNumber;
						$scope.allUserNumber = response.data.data.allUserNumber;
						var userList = new Object();
						userList = response.data.data.userList;
						result = userList;
						console.info('新增用户趋势result:');
						console.info(result);
					}else{
						userAuth.isLogin(response.data);
					}
				},
				function errorCallback(response) {}
			);
		return result;
	}
	
	
	/**
	 * 描述:新增用户--按日统计 --折线图
	 * @param {Object} result
	 */
	function newUserForRegistDay(result) {
		console.log('新增用户--按日统计 --折线图');
		console.log('$scope.search_month:'+$scope.search_month);
		var legendArr = new Array();
		var yDataArr = new Array();
		var xDataArr = orderTrade($scope.months[($scope.search_month || 0)]);
		$scope.currentDate = $scope.months[($scope.search_month || 0)];
		if (result && result.length > 0) {
			console.info('result.length:'+result.length);
			for (var i = 0; i < result.length; i++) {
				var tmp = result[i];
				var yData = {};
				var legend = {};
				var data = new Array();
				for (var k = 0; k < xDataArr.length; k++) {
					data.push('-');
				}
				yData.name = tmp.supplierName;
				legend.name = tmp.supplierName;
				if (tmp.days.length > 0) {
					for (var j = 0; j < tmp.days.length; j++) {
						for (var n = 0; n < xDataArr.length; n++) {
							if (xDataArr[n] == tmp.days[j].registDate) {
								data[n] = tmp.days[j].userNum;
							}
						}
					}
				}
				yData.data = data;
				yDataArr.push(yData);
				legendArr.push(legend);
				
			}
			console.log('xDataArr:');
			console.log(xDataArr);
			
			var small = {
				title: "新增用户(/人)",
				legend: legendArr,
				xData: xDataArr,
				yData: yDataArr
			};
		} else {
			var small = null;
		}
		$scope.userDay = small;
	}



	/**
	 * 描述:新增用户--按月统计 --折线图
	 * @param {Object} result
	 */
	function newUserForRegistMonth(result) {
		console.log('新增用户--按月统计 --折线图');
		var legendArr = new Array();
		var yDataArr = new Array();
		var xDataArr = getDate().sort();
		console.info(result);
		if (result && result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				var tmp = result[i];
				var yData = {};
				var legend = {};
				yData.name = tmp.supplierName;
				legend.name = tmp.supplierName;
				var data = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'];
				if (tmp.days.length > 0) {
					for (var j = 0; j < tmp.days.length; j++) {
						for (var n = 0; n < 12; n++) {
							if (xDataArr[n] == tmp.days[j].registDate) {
								data[n] = tmp.days[j].userNum;
							}
						}
					}
				}
				yData.data = data;
				yDataArr.push(yData);
				legendArr.push(legend);
			}
			$scope.startDate = xDataArr[0];
			$scope.endDate = xDataArr[xDataArr.length - 1];
			var small = {
				title: "新增用户(/人)",
				legend: legendArr,
				xData: xDataArr,
				yData: yDataArr
			};
		} else {
			var small = null;
		}

		$scope.userMonth = small;
	}
	
	/**
	 * 供应商用户量比对
	 */
	function listRegistUserForSupplier(obj) {
		console.log("---供应商用户量比对--参数 ："+obj.startTime +','+obj.endTime);
		$http({
			method: 'post',
			data: obj,
			url: serverUrl + '/userManager/queryRegistUserForSupplier'
		}).then(function successCallback(response) {
			console.log("---供应商用户量比对 数据："+response.data.errorCode);
			if (response.data.errorCode == 0) {
				console.log("---供应商用户量比对 sumUserNum数据："+response.data.data.sumUserNum);
				console.log("---供应商用户量比对 数据："+JSON.stringify(response.data.data));
				$scope.sumUserNum = response.data.data.sumUserNum;
				$scope.userList = response.data.data.userList;
				var userList = $scope.userList;
				var supplierUser = new Array();
				var xDataArr = new Array();
				
				for(var i=0;i<userList.length;i++){
					xDataArr.push(userList[i].supplierName);
					supplierUser.push(userList[i].userNum);
				}
				var small2={
				    xData:xDataArr,
				    yData:[
				      {
				        data:supplierUser,
				        color:"#e0e0e0",
				        textColor:"#666",
				        fontSize:20
				      }
				    ]
				};
				$scope.registUserForSupplier=small2;
			} else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "加载供应商用户量比对数据失败!";
				$scope.PopHide = true;
			}
		})
	}
	/**
	 * 用户还款分析
	 */
	function listPayCondition(obj) {
		console.log("---用户还款分析--参数 ：");
		console.log(obj);
		$http({
			method: 'post',
			data: obj,
			url: serverUrl + '/userManager/queryPayCondition'
		}).then(function successCallback(response) {
			console.log("---用户还款分析数据--错误标识："+response.data.errorCode);
			if (response.data.errorCode == 0) {
				console.log("---用户还款分析数据："+response.data.data);
				$scope.payConditionDetail = response.data.data;
				$scope.total = response.data.data.length;
				var payConditionDetail = $scope.payConditionDetail;
				var billNumberSum=0, advancedAmountSum=0, payfeeSum=0, surplusPayfeeSum=0;
				for(var i in payConditionDetail){
					billNumberSum = billNumberSum + parseFloat(payConditionDetail[i].billNumber);
					advancedAmountSum = advancedAmountSum + parseFloat(payConditionDetail[i].advancedAmount);
					payfeeSum = payfeeSum + parseFloat(payConditionDetail[i].payfee);
					surplusPayfeeSum = surplusPayfeeSum + parseFloat(payConditionDetail[i].surplusPayfee);
				}
				$scope.billNumberSum = billNumberSum;
				$scope.advancedAmountSum = advancedAmountSum.toFixed(2);
				$scope.payfeeSum = payfeeSum.toFixed(2);
				$scope.surplusPayfeeSum = surplusPayfeeSum.toFixed(2);
			} else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "加载用户还款分析列表失败!";
				$scope.PopHide = true;
			}
		})
	}
	/**
	 * 坏账账单分析
	 */
	function listPayPlanForFail(obj) {
		console.log("---坏账账单分析--参数 ："+obj.goodsID +','+obj.cityID+','+obj.payDateStart+','+obj.payDateEnd);
		$http({
			method: 'post',
			data: obj,
			url: serverUrl + '/userManager/queryPayPlanForFail'
		}).then(function successCallback(response) {
			if (response.data.errorCode == 0) {
				$scope.payPlanForFailDetail = response.data.data;
				$scope.total = response.data.data.length;
				var payPlanForFailDetail = $scope.payPlanForFailDetail;
				var billNumberSum=0, advancedAmountSum=0, payfeeSum=0, surplusPayfeeSum=0;
				for(var i in payPlanForFailDetail){
					billNumberSum = billNumberSum + parseFloat(payPlanForFailDetail[i].billNumber);
					advancedAmountSum = advancedAmountSum + parseFloat(payPlanForFailDetail[i].advancedAmount);
					payfeeSum = payfeeSum + parseFloat(payPlanForFailDetail[i].payfee);
					surplusPayfeeSum = surplusPayfeeSum + parseFloat(payPlanForFailDetail[i].surplusPayfee);
				}
				$scope.billNumberSum = billNumberSum;
				$scope.advancedAmountSum = advancedAmountSum.toFixed(2);
				$scope.payfeeSum = payfeeSum.toFixed(2);
				$scope.surplusPayfeeSum = surplusPayfeeSum.toFixed(2);
			} else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "加载坏账账单分析列表失败!";
				$scope.PopHide = true;
			}
		})
	}
	$scope.setActive(5);
	/**
	 * 获取当前日期前12个月
	 */
	function getDate() {
		var dateArr = new Array();
		var myDate = new Date();
		var month = myDate.getMonth() + 2;
		var year = myDate.getFullYear();
		for (var i = 0; i < 12; i++) {
			month--;
			if (month == 0) {
				year--;
				month = 12;
			}
			if (month < 10) {
				dateArr.push(year + "-0" + month)
			} else {
				dateArr.push(year + "-" + month)
			}
		}
		return dateArr;
	}

	//获得下个月在昨天这一天的日期
	function getLastMonthYestdy() {
		var date = new Date();
		var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
		var strYear = date.getFullYear();
		var strDay = date.getDate();
		var strMonth = date.getMonth() + 1;
		if (strYear % 4 == 0 && strYear % 100 != 0) {
			daysInMonth[2] = 29;
		}
		if(strDay - 1 == 0 && strMonth - 1 == 0){
			strYear -= 1;
			strMonth = 12;
			strDay = daysInMonth[strMonth];
		}
		if (strDay - 1 == 0) {
			strMonth -= 1;
			strDay = daysInMonth[strMonth];
		} else {
			strDay -= 1;
		}
		if (strMonth - 1 == 0) {
			strYear -= 1;
			strMonth = 12;
		} else {
			strMonth -= 1;
		}
		
		strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
		if (strMonth < 10) {
			strMonth = "0" + strMonth;
		}
		if (strDay < 10) {

			strDay = "0" + strDay;
		}

		var datastr = strYear + "-" + strMonth + "-" + strDay;
		return datastr;
	}

	/**
	 * 根据月份获取当月的具体日期
	 * @param {Object} monthDate
	 */
	function orderTrade(monthDate) {
		var dateArr = new Array();
		var date = new Date(monthDate);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var fristDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var secondDay = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var days = (year % 4 == 0 ? secondDay : fristDay);
		for (var i = 1; i <= days[month - 1]; i++) {
			dateArr.push(year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (i < 10 ? ("0" + i) : i));
		}
		return dateArr;
	}

	//获取昨天的日期
	function getCurrentMonthYestdy() {
		var dd = new Date();
		dd.setDate(dd.getDate() - 1); //获取1天前的日期
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1; //获取当前月份的日期
		var d = dd.getDate();
		return y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d);
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
		var result = new Array();
		var params =getQueryParam()||{}; //初始化参数信息 ;
		$scope.isReal = false;
		var param = {};
		if(params.goodsID&&params.goodsID!=null){
			param.key = "分期商品:";
			$scope.goods.forEach(function(goods_){
				if (goods_.goodsID ==goods_.goodsID) {
					param.value = goods_.goodsName;
				} 
			});
			result.push(param);
			$scope.isReal = true;
		}
		param = {};
		if(params.cityID&&params.cityID!=null){
			param.key = "城市:";
			$scope.citys.forEach(function(price){
				if (price.cityID ==params.cityID) {
					param.value = price.cityName;
				} 
			});
			result.push(param);
			$scope.isReal = true;
		}
	
		param = {};
		if(params.payDateStart&&params.payDateStart!=null){
			param.key = "还款日期-始:";
			param.value =params.payDateStart;
			result.push(param);
			$scope.isReal = true;
		}
		
		param = {};
		if(params.payDateEnd&&params.payDateEnd!=null){
			param.key = "还款日期-终:";
			param.value =params.payDateEnd;
			result.push(param);
			$scope.isReal = true;
		}

		
		return result;
	}
	/**
	 * 导出excel
	 */
	$scope.exportExcel = function() {
		var queryParam = {
				cityID: $scope.search_cityID || '',
				goodsID: $scope.search_goodsID || '',
				payDateStart: $scope.payDates.search_payDateStart ? $scope.payDates.search_payDateStart.format('YYYY-MM-DD') : "",
				payDateEnd: $scope.payDates.search_payDateEnd ? $scope.payDates.search_payDateEnd.format('YYYY-MM-DD') : "",
				ticket : $location.$$search.ticket,
				domain : $location.$$search.domain
			};
		exportReport(queryParam);
	};


	/**
	 * 导出excel
	 * @param {Object} obj
	 */
	function exportReport(obj) {
		var url_=$scope.isActive==3?serverUrl + 'exportManager/exportPayCondition':serverUrl + 'exportManager/exportPayPlanForFail'
		$http({
			method: 'post',
			data: obj,
			url: url_
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
	
	$scope.isActiveDay=1;
	$scope.period=0;
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
		var param=getParams();
		param["period"]=$scope.period;
		getResult();
	}
	
	//获取参数信息
	function getParams() {
		var obj = {
			period:$scope.period||"",
			ticket: $location.$$search.ticket,
			domain: $location.$$search.domain
		}
		return obj;
	}
	//准备绘图信息
	function getResult() {
		var param=getParams();
		 param["period"]=$scope.period;
			var firstList = getInfo(param, '/userManager/queryUserCondition');
			$scope.operationoption1=getAgeLine(firstList.data.agePeriod||"");
			$scope.operationoption2=getSexLine(firstList.data.sexPeriod||"");
			$scope.operationoption3=getDeviceLine(firstList.data.devicePeriod||"");
			$scope.operationoption4=getCityLine(firstList.data.cityPeriod||"");
		
		
	
	}
	
	function getAgeLine(result) {
		var small = null;
		if(result!=""&&result!=undefined){
			var age=new Array();
			for (var key in result) {
				var name=key=="period_1"?"18-24岁":key=="period_2"?"25-34岁":key=="period_3"?"35-44岁":key=="period_4"?"45-54岁":key=="period_5"?"55-64岁":"65岁以上";
				var a={"value":result[key].replace("%",""),"name":name};
				age.push(a);
			}
			console.log(age); // key 属性名, 此处 做为值存在.
			small={title:"年龄分布",series:age};
		}
	return small;
	}
	
	function getSexLine(result){
		var small = null;
		if(result!=""&&result!=undefined){
			var sex=new Array();
			for (var key in result) {
				var name=key=="female"?"女":"男";
				var a={"value":result[key].replace("%",""),"name":name};
				sex.push(a);
			}
			small={title:"性别分布",series:sex};
		}
	return small;
	}
	function getDeviceLine(result){
		var small = null;
		if(result!=""&&result!=undefined){
			var dev=new Array();
			for (var key in result) {
				var name=key=="ios"?"IOS设备":"android设备";
				var a={"value":result[key].replace("%",""),"name":name};
				dev.push(a);
			}
			small={title:"设备分布",series:dev};
		}
	return small;
	}
	function getCityLine(result){
		var seriesData = new Array();
		var small = null;
		if(result!=""&&result.length>0){
			for(var i=0;i<result.length;i++){
				var a={"value":result[i].rate.replace("%",""),"name":result[i].cityName};
				seriesData.push(a);
			}
		}
		small ={title: "地域分布",series: seriesData};
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
						$scope.list=response.data||"";
						result = $scope.list;
					} else {
						userAuth.isLogin(response.data);
					}
				},
				function errorCallback(response) {});
		return result;
	}
}]);
