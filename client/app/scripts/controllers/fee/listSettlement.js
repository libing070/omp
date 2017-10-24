/**
 * Created by Administrator on 2015/12/4.
 */
'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app
	.controller('listSettlementCtrl', function($scope, $http, $timeout, $location, serverUrl, openCity, userAuth) {
		/**
		 * 初始化订单状态
		 */
		listSupplier(); //加载供应商列表
		listSettlement(null); //初始化列表
		/**
		 * 初始化科目状态
		 */
		$scope.subjectStatus = ['保费', '批改缴费', '批改退费'];

		//初始化最小时间与最大时间
		var endDate = new Date();
		var currentDate = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate()
		$scope.dates = {
			today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
			minDate: moment("2012-01-01"),
			maxDate: moment(currentDate)
		};

		$scope.$watch('dates.search_createTimeStart', function() {
			$scope.dates.minDate = $scope.dates.search_createTimeStart || '';
			$scope.$broadcast('pickerUpdate', ['search_createTimeEnd'], {
				minDate: $scope.dates.minDate,
			});

		});

		$scope.$watch('dates.search_createTimeEnd', function() {
			$scope.dates.maxDate = $scope.dates.search_createTimeEnd || '';
			$scope.$broadcast('pickerUpdate', ['search_createTimeStart'], {
				maxDate: $scope.dates.maxDate,
			});
		});
		/**
		 * 初始化参数信息
		 */
		function getInfo() {
			var queryParam = {
				supplierID: $scope.search_supplierID || '',
				cityID: $scope.search_cityID || '',
				operType: $scope.search_operType || '',
				subject: $scope.search_subject || '',
				createTimeStart: $scope.dates.search_createTimeStart ? $scope.dates.search_createTimeStart.format('YYYY-MM-DD HH:mm') : "",
				createTimeEnd: $scope.dates.search_createTimeEnd ? $scope.dates.search_createTimeEnd.format('YYYY-MM-DD HH:mm') : "",
				policyCustomerNo: $scope.search_policyCustomerNo || '',
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain
			};
			return queryParam;
		}

		/**
		 * 查找按钮
		 */
		$scope.findResult = function() {
			var obj = getInfo();
			//保存查找之后的数据 用于记录查找条件 排序时使用
			$scope.oldInfo = obj ? obj : {
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain
			};
			listSettlement(obj);
		};

		/**
		 * 取消操作
		 */
		$scope.cancel = function() {
			$scope.PopHide = false;
		};


		/**
		 * 导出excel的按钮
		 */
		$scope.exportExcel = function() {
			$scope.params = setArr();
			$scope.popShow = true;
		};

		/**
		 * 获取查找参数信息
		 */
		function setArr() {
			var result = new Array();
			var params = $scope.oldInfo || {};
			$scope.isReal = false;
			var param = {};
			if (params.supplierID && params.supplierID != null) {
				param.key = "供应商:";
				$scope.suppliers.forEach(function(price) {
					if (price.supplierID == params.supplierID) {
						param.value = price.supplierName;
					}
				});
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.cityID && params.cityID != null) {
				param.key = "城市:";
				$scope.citys.forEach(function(price) {
					if (price.cityID == params.cityID) {
						param.value = price.cityName;
					}
				});
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.createTimeStart && params.createTimeStart != null) {
				param.key = "起始日期:";
				param.value = params.createTimeStart;
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.createTimeEnd && params.createTimeEnd != null) {
				param.key = "终止日期:";
				param.value = params.createTimeEnd;
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.operType && params.operType != null) {
				param.key = "收入支出:";
				param.value = params.operType == 1 ? '收入' : '支出';
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.subject && params.subject != null) {
				param.key = "科目:";
				param.value = $scope.subjectStatus[params.subject - 1];
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.policyCustomerNo && params.policyCustomerNo != null) {
				param.key = "电子保单号:";
				param.value = params.policyCustomerNo;
				result.push(param);
				$scope.isReal = true;
			}

			return result;
		}

		//按时间排序
		$scope.sortStatus = -1;
		$scope.sortSign = "↓";
		$scope.doSort = function() {
			var obj = $scope.oldInfo ? $scope.oldInfo : {
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain
			};
			$scope.sortStatus = -$scope.sortStatus;
			if ($scope.sortStatus < 0) {
				$scope.sortSign = "↓";
				obj.sortDir = "DESC";
			} else {
				$scope.sortSign = "↑";
				obj.sortDir = "ASC";
			}
			obj.sortFieldName = "startDate";
			listSettlement(obj);
		};

		/**
		 * 获取开通城市列表
		 */
		openCity.getOpenList().then(function successCallback(response) {
			if (response.data.errorCode == 0) {
				$scope.citys = response.data.data;
			} else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "获取开通城市列表失败!";
				$scope.PopHide = true;
			}

		}, function errorCallback() {
			$scope.title = "提示";
			$scope.context = "网络异常加载城市列表失败!";
			$scope.PopHide = true;
		});





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
		 * 导出excel
		 * @param {Object} obj
		 */
		function exportReport(obj) {
			$http({
				method: 'post',
				data: obj,
				url: serverUrl + 'exportManager/exportSettlement'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.popShow = false;
					$scope.modalGoodsSuccess = true;
					$timeout(function() {
						$scope.modalGoodsSuccess = false
					}, 2000);
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

		//取消导出EXCEL
		$scope.cancelExport = function() {
			$scope.popShow = false;
		};
		//确定到处EXCEL
		$scope.ensureExportExcel = function() {
			var obj = $scope.oldInfo || {};
			obj.domain = $location.$$search.domain;
			obj.ticket = $location.$$search.ticket;
			if ($scope.sortStatus < 0) {
				obj.sortFieldName = "startDate";
				obj.sortDir = "DESC";
			} else {
				obj.sortFieldName = "startDate";
				obj.sortDir = "ASC";
			}
			exportReport(obj);
		};

		/**
		 * 获取手续费结算列表
		 */
		$scope.pageSize = 10;

		function listSettlement(obj) {
			if (!obj) {
				obj = {};
				obj['ticket'] = $location.$$search.ticket;
				obj['domain'] = $location.$$search.domain;
				obj.pageSize = $scope.pageSize ? $scope.pageSize : 10;
			} else {
				obj.pageSize = obj.pageSize ? obj.pageSize : 10;
			}
			obj.pageNumber = obj.pageNumber ? obj.pageNumber : 1;
			$http({
				method: 'post',
				data: obj,
				url: serverUrl + 'feeManager/querySettlement'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.settlements = response.data.data.settlementList;
					$scope.total = response.data.data.totalCount;
					$scope.currentPage = obj.pageNumber;
					$scope.DoCtrlPagingAct = function(text, page, pageSize, total) {
						var data = $scope.oldInfo ? $scope.oldInfo : {};
						data.pageNumber = page;
						data.pageSize = $scope.pageSize;
						data.ticket = $location.$$search.ticket;
						data.domain = $location.$$search.domain;
						if ($scope.sortStatus < 0) {
							$scope.sortSign = "↓";
							data.sortDir = "DESC";
						} else {
							$scope.sortSign = "↑";
							data.sortDir = "ASC";
						}
						data.sortFieldName = "startDate";
						console.log(JSON.stringify(data));
						listSettlement(data);
					};
				} else {
					userAuth.isLogin(response.data);
					$scope.title = "提示";
					$scope.context = "加载列表失败!";
					$scope.PopHide = true;
				}
			})
		}
	});