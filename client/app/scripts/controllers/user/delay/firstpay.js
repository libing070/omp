'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app.
controller('FirstPayCtrl', function($scope, $http, $timeout, $location,serverUrl, showError,userAuth) {
	this.awesomeThings = [
		'HTML5 Boilerplate',
		'AngularJS',
		'Karma'
	];
	$scope.dates = {
      today: moment.tz('UTC').hour(0).startOf('h')//12:00 UTC, today.
//    minDate:moment("2015-12-06 12:13:24")
    };

    $scope.goTo=function(add){
      $location.path(add);
    };
	/**
	 * tab页签切换
	 * @param {Object} num
	 */
	$scope.isActive = 2;//初始化展示二次未还款列表
	listTwoPay(null);
	$scope.setActive = function(num) {
		$scope.isActive = num;
		var obj = {};
		//切换置空数据
		$scope.dates.search_curEndRepayDate = "";
		$scope.dates.search_curFirstRepayDate = "";
		$scope.search_carOwner = "";
		$scope.search_carOwnerPhoneNO = "";
		$scope.search_carLicenseNO = null;
		//导出窗口提示也置空
		$scope.oldInfo={};
		if(num==1){
			listFirstPay(null);
		}else{
			listTwoPay(null);
		}
	};

	/**
	 * 查找按钮
	 */
	$scope.searchfirstPayFail = function() {
		var obj = getInfo();
		//保存查找之后的数据 用于记录查找条件 排序时使用
		$scope.oldInfo = obj;
		console.log('查找：'+obj);
		if($scope.isActive==1){
			listFirstPay(obj);
		}else{
			listTwoPay(obj);
		}
	};

	//按二次扣款时间排序
	$scope.sortStatus = -1;
	$scope.sortSign = "↑";
	$scope.doSort = function() {
		var obj = $scope.oldInfo ? $scope.oldInfo : {};
		$scope.sortStatus = -$scope.sortStatus;
		if ($scope.sortStatus < 0) {
			$scope.sortSign = "↓";
			obj.sortDir = "DESC";
		} else {
			$scope.sortSign = "↑";
			obj.sortDir = "ASC";
		}
		if($scope.isActive==1){
			obj.sortFieldName = "firstPayDate";
			listFirstPay(obj);
		}else{
			obj.sortFieldName="lastPayDate";
			listTwoPay(obj);
		}

	};

	/**
	 * 初始化参数信息
	 */
	function getInfo() {
		var obj = {};
		obj.domain = $location.$$search.domain;
		obj.ticket = $location.$$search.ticket;
		if($scope.isActive==1){
			console.log('firstPayDate：'+$scope.search_curFirstRepayDate);
			obj.firstPayDate = $scope.dates.search_curFirstRepayDate ? $scope.dates.search_curFirstRepayDate.format('YYYY-MM-DD' ) : "";
		}else{
			console.log('lastPayDate：'+$scope.search_curEndRepayDate);
			obj.lastPayDate = $scope.dates.search_curEndRepayDate ? $scope.dates.search_curEndRepayDate.format('YYYY-MM-DD' ) : "";
		}
		obj.carOwner = $scope.search_carOwner ? $scope.search_carOwner : '';
		obj.phoneNO = $scope.search_carOwnerPhoneNO ? $scope.search_carOwnerPhoneNO : '';
		obj.licenseNO = $scope.search_carLicenseNO ? $scope.search_carLicenseNO : '';
		console.log('初始化参数：'+obj.lastPayDate);
		return obj;
	}
    /**
     * 获取查找参数信息
     */
    function setArr (){
      var result = new Array();
      var params =  $scope.oldInfo || {};
      console.info('params===');
      console.info(params);
      $scope.isReal = false;
      var param = {};
      if(params.firstPayDate&&params.firstPayDate!=null){
        param.key = "首次扣款日期:";
        param.value =params.firstPayDate;
        result.push(param);
        $scope.isReal = true;
      }

      param = {};
      if(params.lastPayDate&&params.lastPayDate!=null){
        param.key = "二次扣款日期:";
        param.value =params.lastPayDate;
        result.push(param);
        $scope.isReal = true;
      }

      param = {};
      if(params.carOwner&&params.carOwner!=null){
        param.key = "车主姓名:";
        param.value=params.carOwner;
        result.push(param);
        $scope.isReal = true;
      }

      param = {};
      if(params.phoneNO&&params.phoneNO!=null){
        param.key = "手机号:";
        param.value=params.phoneNO;
        result.push(param);
        $scope.isReal = true;
      }

      param = {};
      if(params.licenseNO&&params.licenseNO!=null){
        param.key = "车牌号:";
        param.value = params.licenseNO;
        result.push(param);
        $scope.isReal = true;
      }

      return result;
    }
	/**
	 * 导出excel的按钮
	 */
	$scope.exportExcel = function() {
    $scope.params = setArr();
    $scope.popShow = true;
	};
    //取消导出EXCEL
    $scope.cancelExport=function(){
      $scope.popShow=false;
    };
    //确定到处EXCEL
    $scope.ensureExportExcel=function(){
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

	//获取用户列表
	$scope.pageSize = 10;

	function listFirstPay(obj) {
		if (!obj) {
			obj = {};
		}
		obj.domain = $location.$$search.domain;
		obj.ticket = $location.$$search.ticket;
		obj.pageSize = $scope.pageSize ? $scope.pageSize : 10;
		obj.pageNumber = obj.pageNumber ? obj.pageNumber : 1;
		console.log('ticket------'+obj.ticket);
		console.log('domain------'+obj.domain);
		$http({
			method: 'post',
			data: obj,
			url: serverUrl + 'userManager/queryUserOfFirstPayFail'
		}).then(function successCallback(response) {
			console.log('首次未还款' + response.data.data.firstPayFailList);
			console.log(response.data.errorCode);
			if (response.data.errorCode == 0) {
				$scope.firstPayFailDetail = response.data.data.firstPayFailList;
				$scope.total = response.data.data.totalCount;
				$scope.currentPage = obj.pageNumber;
				$scope.DoCtrlPagingAct = function(text, page, pageSize, total) {
					/*var data = {
						pageNumber: page,
						pageSize: $scope.pageSize,
						ticket:$location.$$search.ticket,
						domain:$location.$$search.domain
					};*/
					var data=getInfo();
					data['pageNumber'] = page;
					data['pageSize'] = pageSize;
					console.log(JSON.stringify(data));
					listFirstPay(data);
				};
			} else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "加载列表失败!";
				$scope.PopHide = true;
			}
		}, function errorCallback(response) {
			showError.showErrorMsg('获取用户列表失败');
		});
	}
	function listTwoPay(obj){
	    if(!obj){
			obj={};
		}
		obj.domain = $location.$$search.domain;
		obj.ticket = $location.$$search.ticket;
		obj.pageSize = $scope.pageSize ? $scope.pageSize : 10;
		obj.pageNumber = obj.pageNumber ? obj.pageNumber : 1;
		console.log('ticket------'+obj.ticket);
		console.log('domain------'+obj.domain);
		$http({
			method: 'post',
			data:obj,
	    	url : serverUrl + 'userManager/queryUserOfLastPayFail'
	    }).then(function successCallback(response){
	    	console.log(response.data.errorCode);
	    	console.log('二次未还款数据：'+response.data.data.lastPayFailList);
	    	if(response.data.errorCode == 0){
				$scope.lastPayFailDetail = response.data.data.lastPayFailList;
				$scope.total = response.data.data.totalCount;
				$scope.currentPage = obj.pageNumber;
				$scope.DoCtrlPagingAct = function(text, page, pageSize, total) {
					/*var data = {
						pageNumber:page,
						pageSize:$scope.pageSize,
						ticket:$location.$$search.ticket,
						domain:$location.$$search.domain
					};*/
					var data=getInfo();
					data['pageNumber'] = page;
					data['pageSize'] = pageSize;
					console.log(JSON.stringify(data));
					listTwoPay(data);
				};
	    	}else{
	    		userAuth.isLogin(response.data);
	    		$scope.title = "提示";
				$scope.context = "加载列表失败!";
				$scope.PopHide=true;
	    	}
	    }, function errorCallback(response){
	    	showError.showErrorMsg('获取用户列表失败');
	    });
    }
	/**
	 * 导出excel
	 * @param {Object} obj
	 */
	function exportReport(obj) {
		var urlTemp = '';
		if($scope.isActive==1){
			urlTemp = '/exportManager/exportUserOfFirstPayFail';
		}else{
			urlTemp = '/exportManager/exportUserOfLastPayFail';
		}
    console.info('obj====');
    console.info(obj);
		$http({
			method: 'post',
			data: obj,
			url: serverUrl + urlTemp
		}).then(function successCallback(response) {
			if (response.data.errorCode == 0) {
		        $scope.popShow = false;
		        $scope.modalGoodsSuccess=true;
		        $timeout(function(){$scope.modalGoodsSuccess=false},2000);
				console.log("导出："+response.data.data.reportUrl);
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
	$scope.cancel = function() {
		$scope.PopHide = false;
	};
	//关闭模态框
	$scope.closeModalBox = function() {
		$scope.modalSave = false;
		$scope.giveUpShow = false;
	};
	//电话跟踪记录
	$scope.flowUp = function(hirePurchaseAgreementID, carOwner) {
		$scope.hirePurchaseAgreementIDTemp = hirePurchaseAgreementID;
		$scope.carOwnerTemp = carOwner;
		$scope.modalSave = true;
		$scope.followUpContent=null;
		$scope.title = '电话跟进记录';

		//5.2.4	查询还款电话跟进列表
		$http({
			method: 'post',
			data: {
				hirePurchaseAgreementID: hirePurchaseAgreementID,
				ticket:$location.$$search.ticket,
				domain:$location.$$search.domain
			},
			url: serverUrl + 'userManager/queryFollowUpForFirstPayFail'
		}).then(function successCallback(response) {
			console.log('获取历史跟进标识：' + response.data.errorCode);
			console.log('历史跟进数据：' + response.data.data[0]);
			if (response.data.errorCode == 0) {
				$scope.followUpDetail = response.data.data;
			}else{
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "查询还款电话跟进列表失败!";
				$scope.PopHide = true;
			}
		}, function errorCallback(response) {
			showError.showErrorMsg('获取用户列表失败');
		});
	};
	//保存电话跟踪记录
	$scope.ensureFollowUp = function() {
		console.log('电话跟踪记录hirePurchaseAgreementID:' + $scope.hirePurchaseAgreementIDTemp + '--content：' + $scope.followUpContent);
		$http({
			method: 'post',
			data: {
				hirePurchaseAgreementID: $scope.hirePurchaseAgreementIDTemp,
				content: $scope.followUpContent,
	        	ticket:$location.$$search.ticket,
	        	domain:$location.$$search.domain
			},
			url: serverUrl + 'userManager/addFollowUpForFirstPayFail'
		}).then(function successCallback(response) {
			console.log('保存跟进记录标识：' + response.data.errorCode);
			if (response.data.errorCode == 0) {
				var obj=getInfo();
				listFirstPay(obj); //电话跟踪记录成功后刷新列表
				$scope.modalSave = false;

				$scope.flowUpSaveSuceess = true;
				$timeout(function() {
					$scope.flowUpSaveSuceess = false
				}, 2000);
			} else {
				userAuth.isLogin(response.data);
				showError.showErrorMsg('电话跟踪记录失败');
			}
		}, function errorCallback(response) {
			showError.showErrorMsg('电话跟踪记录--网络连接失败');
		});
	}


	//退保
    $scope.giveUp=function(payOrderCustomerNumber,hirePurchaseAgreementID,payOrderID,carOwner, carLicenseNO){
      	$scope.payOrderCustomerNumberTemp=payOrderCustomerNumber;
      	$scope.hirePurchaseAgreementIDTemp=hirePurchaseAgreementID;
      	$scope.payOrderIDTemp=payOrderID;
      	$scope.carOwnerTemp=carOwner;
      	$scope.carLicenseNOTemp=carLicenseNO;
       	$scope.giveUpShow=true;
       	$scope.title='提示';
    };
    //确认退保
    $scope.ensureGiveUp=function(){
    	console.log('退保hirePurchaseAgreementID:'+$scope.hirePurchaseAgreementIDTemp+'--payOrderID为：'+$scope.payOrderIDTemp);
      	$http({
	        method: 'post',
	        data: {
	        	hirePurchaseAgreementID:$scope.hirePurchaseAgreementIDTemp,
	        	payOrderID:$scope.payOrderIDTemp,
	        	ticket:$location.$$search.ticket,
	        	domain:$location.$$search.domain
	        },
	        url: serverUrl+'userManager/giveUpForLastPayFail'
      	}).then(function successCallback(response) {
      		console.log(response.data.errorCode);
	        if(response.data.errorCode==0){
		        var obj = getInfo();
				//$scope.oldInfo = obj;
				listTwoPay(obj);//退保成功后刷新列表
		        $scope.giveUpShow=false;
		        $scope.giveUpSuceess=true;
				$timeout(function() {
					$scope.giveUpSuceess = false
				}, 2000);
	        }else{
	        	userAuth.isLogin(response.data);
	          	showError.showErrorMsg('退保失败');
	        }
      	}, function errorCallback(response) {
        	showError.showErrorMsg('退保--网络连接失败');
      	});
    }

});
