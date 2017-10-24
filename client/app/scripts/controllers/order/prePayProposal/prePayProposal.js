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
	.controller('prePayProposalCtrl', function($scope, $http, $timeout, $location, serverUrl, openCity, userAuth, payPrimiumURL, pageURL) {
		/**
		 * 初始化订单状态
		 */
		$scope.payPrimiumURL = payPrimiumURL;
		$scope.pageURL = pageURL;
		$scope.type = ['商业险', '交强险'];
		listSupplier(); //加载供应商列表
		listGoods(); //加载商品列表
		listOrder({
			pageNumber: 1,
			pageSize: 10
		}); //初始化列表

		$scope.goTo = function(address) {
			$location.path(address);
		};
		/**
		 * 取消提示
		 */
		$scope.cancel = function() {
			$scope.PopHide = false;
		};
		
		/**
		 * 取消提示
		 */
		$scope.cancelExport = function() {
			$scope.popExport = false;
		};

		/**
		 * 取消操作提示
		 */
		$scope.cancelPop = function() {
			$scope.popShow = false;
			$scope.popCompletePolicyShow = false;
		};


		function initPagination(queryParam) {
			queryParam['pageNumber'] = 1;
			queryParam['pageSize'] = 10;
		}

		/**
		 * 查找按钮
		 */
		$scope.findResult = function() {
			var queryParam = getQueryParam();
			initPagination(queryParam);
			//保存查找之后的数据 用于记录查找条件 排序时使用
			$scope.latestQueryParam = queryParam;
			listOrder(queryParam);
		};

		/**
		 * 初始化参数信息
		 */
		function getQueryParam() {
			var queryParam = {
				supplierID: $scope.search_supplierID || '',
				cityID: $scope.search_cityID || '',
				goodsID: $scope.search_goodsID || '',
				policyCustomerNo: $scope.search_policyCustomerNo || '',
				carOwner: $scope.search_carOwner || '',
				phoneNo: $scope.search_phoneNo || ''
			};
			return queryParam;
		}


		/**
		 * 获取订单列表
		 */
		$scope.pageSize = 10;
		$scope.sortStatus = 1; //降序
		$scope.sortSign = "↓";

		function listOrder(queryParam) {
			queryParam['ticket'] = $location.$$search.ticket;
			queryParam['domain'] = $location.$$search.domain;
			$http({
				method: 'post',
				data: queryParam,
				url: serverUrl + 'orderManager/queryProposalForPay'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.orders = response.data.data.policyList;
					$scope.total = response.data.data.totalCount;
					$scope.currentPage = queryParam.pageNumber;
					$scope.DoCtrlPagingAct = function(text, page, pageSize, total) {
						var queryParam = $scope.latestQueryParam || {};
						queryParam['pageNumber'] = page;
						queryParam['pageSize'] = pageSize;
						listOrder(queryParam);
					};
				} else {
					userAuth.isLogin(response.data);
					$scope.context = "加载列表失败!";
					$scope.PopHide = true;
				}
			})
		}

		//按时间排序
		$scope.doSort = function() {
			var obj = $scope.latestQueryParam || {};
			obj['ticket'] = $location.$$search.ticket;
			obj['domain'] = $location.$$search.domain;
			initPagination(obj);
			$scope.sortStatus = -$scope.sortStatus;
			if ($scope.sortStatus > 0) {
				obj.sortDir = "DESC";
				$scope.sortSign = "↓";
			} else {
				obj.sortDir = "ASC";
				$scope.sortSign = "↑";
			}
			obj.sortFieldName = "underwritingTime";
			listOrder(obj);
		};

		/**
		 * 导出excel的按钮
		 */
		$scope.exportExcel = function() {
			var obj = $scope.latestQueryParam || {};
			obj['ticket'] = $location.$$search.ticket;
			obj['domain'] = $location.$$search.domain;
			if ($scope.sortStatus > 0) {
				obj.sortDir = "DESC";
			} else {
				obj.sortDir = "ASC";
			}
			obj.sortFieldName = "underwritingTime";
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
				url: serverUrl + "exportManager/exportProposalForPay"
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.popExport = false;
					$scope.modalGoodsSuccess=true;
        			$timeout(function(){$scope.modalGoodsSuccess=false},2000);
					$scope.reportUrl = response.data.data.reportUrl;
					window.location.href = $scope.reportUrl;
				} else {
					userAuth.isLogin(response.data);
					$scope.context = "导出excel失败!";
					$scope.PopHide = true;
				}
			})
		}



		/**
		 * 操作功能
		 */
		$scope.payProposal = function(index) {
			$http({
				method: 'get',
				data: {
					orderNo: $scope.orders[index].supplierOrderNO,
					orderAmount: $scope.orders[index].orderAmount,
					payMethodId: '1',
					pageUrl: $scope.pageURL,
					bgUrl: '1',
					clientIp: '127.0.0.1'
				},
				url: $scope.payPrimiumURL + '?orderNo=' + $scope.orders[index].supplierOrderNO + '&orderAmount=' + $scope.orders[index].orderAmount + '&payMethodId=1&pageUrl=' + $scope.pageURL + '&bgUrl=1&clientIp=127.0.0.1'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.context = "支付成功!";

					var obj = $scope.latestQueryParam || {};
					obj['ticket'] = $location.$$search.ticket;
					obj['domain'] = $location.$$search.domain;
					if ($scope.sortStatus > 0) {
						obj.sortDir = "DESC";
					} else {
						obj.sortDir = "ASC";
					}
					obj.sortFieldName = "underwritingTime";

					initPagination(obj);
					listOrder(obj);
					$scope.PopHide = true;
				} else {
					userAuth.isLogin(response.data);
					$scope.context = "支付失败!";
					//新增
					$scope.PopHide = true;
				}
				$scope.popShow = false;
			})

		};

		/**
		 * 确认操作（取消保单、退费）
		 */
		$scope.confirm = function() {
			var index = $scope.markerID;
			var operType = $scope.operType;
			var reqBody = {
				payOrderID: $scope.orders[index].payOrderID,
				goodsOrderID: $scope.orders[index].goodsOrderID,
				policyID: $scope.orders[index].policyID,
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain
			};
			if (operType == 'cancelOrder') { //取消订单
				cancelOrder(reqBody);
			} else if (operType == 'refundOrder') { //订单退款
				refundOrder(reqBody);
			}
		};
		
		
		
		/**
		 * 获取查找参数信息
		 */
		function setArr (){
			var result = new Array();
			var params =  $scope.latestQueryParam || {};
			$scope.isReal = false;
			var param = {};
			if(params.supplierID&&params.supplierID!=null){
				param.key = "供应商:";
				$scope.suppliers.forEach(function(price){
					if (price.supplierID ==params.supplierID) {
						param.value = price.supplierName;
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
			if(params.goodsID&&params.goodsID!=null){
				param.key = "商品名称:";
				$scope.goods.forEach(function(price){
					if (price.goodsID ==params.goodsID) {
						param.value = price.goodsName;
					} 
				});
				result.push(param);
				$scope.isReal = true;
			}
			
			param = {};
			if(params.carOwner&&params.carOwner!=null){
				param.key = "车主姓名:";
				param.value =params.carOwner;
				result.push(param);
				$scope.isReal = true;
			}
		
			param = {};
			if(params.phoneNo&&params.phoneNo!=null){
				param.key = "联系电话:";
				param.value =params.phoneNo;
				result.push(param);
				$scope.isReal = true;
			}
			
			param = {};
			if(params.policyCustomerNo&&params.policyCustomerNo!=null){
				param.key = "电子投保单号:";
				param.value =params.policyCustomerNo;
				result.push(param);
				$scope.isReal = true;
			}
			return result;
		}
		
		//导出提示
		$scope.exportTip = function(){
			$scope.params = setArr();
			$scope.popExport = true;
		}

		/**
		 * 订单退款
		 * @param {Object} obj
		 */
		function refundOrder(reqBody) {
			$http({
				method: 'post',
				data: reqBody,
				url: serverUrl + 'orderManager/refundOrder'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.context = "操作成功!";
					var obj = $scope.latestQueryParam || {};
					initPagination(obj);
					listOrder(obj);
					//新增
					$scope.modalAlreadySuccess = true;
					$timeout(function() {
						$scope.modalAlreadySuccess = false;
					}, 2000);
				} else {
					userAuth.isLogin(response.data);
					$scope.context = "退费失败!";
					//新增
					$scope.PopHide = true;
				}
				//$scope.PopHide=true;
				$scope.popShow = false;
			})
		}


		/**
		 * 取消订单
		 * @param {Object} obj
		 */
		function cancelOrder(reqBody) {
			$http({
				method: 'post',
				data: reqBody,
				url: serverUrl + 'orderManager/cancelOrder'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.context = "操作成功!";
					var obj = $scope.latestQueryParam || {};
					initPagination(obj);
					listOrder(obj);
					//新增
					$scope.modalAlreadySuccess = true;
					$timeout(function() {
						$scope.modalAlreadySuccess = false;
					}, 2000);
				} else {
					userAuth.isLogin(response.data);
					$scope.context = "取消订单失败!";
					$scope.PopHide = true;
					//新增
				}
				$scope.popShow = false;
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
	});