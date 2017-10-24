'use strict';

app.
controller('orderStatisticsCtrl', ["$scope", "$http", "$timeout", "$location", "serverUrl", "openCity", "httpUtils", "userAuth", function($scope, $http, $timeout, $location, serverUrl, openCity, httpUtils, userAuth) {
	//导航跳转
	$scope.goTo = function(address) {
		$location.path(address);
	};
	//初始化当月下拉列表
	$scope.months = getDate();
	$scope.monthsInfo = $scope.months;
	$scope.monthsInfo = $scope.monthsInfo.slice(1);
	listSupplier(); //加载供应商列表
	listGoods(); //加载商品列表
	initializationDate(); //初始化时间


	//监控开始时间 改变时广播通知页面修改最小日期
	$scope.$watch('dates.search_createTimeStart', function() {
		$scope.dates.minDate = $scope.dates.search_createTimeStart || '';
		$scope.$broadcast('pickerUpdate', ['search_createTimeEnd'], {
			minDate: $scope.dates.minDate,
		});

	});

	//监控结束时间 改变时广播通知页面修改最大日期
	$scope.$watch('dates.search_createTimeEnd', function() {
		$scope.dates.maxDate = $scope.dates.search_createTimeEnd || '';
		$scope.$broadcast('pickerUpdate', ['search_createTimeStart'], {
			maxDate: $scope.dates.maxDate,
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
			type: $scope.search_type || 1,
			businessStartDate: $scope.dates.search_createTimeStart ? $scope.dates.search_createTimeStart.format('YYYY-MM-DD') : "",
			businessEndDate: $scope.dates.search_createTimeEnd ? $scope.dates.search_createTimeEnd.format('YYYY-MM-DD') : "",
			monthDate: $scope.months[($scope.search_month || 0)],
			ticket: $location.$$search.ticket,
			domain: $location.$$search.domain
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
			search_createTimeStart: moment(startTime), //初始化开始时间
			search_createTimeEnd: moment(endTime) //初始化结束时间
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

	//查找按钮
	$scope.findResult = function() {
		var params = getQueryParam(); //初始化参数信息
		$scope.oldInfo = params;
		getResult($scope.oldInfo);
	};

	/**
	 * 获取接口列表
	 */
	function getPath(params) {
		var serverPath = "";
		if ($scope.isActive == 1 && params.type != 2) {
			serverPath = 'tradeManager/tradeStatisticsForSupplierDay';
		} else if ($scope.isActive == 1 && params.type == 2) {
			serverPath = 'tradeManager/tradeStatisticsForSupplierMonth';
		} else if ($scope.isActive == 2 && params.type != 2) {
			serverPath = 'tradeManager/tradeStatisticsForGoodsDay';
		} else if ($scope.isActive == 2 && params.type == 2) {
			serverPath = 'tradeManager/tradeStatisticsForGoodsMonth';
		} else if ($scope.isActive == 3 && params.type != 2) {
			serverPath = 'tradeManager/tradeStatisticsForOrderDay';
		} else if ($scope.isActive == 3 && params.type == 2) {
			serverPath = 'tradeManager/tradeStatisticsForOrderMonth';
		}
		return serverPath;
	}


	/**
	 * 获取数据
	 * @param {Object} param
	 * @param {Object} serverPath
	 */
	function getInfo(params, serverPath, listName) {
		var result = "";
		httpUtils.req(JSON.stringify(params), serverUrl + serverPath)
			.then(function successCallback(response) {
					if (response.data.errorCode == 0) {
						$scope.total = response.data.data.sumAmount;
						$scope.monthOrderNumber = response.data.data.monthOrderNumber;
						$scope.sumOrderNumber = response.data.data.sumOrderNumber;
						$scope.list = response.data.data[listName];
						result = $scope.list;
					} else {
						userAuth.isLogin(response.data);
					}
				},
				function errorCallback(response) {

				});
		return result;
	}


	/**
	 * 导出excel的按钮
	 */
	$scope.exportExcel = function() {
		var obj = $scope.oldInfo || {};
		var path = "";
		if ($scope.isActive == 1) {
			path = 'tradeManager/downloadTradeStatisticsDetailForSupplier';
		} else if ($scope.isActive == 2) {
			path = 'tradeManager/downloadTradeStatisticsDetailForGoods';
		} else {
			path = 'tradeManager/downloadTradeStatisticsDetailForOrder';
		}
		exportReport(obj, path);
	};


	/**
	 * 导出excel
	 * @param {Object} obj
	 */
	function exportReport(obj, path) {
		$http({
			method: 'post',
			data: obj,
			url: serverUrl + path
		}).then(function successCallback(response) {
			if (response.data.errorCode == 0) {
				$scope.reportUrl = response.data.data.reportUrl;
				window.location.href = $scope.reportUrl;
			} else {
				alert("导出EXCEL失败");
			}
		})
	}

	/**
	 * tab页签切换
	 * @param {Object} num
	 */

	$scope.setActive = function(num) {
		//切换参数清空
		$scope.isActive = num;
		initializationDate();

		var params = getQueryParam();
		getResult(params);
	};

	/**
	 * 按日按月统计切换事件
	 */
	$scope.change = function() {
		//		initializationDate();
		var startTime = getLastMonthYestdy() || '';
		var endTime = getCurrentMonthYestdy() || '';
		$scope.dates = {
			today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
			minDate: moment(startTime), //初始化最小值
			maxDate: moment(endTime), //初始化最大值
			search_createTimeStart: moment(startTime), //初始化开始时间
			search_createTimeEnd: moment(endTime) //初始化结束时间
		};
		$scope.startDate = startTime;
		$scope.endDate = endTime;
		$scope.currentDate = $scope.months[0];
		$scope.search_supplierID = '';
		$scope.search_cityID = '';
		$scope.search_goodsID = '';
		$scope.search_month = '';
		var params = getQueryParam();
		getResult(params);
	};


	function getResult(params) {
		var serverPath = getPath(params);
		if ($scope.isActive == 1 && params.type != 2) {
			$scope.startDate = params.businessStartDate;
			$scope.endDate = params.businessEndDate;
			var result = getInfo(params, serverPath, 'amountList');
			supplierDay(result);
		} else if ($scope.isActive == 1 && params.type == 2) {
			var result = getInfo(params, serverPath, 'amountList');
			supplierMonth(result);
		} else if ($scope.isActive == 2 && params.type != 2) {
			$scope.startDate = params.businessStartDate;
			$scope.endDate = params.businessEndDate;
			var result = getInfo(params, serverPath, 'amountList');
			goodsDay(result);
		} else if ($scope.isActive == 2 && params.type == 2) {
			var result = getInfo(params, serverPath, 'amountList');
			goodsMonth(result);
		} else if ($scope.isActive == 3 && params.type != 2) {
			var result = getInfo(params, serverPath, 'orderList');
			orderTradeDay(result);
		} else if ($scope.isActive == 3 && params.type == 2) {
			var result = getInfo(params, serverPath, 'orderList');
			orderTradeMonth(result);
		}
	}

	/**
	 * 描述:供应商交易按日统计 柱形图
	 * @param {Object} result
	 */
	function supplierDay(result) {
		var yDataArr = new Array();
		var xDataArr = new Array();
		var data = new Array();
		if (result && result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				xDataArr.push(result[i].supplierName);
				data.push(result[i].amount);
			}
			var yData = {};
			yData.color = '#e0e0e0';
			yData.textColor = "#666";
			yData.fontSize = 20;
			yData.data = data;
			yDataArr.push(yData);

			var small = {
				xData: xDataArr,
				yData: yDataArr
			};

		} else {
			var small = null;
		}


		$scope.small = small;

	}


	/**
	 * 描述:供应商交易按月统计 折线图
	 * @param {Object} result
	 */
	function supplierMonth(result) {
		var legendArr = new Array();
		var yDataArr = new Array();
		var xDataArr = getDate().sort();
		if (result && result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				var tmp = result[i];
				var yData = {};
				var legend = {};
				yData.name = tmp.supplierName;
				legend.name = tmp.supplierName;
				var data = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'];
				if (tmp.months.length > 0) {
					for (var j = 0; j < tmp.months.length; j++) {
						for (var n = 0; n < 12; n++) {
							if (xDataArr[n] == tmp.months[j].businessMonth) {
								data[n] = tmp.months[j].amount;
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
				title: "单位(元)",
				legend: legendArr,
				xData: xDataArr,
				yData: yDataArr
			};
		} else {
			var small = null;
		}

		$scope.small2 = small;
	}


	/**
	 * 描述:商品交易按日统计 柱形图
	 * @param {Object} result
	 */
	function goodsDay(result) {
		var yDataArr = new Array();
		var xDataArr = new Array();
		var data = new Array();
		if (result && result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				xDataArr.push(result[i].goodsName);
				data.push(result[i].amount);
			}
			var yData = {};
			yData.barWidth = 30;
			yData.color = '#e0e0e0';
			yData.textColor = "#666";
			yData.fontSize = 12;
			yData.data = data;
			yDataArr.push(yData);

			var small = {
				xData: xDataArr,
				yData: yDataArr,
				bottom: 200,
				xAxis: {
					rotate: 90,
					fontSize: 11,
					color: "#f00"

				}
			};

		} else {
			var small = null;
		}
		$scope.small3 = small;

	}



	/**
	 * 描述:供应商交易按月统计 折线图
	 * @param {Object} result
	 */
	function goodsMonth(result) {
		var yDataArr = new Array();
		var xDataArr = getDate().sort();
		if (result && result.length > 0) {
			var data = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'];
			for (var i = 0; i < result.length; i++) {
				var tmp = result[i];
				var yData = {};
				for (var n = 0; n < 12; n++) {
					if (xDataArr[n] == tmp.businessMonth) {
						data[n] = tmp.amount;
					}
				}
			}
			yData.data = data;
			yDataArr.push(yData);
			$scope.startDate = xDataArr[0];
			$scope.endDate = xDataArr[xDataArr.length - 1];
			var small = {
				title: "单位(元)",
				xData: xDataArr,
				yData: yDataArr
			};

		} else {
			var small = null;
		}
		$scope.small4 = small;
	}



	/**
	 * 描述:订单交易按日统计 折线图
	 * @param {Object} result
	 */
	function orderTradeDay(result) {
		console.info(result);
		var legendArr = new Array();
		var yDataArr = new Array();
		var xDataArr = orderTrade($scope.months[($scope.search_month || 0)]);
		$scope.currentDate = $scope.months[($scope.search_month || 0)];
		if (result && result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				var tmp = result[i];
				console.info(tmp);
				var yData = {};
				var legend = {};
				yData.name = tmp.supplierName;
				legend.name = tmp.supplierName;
				var data = new Array();
				for (var k = 0; k < xDataArr.length; k++) {
					data.push('-');
				}
				if (tmp.days.length > 0) {
					for (var j = 0; j < tmp.days.length; j++) {
						for (var n = 0; n < xDataArr.length; n++) {
							if (xDataArr[n] == tmp.days[j].businessDate) {
								data[n] = tmp.days[j].orderNumber;
							}
						}
					}
					yData.data = data;
					yDataArr.push(yData);
				}

				legendArr.push(legend);
			}
			var small = {
				legend: legendArr,
				xData: xDataArr,
				yData: yDataArr
			};
		} else {
			var small = null;
		}
		console.info(small);
		$scope.small5 = small;
	}



	/**
	 * 描述:订单交易按月统计 折线图
	 * @param {Object} result
	 */
	function orderTradeMonth(result) {
		var legendArr = new Array();
		var yDataArr = new Array();
		var xDataArr = getDate().sort();
		if (result && result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				var tmp = result[i];
				var yData = {};
				var legend = {};
				yData.name = tmp.supplierName;
				legend.name = tmp.supplierName;
				var data = ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'];
				if (tmp.months.length > 0) {
					for (var j = 0; j < tmp.months.length; j++) {
						for (var n = 0; n < 12; n++) {
							if (xDataArr[n] == tmp.months[j].businessDate) {
								data[n] = tmp.months[j].orderNumber;
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
				legend: legendArr,
				xData: xDataArr,
				yData: yDataArr
			};
		} else {
			var small = null;
		}

		$scope.small6 = small;
	}

	/**
	 * 去除重复
	 * @param {Object} arr
	 */
	function unique(arr) {
		var result = [],
			hash = {};
		for (var i = 0, elem;
			(elem = arr[i]) != null; i++) {
			if (!hash[elem]) {
				result.push(elem);
				hash[elem] = true;
			}
		}
		return result;
	}

	$scope.setActive(1);

	function getColor() {
		var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
		return '#' + a[parseInt(Math.random() * (a.length))] + '' + a[parseInt(Math.random() * (a.length))] + '' + a[parseInt(Math.random() * (a.length))] + '' + a[parseInt(Math.random() * (a.length))] + '' + a[parseInt(Math.random() * (a.length))] + '' + a[parseInt(Math.random() * (a.length))];
	}

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



	/**
	 * 获取供应商列表
	 */
	function listSupplier() {
		$http({
			method: 'post',
			data: {
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain,
				status: 'N'
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
		} else {
			userAuth.isLogin(response.data);
		}
	}, function errorCallback() {});



}]);