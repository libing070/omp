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
	.controller('expressPolicyCtrl', function($scope, $http, $timeout, $location, serverUrl, openCity, userAuth) {
		/**
		 * 初始化订单状态
		 */
		listSupplier(); //加载供应商列表
		listOrder(null); //初始化列表

		/**
		 * 取消提示
		 */
		$scope.cancel = function() {
			$scope.PopHide = false;
		};

		$scope.goTo = function(address) {
			$location.path(address);
		};

		/**
		 * 初始化参数信息
		 */
		$scope.dates = {
			today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
			minDate: moment("2015-12-06 12:13:24")
		};
		$scope.$watch('dates.search_startTime', function() {
			$scope.dates.minDate = $scope.dates.search_startTime || moment("");
			$scope.$broadcast('pickerUpdate', ['search_endTime'], {
				minDate: $scope.dates.minDate,
			});
		});
		$scope.$watch('dates.search_endTime', function() {
			$scope.dates.maxDate = $scope.dates.search_endTime || moment("");
			$scope.$broadcast('pickerUpdate', ['search_startTime'], {
				maxDate: $scope.dates.maxDate,
			});
		});

		function getQueryParam() {
			var queryParam = {
				supplierID: $scope.search_supplierID || '',
				cityID: $scope.search_cityID || '',
				kindType: $scope.search_kindType || '',
				startTime: $scope.dates.search_startTime ? $scope.dates.search_startTime.format('YYYY-MM-DD HH:mm:ss') : '',
				endTime: $scope.dates.search_endTime ? $scope.dates.search_endTime.format('YYYY-MM-DD HH:mm:ss') : '',
				policyNO: $scope.search_policyNO || '',
				carOwner: $scope.search_carOwner || '',
				phoneNo: $scope.search_phoneNo || ''
			};
			return queryParam;
		}

		/**
		 * 取消提示
		 */
		$scope.cancelExport = function() {
			$scope.popExport = false;
		};


		/**
		 * 获取查找参数信息
		 */
		function setArr() {
			var result = new Array();
			var params = $scope.latestQueryParam || {};
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
			if (params.kindType && params.kindType != null) {
				param.key = "保障险别:";
				param.value = (params.kindType == 1 ? '商业险' : '交强险');
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.startTime && params.startTime != null) {
				param.key = " 地址变更起始日期:";
				param.value = params.startTime;
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.endTime && params.endTime != null) {
				param.key = "终止日期:";
				param.value = params.endTime;
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.policyNO && params.policyNO != null) {
				param.key = "保单号:";
				param.value = params.policyNO;
				result.push(param);
				$scope.isReal = true;
			}


			param = {};
			if (params.carOwner && params.carOwner != null) {
				param.key = "收件人姓名:";
				param.value = params.carOwner;
				result.push(param);
				$scope.isReal = true;
			}


			param = {};
			if (params.phoneNo && params.phoneNo != null) {
				param.key = "联系电话:";
				param.value = params.phoneNo;
				result.push(param);
				$scope.isReal = true;
			}

			return result;
		}

		//导出提示
		$scope.exportTip = function() {
			$scope.params = setArr();
			$scope.popExport = true;
		}


		/**
		 * 获取订单列表
		 */
		$scope.pageSize = 10;

		function listOrder(queryParam) {
			if (!queryParam) {
				queryParam = {};
				queryParam.pageSize = $scope.pageSize || 10;
			} else {
				queryParam.pageSize = queryParam.pageSize ? queryParam.pageSize : 10;
			}
			queryParam.pageNumber = queryParam.pageNumber || 1;
			queryParam['ticket'] = $location.$$search.ticket;
			queryParam['domain'] = $location.$$search.domain;
			$http({
				method: 'post',
				data: queryParam,
				url: serverUrl + 'orderManager/queryPolicyOfDeal'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.orders = response.data.data.policyList;
					$scope.total = response.data.data.totalCount;
					$scope.currentPage = queryParam.pageNumber;
					$scope.DoCtrlPagingAct = function(text, page, pageSize, total) {
						var queryParam = $scope.latestQueryParam || {};
						queryParam['pageNumber'] = page;
						queryParam['pageSize'] = pageSize;
						console.log(JSON.stringify(queryParam));
						listOrder(queryParam);
					};
				} else {
					userAuth.isLogin(response.data);
					$scope.title = "提示";
					$scope.context = "加载列表失败!";
					$scope.PopHide = true;
				}
			})
		}

		/**
		 * 查找按钮
		 */
		$scope.findResult = function() {
			var queryParam = getQueryParam();
			//保存查找之后的数据 用于记录查找条件 排序时使用
			$scope.latestQueryParam = queryParam;
			listOrder(queryParam);
		};


		/**
		 * 导出excel的按钮
		 */
		$scope.exportExcel = function() {
			var obj = $scope.latestQueryParam || {};
			if ($scope.sortStatus < 0) {
				obj.sortFieldName = "lastUpdate";
				obj.sortDir = "DESC";
			} else {
				obj.sortFieldName = "lastUpdate";
				obj.sortDir = "ASC";
			}
			exportReport();
		};


		//按时间排序
		//		$scope.sortStatus = -1;
		//		$scope.sortSign = "↑";
		$scope.sortStatus = 1; //降序
		$scope.sortSign = "↓";
		$scope.doSort = function() {
			var obj = $scope.latestQueryParam ? $scope.latestQueryParam : {};
			$scope.sortStatus = -$scope.sortStatus;
			if ($scope.sortStatus > 0) {
				$scope.sortSign = "↓";
				obj.sortDir = "DESC";
			} else {
				$scope.sortSign = "↑";
				obj.sortDir = "ASC";
			}
			obj.sortFieldName = "lastUpdate";
			listOrder(obj);
		};



		/**
		 * 导出excel
		 * @param {Object} obj
		 */
		function exportReport() {
			var obj = $scope.latestQueryParam ? $scope.latestQueryParam : {};
			obj['ticket'] = $location.$$search.ticket;
			obj['domain'] = $location.$$search.domain;
			$http({
				method: 'post',
				data: obj,
				url: serverUrl + 'exportManager/exportPolicyOfDeal'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.popExport = false;
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
	});