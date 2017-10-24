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
	.controller('errorProposalCtrl', function($scope, $http, $timeout, $location, serverUrl, openCity, userAuth, httpUtils,clone) {
		/**
		 * 初始化订单状态
		 */
		$scope.type = ['商业险', '交强险'];
		listSupplier(); //加载供应商列表
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
		 * 取消操作提示
		 */
		$scope.cancelPop = function() {
			$scope.popShow = false;
			$scope.popCompletePolicyShow = false;
			$scope.errorTip = false;
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


		/**
		 * 初始化参数信息
		 */
		function getQueryParam() {
			var queryParam = {
				supplierID: $scope.search_supplierID || '',
				cityID: $scope.search_cityID || '',
				policyStatus: $scope.search_policyStatus || '',
				policyCustomerNo: $scope.search_policyCustomerNo || '',
				carOwner: $scope.search_carOwner || '',
				phoneNo: $scope.search_phoneNo || '',
				errorTimeStart: $scope.dates.search_startTime ? $scope.dates.search_startTime.format('YYYY-MM-DD HH:mm:ss') : '',
				errorTimeEnd: $scope.dates.search_endTime ? $scope.dates.search_endTime.format('YYYY-MM-DD HH:mm:ss') : '',
			};
			return queryParam;
		}
		
		
		/**
		 * 获取查找参数信息
		 */
		function setArr (){
			var result = new Array();
			console.info($scope.latestQueryParam );
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
			if (params.errorTimeStart && params.errorTimeStart != null) {
				param.key = " 地址变更起始日期:";
				param.value = params.errorTimeStart;
				result.push(param);
				$scope.isReal = true;
			}

			param = {};
			if (params.errorTimeEnd && params.errorTimeEnd != null) {
				param.key = "终止日期:";
				param.value = params.errorTimeEnd;
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
		
		/**
		 * 取消提示
		 */
		$scope.cancelExport = function() {
			$scope.popExport = false;
		};

		//导出提示
		$scope.exportTip = function(index){
			$scope.params = setArr();
			var requestParam = clone.cloneObj($scope.latestQueryParam)||{};
			if(index == 1){
				requestParam.policyStatus=8;
				getCount(requestParam);
			}else{
				requestParam.policyStatus=3;
				getCount(requestParam);
			}
			
			$scope.popExport = true;
			$scope.policyType = index;
		}
		
		function getCount(queryParam){
			console.info(queryParam);
			queryParam['ticket'] = $location.$$search.ticket;
			queryParam['domain'] = $location.$$search.domain;
			queryParam['pageSize'] = 10;
			queryParam['pageNumber'] = 1;
			httpUtils.req(JSON.stringify(queryParam), serverUrl + 'orderManager/queryProposalOfError')
			.then(function successCallback(response) {
					if (response.data.errorCode == 0) {
						console.info(33);
						$scope.exportTotal = response.data.data.totalCount;
					}else{
						userAuth.isLogin(response.data);
					}
				},
				function errorCallback(response) {
					
				});
			
		}

		/**
		 * 获取订单列表
		 */
		$scope.pageSize = 10;
		$scope.sortStatus = 1;	//降序
		$scope.sortSign = "↓";

		function listOrder(queryParam) {
			queryParam['ticket'] = $location.$$search.ticket;
			queryParam['domain'] = $location.$$search.domain;
			$http({
				method: 'post',
				data: queryParam,
				url: serverUrl + 'orderManager/queryProposalOfError'
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

		//按时间排序
		$scope.doSort = function() {
			var obj = clone.cloneObj($scope.latestQueryParam)||{};
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
			obj.sortFieldName = "errorTime";
			listOrder(obj);
		};

		/**
		 * 导出excel的按钮
		 */
		$scope.exportExcel = function() {
			var obj = clone.cloneObj($scope.latestQueryParam)||{};
			obj['ticket'] = $location.$$search.ticket;
			obj['domain'] = $location.$$search.domain;
			if ($scope.sortStatus > 0) {
				obj.sortDir = "DESC";
			} else {
				obj.sortDir = "ASC";
			}
			obj.sortFieldName = "errorTime";
			exportReport($scope.policyType, obj);
		};


		/**
		 * 导出excel
		 * @param {Object} obj
		 */
		function exportReport(policyType, obj) {
			obj.policyStatus=(policyType == 1?8:3);
			var url = policyType == '1' ? 'exportManager/exportPolicyOfError' : 'exportManager/exportProposalOfError';
			$http({
				method: 'post',
				data: obj,
				url: serverUrl + url
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


		function clearCompletePolicyText() {
			$scope.completePolicy_proposalNO = '';
			$scope.completePolicy_policyNO = '';
			$scope.completePolicy_sumPremium = '';
		}

		/**
		 * 操作功能
		 */
		$scope.operation = function(index, operType) {
			$scope.markerID = index;
			$scope.operType = operType;
			$scope.goodsTypeID = $scope.orders[index].goodsTypeID; //产品线ID（1天天保  2车险白条	3停驶保	4交强险）
			$scope.isGift = $scope.orders[index].isGift; //是否是赠品（司机险）Y是  N不是
			$scope.goodsTypeName = $scope.orders[index].isGift == 'Y' ? '司机险赠品' : $scope.orders[index].goodsTypeName; //产品线名称
			$scope.policyCustomerNo = $scope.orders[index].policyCustomerNo; //电子保单号
			$scope.carOwner = $scope.orders[index].carOwner; //车主
			$scope.carLicenseNO = $scope.orders[index].carLicenseNO; //车牌号
			$scope.kindTypeName = $scope.orders[index].kindType==1?"商业险":"交强险"; //险种类别
			if (operType == 'cancelOrder') {
				$scope.content = "确认取消订单？";
				$scope.popShow = true;
			} else if (operType == 'refundOrder') {
				$scope.content = "退费金额：" + $scope.orders[index].payFee + "元";
				$scope.popShow = true;
			} else if (operType == 'completePolicy') {
				$scope.content = "保单出单成功";
				clearCompletePolicyText();
				$scope.popCompletePolicyShow = true;
			}
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
					//xinzeng
					$scope.modalAlreadySuccess = true;
					$timeout(function() {
						$scope.modalAlreadySuccess = false;
					}, 2000);
				} else {
					userAuth.isLogin(response.data);
					$scope.context = "取消订单失败!";
					//xinzeng
					$scope.PopHide = true;

				}
				//$scope.PopHide=true;
				$scope.popShow = false;
			})
		}

		/**
		 * 确认操作（投保成功）
		 */
		$scope.confirmCompletePolicy = function() {
			$scope.errorTip = false;
			var index = $scope.markerID;
			var reqBody = {
				policyID: $scope.orders[index].policyID,
				goodsOrderID: $scope.orders[index].goodsOrderID,
				proposalNO: $scope.completePolicy_proposalNO,
				policyNO: $scope.completePolicy_policyNO,
				sumPremium: $scope.completePolicy_sumPremium,
				ticket: $location.$$search.ticket,
				domain: $location.$$search.domain
			};
			if (!reqBody.proposalNO) {
				$scope.errorTipContent = '请填写投保单号';
				$scope.errorTip = true;
				return;
			} else if (!reqBody.policyNO) {
				$scope.errorTipContent = '请填写保单号';
				$scope.errorTip = true;
				return;
			} else if ($scope.orders[index].goodsTypeID == '1' || $scope.orders[index].goodsTypeID == '4' || $scope.orders[index].isGift == 'Y') {
				if (!reqBody.sumPremium) {
					$scope.errorTipContent = '请填写保单金额';
					$scope.errorTip = true;
				} else if (!/^\d+(\.\d+)?$/.test(reqBody.sumPremium) || reqBody.sumPremium<=0) {
					$scope.errorTipContent = '保单金额格式错误';
					$scope.errorTip = true;
				}
			}
			//console.log($scope.errorTip);
			if (!$scope.errorTip) {
				$http({
					method: 'post',
					data: reqBody,
					url: serverUrl + 'orderManager/completePolicy'
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
					} else if (response.data.errorCode == 7120) {
						$scope.context = "投保单号或者保单号重复";
						$scope.PopHide = true;
					} else {
						userAuth.isLogin(response.data);
						$scope.context = "投保失败!";
						//新增
						$scope.PopHide = true;
					}
					//$scope.PopHide=true;
					$scope.popCompletePolicyShow = false;
				})
			}
		};

		$scope.onFocus = function() {
			$scope.errorTip = false;
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