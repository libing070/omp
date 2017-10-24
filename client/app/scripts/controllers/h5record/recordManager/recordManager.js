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
app.controller('recordCtrl', function($scope, $http, $timeout, $location, serverUrl, openCity, userAuth) {
		listOrder({}); 
		$scope.findResult = function() {
			/*console.info($scope)
 			console.info($http)
			console.info($location)
			console.info(serverUrl)
			console.info(openCity)
			console.info(userAuth) */
			
			var queryParam = getQueryParam();
			//保存查找之后的数据 用于记录查找条件 排序时使用
			$scope.latestQueryParam = queryParam;
			listOrder(queryParam);
		};
		
		/**
		 * 初始化订单状态
		 */
		// $scope.orderStatus = ['待支付', '已支付', '超时取消', '已确定分期', '确认中', '保险公司拒保', '完成出单', '已退费', '已取消', '欠款', '已退保'];
		// $scope.policyStatus = ['未激活', '系统投保', '系统转投保单失败', '系统转投保单成功', '核保通过', '核保不通过', '公司已支付', '系统转保单失败', '系统转保单成功', '已退费', '已退保', '欠款', '已退保', '已取消'];
		// $scope.type = ['商业险', '交强险'];

	
		
		
		// /* listSupplier(); //加载供应商列表
		// listGoods(); //加载商品列表
		// listOrder({
			// pageNumber : 1,
			// pageSize : 10
		// }); //初始化列表 */

		// /**
		 // * 取消提示
		 // */
		// // $scope.cancel = function() {
			// // $scope.PopHide = false;
		// // };
		
		/**
		 * 取消提示
		 */
		$scope.cancelExport = function() {
			$scope.popShow = false;
		};
		
		// /**
		 // * 取消详情
		 // */
		// // $scope.cancelDetail = function() {
			// // $scope.popAdvice = false;
		// // };

		// function initPagination(queryParam){
			// queryParam['pageNumber'] = 1;
			// queryParam['pageSize'] = 10;
		// }


		/**
		 * 初始化参数信息
		 */
	    $scope.dates = {
			today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
			minDate: moment("2015-12-06 12:13:24")
		};
		$scope.$watch('dates.search_createTimeStart', function() {
			$scope.dates.minDate = $scope.dates.search_createTimeStart || moment("");
			$scope.$broadcast('pickerUpdate', ['search_createTimeEnd'], {
				minDate: $scope.dates.minDate,
			});
		});
		$scope.$watch('dates.search_createTimeEnd', function() {
			$scope.dates.maxDate = $scope.dates.search_createTimeEnd || moment("");
			$scope.$broadcast('pickerUpdate', ['search_createTimeStart'], {
				maxDate: $scope.dates.maxDate,
			});
		});
		
    	/**
    	 * 获取参数信息
    	 */
		function getQueryParam() {
			var queryParam = {
				createTimeStart: $scope.dates.search_createTimeStart ? $scope.dates.search_createTimeStart.format('YYYY-MM-DD') : '',
				createTimeEnd: $scope.dates.search_createTimeEnd ? $scope.dates.search_createTimeEnd.format('YYYY-MM-DD') : ''
			};
			return queryParam;
		}
		
		/**
		 * 获取查找参数信息
		 */
		function setArr (){
			console.debug("---setArr - --- ")
			console.debug($scope.latestQueryParam)
			var result = new Array();
			var params =  $scope.latestQueryParam || {};
			$scope.isReal = false;
			var param = {};
			if(params.id&&params.id!=null){
				param.key = "数据编号:";
				param.value = params.id;
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
			if(params.goodsOrderStatus&&params.goodsOrderStatus!=null){
				param.key = "订单状态:";
				param.value = $scope.orderStatus[params.goodsOrderStatus-1];
				result.push(param);
				$scope.isReal = true;
			}
			
			param = {};
			if(params.createTimeStart&&params.createTimeStart!=null){
				param.key = "订单创建起始日期:";
				param.value =params.createTimeStart;
				result.push(param);
				$scope.isReal = true;
			}
			
			param = {};
			if(params.createTimeEnd&&params.createTimeEnd!=null){
				param.key = "订单创建终止日期:";
				param.value =params.createTimeEnd;
				result.push(param);
				$scope.isReal = true;
			}
			
			param = {};
			if(params.goodsOrderNumber&&params.goodsOrderNumber!=null){
				param.key = "订单编号:";
				param.value =params.goodsOrderNumber;
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
			if(params.payOrderNumber&&params.payOrderNumber!=null){
				param.key = "支付订单编号:";
				param.value =params.payOrderNumber;
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


		// /**
		 // * 获取订单列表
		 // */
		// $scope.pageSize = 10;
		// $scope.sortStatus = 1;	//降序
		// $scope.sortSign = "↓";
		function listOrder(queryParam) {
			queryParam['ticket'] = $location.$$search.ticket;
			queryParam['domain'] = $location.$$search.domain;
			$http({
				method: 'post',
				data: queryParam,
				url: serverUrl + 'recordManager/queryRecord'
			}).then(function successCallback(response) {
				console.debug(response)
				if (response.data.errorCode == 0) {
					$scope.records = response.data.data;
					$scope.total = $scope.records.length;
					// $scope.latestQueryParam = response.data.data;
					// $scope.currentPage = queryParam.pageNumber;
					// $scope.DoCtrlPagingAct = function(text, page, pageSize, total) {
						// var queryParam = $scope.latestQueryParam || {};
						// queryParam['pageNumber'] = page;
						// queryParam['pageSize'] = pageSize;
						// console.log(JSON.stringify(queryParam));
						// listOrder(queryParam);
					// };
				}
				// else {
					// userAuth.isLogin(response.data);
					// $scope.title = "提示";
					// $scope.context = "加载列表失败!";
					// $scope.PopHide = true;
				// }
			})
		}

		// //按时间排序
		// $scope.doSort = function() {
			// var obj = $scope.latestQueryParam || {};
			// obj['ticket'] = $location.$$search.ticket;
			// obj['domain'] = $location.$$search.domain;
			// initPagination(obj);
			// $scope.sortStatus = - $scope.sortStatus;
			// if ($scope.sortStatus > 0) {
				// obj.sortDir = "DESC";
				// $scope.sortSign = "↓";
			// } else {
				// obj.sortDir = "ASC";
				// $scope.sortSign = "↑";
			// }
			// obj.sortFieldName = "lastUpdate";
			// listOrder(obj);
		// };
		
		
		
		//导出提示
		$scope.exportTip = function(){
			$scope.params = getQueryParam();
			$scope.popShow = true;
		}

		/**
		 * 导出excel
		 */
		$scope.exportExcel = function() {
			console.info($scope.latestQueryParam)
			var obj = $scope.latestQueryParam || {};
			obj['ticket'] = $location.$$search.ticket;
			obj['domain'] = $location.$$search.domain;
			
			if ($scope.sortStatus > 0) {
				obj.sortDir = "DESC";
			} else {
				obj.sortDir = "ASC";
			}
			obj.sortFieldName = "lastUpdate";
			exportReport(obj);
		};


		/**
		 * 导出excel
		 * @param {Object} obj
		 */
		function exportReport(obj) {
			console.info("-[-------------------")
			console.info(obj)
			$http({
				method: 'post',
				data: obj,
				url: serverUrl + 'exportManager/exportWechatList'
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


	});
