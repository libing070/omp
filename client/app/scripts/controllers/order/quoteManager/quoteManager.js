/**
 * Created by libing on 2016/4/11.
 */
'use strict';

app
	.controller('quoteManagerCtrl', function($scope, $http, $timeout,$routeParams,$rootScope, $location, serverUrl, openCity, userAuth) {
		/**
		 * 初始化订单状态
		 */
		
         $rootScope.ticket=$location.$$search.ticket || $rootScope.ticket;
         $rootScope.domain=$location.$$search.domain || $rootScope.domain;
		listSupplier(); //加载供应商列表
		listGoods(); //加载商品列表
		if($routeParams.obj!=undefined){
			var findParms=eval('(' + $routeParams.obj + ')');
			    $scope.search_supplierID =findParms.supplierID;
				$scope.search_cityID=findParms.cityID;
				$scope.search_goodsTypeID=findParms.goodsTypeID;
				$scope.search_lockStatus=findParms.lockStatus;
				$scope.search_quotationStatus=findParms.quotationStatus;
				$scope.search_carOwner=findParms.carOwner;
				$scope.search_phoneNo=findParms.phoneNo;
				$scope.currentPage=findParms.pageNumber;
				$scope.pageSize=findParms.pageSize;
			$scope.latestQueryParam=findParms;
			listOrder(findParms);
		}else{
			listOrder({
				quotationStatus:1,
				pageNumber : 1,
				pageSize : 10
			}); //初始化列表
			$scope.search_quotationStatus="1";//首次加载默认 “未报价”
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
		 * 获取列表
		 */
		$scope.pageSize = 10;
		$scope.sortStatus = 1;	//升序
		$scope.sortSign = "↑";
		function listOrder(queryParam) {
			queryParam['ticket'] = $location.$$search.ticket;
			queryParam['domain'] = $location.$$search.domain;
			$http({
				method: 'post',
				data: queryParam,
				url: serverUrl + 'orderManager/listQuotation'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.quotationList = response.data.data.quotationList;
					$scope.quotationList.forEach(function(value){
				        if(value.lockOwner==undefined||value.lockOwner==""){value.lockOwner=' ';}
			        });
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
					$scope.title = "提示";
					$scope.context = "加载列表失败!";
					$scope.PopHide = true;
				}
			})
		}
		
		function initPagination(queryParam){
			queryParam['pageNumber'] = 1;
			queryParam['pageSize'] = 10;
		}

		//按报价单创建时间排序
		$scope.doSort = function() {
			var obj = $scope.latestQueryParam || {};
			obj['ticket'] = $location.$$search.ticket;
			obj['domain'] = $location.$$search.domain;
			initPagination(obj);
			$scope.sortStatus = -$scope.sortStatus;
			if ($scope.sortStatus >0) {
				obj.sortDir = "ASC";
				$scope.sortSign = "↑";
			} else {
				obj.sortDir = "DESC";
				$scope.sortSign = "↓";
			}
			obj.sortFieldName = "createTime";
			listOrder(obj);
		};
		
		
	       	$scope.formDateBox = {};
	       	$scope.formDateBox.own=true;
	       	$scope.formDateBox.other=false;
	       	$scope.formDateBox.no=true;
	       	var lockOwner=new Array();
	       	var temp="";
	       	var queryParam = getQueryParam();
			queryParam["lockOwnerChoice"]="101";//默认导出 本人 无
			$scope.latestQueryParam=queryParam;
	       	/**
	       	 * 获取参数信息
	       	 */
	       	function getQueryParam() {
	       		var queryParam = {
	       				supplierID: $scope.search_supplierID || '',
	       				cityID: $scope.search_cityID || '',
	       				goodsTypeID: $scope.search_goodsTypeID || '',
	       				lockStatus: $scope.search_lockStatus || '',
	       				quotationStatus: $scope.search_quotationStatus ||'',
	       				carOwner: $scope.search_carOwner || '',
	       				phoneNo: $scope.search_phoneNo || ''
	       		};
	       		return queryParam;
	       	}
		$scope.findResult=function(){
			var queryParam = getQueryParam();
			if ($scope.sortStatus >0) {
				queryParam.sortDir = "ASC";
				$scope.sortSign = "↑";
			} else {
				queryParam.sortDir = "DESC";
				$scope.sortSign = "↓";
			}
			temp="";
			temp+=($scope.formDateBox.own==true?"1":"0");
	       	temp+=($scope.formDateBox.other==true?"1":"0");
	       	temp+=($scope.formDateBox.no==true?"1":"0");
			queryParam["lockOwnerChoice"]=temp;
			initPagination(queryParam);
			//保存查找之后的数据 用于记录查找条件 排序时使用
			$scope.latestQueryParam = queryParam;
			listOrder(queryParam);
			
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
			var params =  $scope.latestQueryParam || {};
			$scope.isReal = false;
			param = {};
			if(params.quotationCustomerNumber&&params.quotationCustomerNumber!=null){
				param.key = "电报价单单编号:";
				param.value =params.quotationCustomerNumber;
				result.push(param);
				$scope.isReal = true;
			}
			var param = {};
			if(params.goodsTypeName&&params.goodsTypeName!=null){
				param.key = "产品类型:";
				param.value =params.goodsTypeName;
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
				param.key = "车主:";
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
			if(params.quotationStatus&&params.quotationStatus!=null){
				param.key = "报价单状态:";
				param.value =params.quotationStatus=="1"?"未报价":params.quotationStatus=="2"?"已报价":"报价失败";
				result.push(param);
				$scope.isReal = true;
			}
			param = {};
			if(params.lockStatus&&params.lockStatus!=null){
				param.key = "锁定状态:";
				param.value =params.lockStatus=="1"?"已锁定":"未锁定";
				result.push(param);
				$scope.isReal = true;
			}
			
			param = {};
			if(params.lockOwnerChoice&&params.lockOwnerChoice!=null){
				param.key = "锁定owner:";
				var firstloakOwner=params.lockOwnerChoice.substr(0,1)=="1"?"本人":"";
				var secondloakOwner=params.lockOwnerChoice.substr(1,1)=="1"?"他人":"";
				var threeLoakOwner=params.lockOwnerChoice.substr(2,1)=="1"?"无":"";
				var temp=firstloakOwner+"   "+secondloakOwner+"   "+threeLoakOwner;
				param.value =temp;
				result.push(param);
				$scope.isReal = true;
			}
			param = {};
			if(params.amount&&params.amount!=null){
				param.key = "总金额:";
				param.value =params.amount;
				result.push(param);
				$scope.isReal = true;
			}
			
			param = {};
			if(params.createTime&&params.createTime!=null){
				param.key = "报价单创建时间:";
				param.value =params.createTime;
				result.push(param);
				$scope.isReal = true;
			}
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
			
			return result;
		}
		
		/**
		 * 导出excel
		 */
		$scope.exportExcel = function() {
			var obj = $scope.latestQueryParam || {};
			obj['ticket'] = $location.$$search.ticket;
			obj['domain'] = $location.$$search.domain;
			
			if ($scope.sortStatus >0) {
				obj.sortDir = "ASC";
			} else {
				obj.sortDir = "DESC";
			}
			obj.sortFieldName = "createTime";
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
				url: serverUrl + 'exportManager/exportQuotationList'
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
		
		$scope.loadCurrPage=function(goodsTypeID,quotationID,lockOwner,lockStatus){
			/*$location.$$search.domain="admin";
			$location.$$search.ticket="aaa111";*/
			var obj=$scope.latestQueryParam;
			obj['ticket'] = $location.$$search.ticket;
			obj['domain'] = $location.$$search.domain;
			obj['pageNumber'] = $scope.currentPage;
			obj['pageSize'] = $scope.pageSize;
			var parms=JSON.stringify(obj);
			$http({
				method: 'post',
				data: {
					ticket: $location.$$search.ticket,
					domain:  $location.$$search.domain,
					lockOwner:lockOwner,
					lockStatus:lockStatus,
					quotationID:quotationID
				},
				url: serverUrl + 'orderManager/detailQuotation'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					if("1"==goodsTypeID){
					 	$location.path('/ttbEditManager/'+quotationID+'/'+lockOwner+'/'+lockStatus+'/'+goodsTypeID+'/'+parms+'/'+$location.$$search.ticket+'/'+$location.$$search.domain);
					 	console.log($location.path());
					}else if("2"==goodsTypeID){
						$location.path('/cxbtEditManager/'+quotationID+'/'+lockOwner+'/'+lockStatus+'/'+goodsTypeID+'/'+parms+'/'+$location.$$search.ticket+'/'+$location.$$search.domain);
					}else if("4"==goodsTypeID){
						$location.path('/jqxEditManager/'+quotationID+'/'+lockOwner+'/'+lockStatus+'/'+goodsTypeID+'/'+parms+'/'+$location.$$search.ticket+'/'+$location.$$search.domain);
					}
				}else if(response.data.errorCode == 7019){
					$scope.divFShow=true;
					$scope.isIntBgColorShow=true;
					$timeout(function(){$scope.divFShow=false;$scope.isIntBgColorShow=false;},2000);//保存
					return false;
				}
				else{
					userAuth.isLogin(response.data);
					$scope.title = "提示";
					$scope.context = "加载报价单详情失败!";
					$scope.PopHide = true;
				}
			})
		};

	});
