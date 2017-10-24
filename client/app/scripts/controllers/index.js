'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
app
	.controller('indexCtrl', ["$scope", "$http", "serverUrl", "openCity", "httpUtils","$location", "userAuth", function($scope, $http, serverUrl, openCity, httpUtils,$location, userAuth) {
		//初始化时间
		var days = getRecently();
		$scope.startDate = days[0];
		$scope.endDate = days[days.length - 1];

		getResult();


		//查找按钮
		$scope.search = function() {
			var params = getParams();
			$scope.oldParams = params;
			getResult();
		}

		//准备绘图信息
		function getResult() {
			var params = $scope.oldParams ? $scope.oldParams : {
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain
			};
			var userList = getInfo(params, 'homePage/queryUserForMonth', 'userList');
			var orderList = getInfo(params, 'homePage/queryOrderForMonth', 'orderList');
			var amountList = getInfo(params, 'homePage/querySummaryForMonth', 'amountList');
			$scope.option1 = getLine(userList, 'userNum', 'countDate', '新增用户(/个)');
			$scope.option2 = getLine(orderList, 'userNum', 'countDate', '交易订单数(/个)');
			$scope.option3 = getLine(amountList, 'amount', 'dayTime', '用户交易额 (/元)');
		}


		//查询最近一个月订单数趋势
		function getLine(result, amount, countDate, title) {
			var yDataArr = new Array();
			var xDataArr = days.sort();
			var data = new Array();
			var small = null;
			for (var i = 0; i < xDataArr.length; i++) {
				data.push('-');
			}
			if (result && result.length > 0) {
				for (var i = 0; i < result.length; i++) {
					var tmp = result[i];
					var yData = {};
					for (var n = 0; n < xDataArr.length; n++) {
						if (xDataArr[n] == tmp[countDate]) {
							data[n] = tmp[amount];
						}
					}
				}
				yData.data = data;
				yDataArr.push(yData);
				$scope.startDate = xDataArr[0];
				$scope.endDate = xDataArr[xDataArr.length - 1];
				small = {
					title: title,
					xData: xDataArr,
					yData: yDataArr
				};

			}
			return small;
		}



		//获取参数信息
		function getParams() {
			var obj = {
				cityID: $scope.selectCity || false,
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain
			}
			return obj;
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
							console.info(response.data.data);
							var totalUser = response.data.data.totalUser;
							var totalOrder = response.data.data.totalOrder;
							var totalAmount = response.data.data.totalAmount;
							var yesterdayNewAmount = response.data.data.yesterdayNewAmount;
							var yesterdayNewUser = response.data.data.yesterdayNewUser;
							var yesterdayNewOrder = response.data.data.yesterdayNewOrder;
							var monthNewUser = response.data.data.monthNewUser;
							var monthNewOrder = response.data.data.monthNewOrder;
							var monthNewAmount = response.data.data.monthNewAmount;
							if (totalUser != null) {
								$scope.totalUser = totalUser;
							}
							if (totalOrder != null) {
								$scope.totalOrder = totalOrder;
							}
							if (totalAmount != null) {
								$scope.totalAmount = totalAmount;
							}
							if (yesterdayNewAmount != null) {
								$scope.yesterdayNewAmount = yesterdayNewAmount;
							}
							if (yesterdayNewUser != null) {
								$scope.yesterdayNewUser = yesterdayNewUser;
							}
							if (yesterdayNewOrder != null) {
								$scope.yesterdayNewOrder = yesterdayNewOrder;
							}
							if (monthNewUser != null) {
								$scope.monthNewUser = monthNewUser;
							}
							if (monthNewOrder != null) {
								$scope.monthNewOrder = monthNewOrder;
							}
							if (monthNewAmount != null) {
								$scope.monthNewAmount = monthNewAmount;
							}

							$scope.list = response.data.data[listName];
							result = $scope.list;
						} else {
							userAuth.isLogin(response.data);
						}
					},
					function errorCallback(response) {});
			return result;
		}



		//获取最近一个月的日期
		function getRecently() {
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var fristDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var secondDay = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var days = (year % 4 == 0 ? secondDay : fristDay);
			var monthDay = new Array();
			for (var i = 0; i < days[(month - 2 < 0 ? 11 : month - 2)]; i++) {
				date.setDate(date.getDate() - 1); //获取1天前的日期

				var y = date.getFullYear();
				var m = date.getMonth() + 1; //获取当前月份的日期
				var d = date.getDate();
				monthDay.push(y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d));
			}
			return monthDay;
		}

		/**
		 * 获取开通城市列表
		 */
		openCity.getOpenList().then(function successCallback(response) {
			if (response.data.errorCode == 0) {
				$scope.citys = response.data.data;
			}
		}, function errorCallback() {});
		$scope.demoSelect = "";
		$scope.optionSelect = [
			"333",
			"4444",
			"55555"
		];


	}]);