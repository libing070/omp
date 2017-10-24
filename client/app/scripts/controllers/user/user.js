'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app.
	controller('UserCtrl', function($scope, $rootScope,$http, $timeout,$location,serverUrl, showError,userAuth){
		this.awesomeThings = [
      		'HTML5 Boilerplate',
      		'AngularJS',
      		'Karma'
    	];
    $scope.userStatusTemp = ['正常用户','测试用户', '黑名单'];  //（(1正常  2灰度  3黑名单)）
    $scope.userHandleL = ['设为测试用户','转为正常用户', '转为正常用户'];
    $scope.userHandleR = ['设为黑名单', '设为黑名单','设为测试用户'];
    $scope.statusChangeL = ['2', '1', '1'];
    $scope.statusChangeR = ['3', '3', '2'];

    $rootScope.domain=$location.$$search.domain || $rootScope.domain;
    $rootScope.ticket=$location.$$search.ticket || $rootScope.ticket;
    console.log($rootScope.ticket);
    console.log($rootScope.domain);
    $scope.goTo=function(add){
      $location.path(add);
    };

    listUser(null);

    $scope.dates = {
		today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
		minDate: moment("2015-12-06 12:13:24")
	};
    $scope.$watch('dates.search_registDateStart', function() {
		$scope.dates.minDate = $scope.dates.search_registDateStart || "";
		$scope.$broadcast('pickerUpdate', ['search_registDateEnd'], {
			minDate: $scope.dates.minDate,
		});

	});
	$scope.$watch('dates.search_registDateEnd', function() {
		$scope.dates.maxDate = $scope.dates.search_registDateEnd || "";
		$scope.$broadcast('pickerUpdate', ['search_registDateStart'], {
			maxDate: $scope.dates.maxDate,
		});
	});
    /**
	 * 查找按钮
	 */
	$scope.searchUser = function(){
		var obj = getInfo();
		//保存查找之后的数据 用于记录查找条件 排序时使用
		$scope.oldInfo = obj;
		listUser(obj);
	};

    //按注册日期排序
	$scope.sortStatus = -1;
	$scope.sortSign = "↑";
	$scope.doSort = function() {
		var obj =$scope.oldInfo?$scope.oldInfo:{};
		$scope.sortStatus = -$scope.sortStatus;
		if ($scope.sortStatus < 0) {
			$scope.sortSign = "↓";
			obj.sortDir="DESC";
		} else {
			$scope.sortSign = "↑";
			obj.sortDir="ASC";
		}
		obj.sortFieldName="registDate";
		listUser(obj);
	};

    /**
	 * 初始化参数信息
	 */
	function getInfo(){
		var obj={};
		obj.domain = $rootScope.domain;
		obj.ticket = $rootScope.ticket;
		obj.userStatus = $scope.search_userStatus?$scope.search_userStatus:'';
		obj.registDateStart = $scope.dates.search_registDateStart ? $scope.dates.search_registDateStart.format('YYYY-MM-DD HH:mm' ) : "";
		obj.registDateEnd =   $scope.dates.search_registDateEnd   ? $scope.dates.search_registDateEnd.format('YYYY-MM-DD HH:mm' ) : "";
		obj.userName = $scope.search_userName?$scope.search_userName:'';
		obj.phoneNO = $scope.search_phoneNO?$scope.search_phoneNO:'';
		obj.licenseNO = $scope.search_licenseNO?$scope.search_licenseNO:'';
		console.log('初始化参数:'+obj.registDateStart+','+obj.registDateEnd);
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
      if(params.registDateStart&&params.registDateStart!=null){
        param.key = "起始日期:";
        param.value =params.registDateStart;
        result.push(param);
        $scope.isReal = true;
      }

      param = {};
      if(params.registDateEnd&&params.registDateEnd!=null){
        param.key = "终止日期:";
        param.value =params.registDateEnd;
        result.push(param);
        $scope.isReal = true;
      }

      param = {};
      if(params.userStatus&&params.userStatus!=null){
        param.key = "用户状态:";
       if(params.userStatus=='1'){param.value="正常用户"}else if(params.userStatus=='2'){param.value="测试用户"}else{param.value="黑名单"}
        result.push(param);
        $scope.isReal = true;
      }

      param = {};
      if(params.userName&&params.userName!=null){
        param.key = "姓名:";
        param.value=params.userName;
        result.push(param);
        $scope.isReal = true;
      }

      param = {};
      if(params.phoneNO&&params.phoneNO!=null){
        param.key = "手机号:";
        param.value = params.phoneNO;
        result.push(param);
        $scope.isReal = true;
      }

      param = {};
      if(params.licenseNO&&params.licenseNO!=null){
        param.key = "常用车牌:";
        param.value =params.licenseNO;
        result.push(param);
        $scope.isReal = true;
      }

      return result;
    }

    /**
	 * 导出excel的按钮
	 */
	$scope.exportExcel =  function(){
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
      obj.domain = $rootScope.domain;
      obj.ticket = $rootScope.ticket;
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
    $scope.pageSize=10;
    function listUser(obj){
	    if(!obj){
			obj={};
		}
	    obj.domain = $rootScope.domain;
		obj.ticket = $rootScope.ticket;
		obj.pageSize= $scope.pageSize ? $scope.pageSize : 10;
		obj.pageNumber= obj.pageNumber ? obj.pageNumber : 1;

		console.log('ticket------'+obj.ticket);
		console.log('ticket------'+obj.domain);
		$http({
			method: 'post',
			data:obj,
	    	url : serverUrl + 'userManager/queryUserList'
	    }).then(function successCallback(response){
	    	console.log('用户列表数据：'+response.data.data);
	    	console.log(response.data.errorCode);
	    	if(response.data.errorCode == 0){
				$scope.domain = $rootScope.domain;
				$scope.ticket = $rootScope.ticket;
				$scope.Users = response.data.data.userList;
				$scope.total = response.data.data.totalCount;
				$scope.currentPage = obj.pageNumber;
				$scope.DoCtrlPagingAct = function(text, page, pageSize, total) {
					/*var data = {
						pageNumber:page,
						pageSize:$scope.pageSize,
						ticket:$rootScope.ticket,
						domain:$rootScope.domain
					};*/
					var data = getInfo();
					data['pageNumber'] = page;
					data['pageSize'] = pageSize;
					console.log('ticket------'+obj.ticket);
					console.log('domain------'+obj.domain);
					console.log(JSON.stringify(data));
					listUser(data);
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
	function exportReport(obj){
		$http({
			method: 'post',
			data:obj,
			url: serverUrl + '/exportManager/exportUserList'
		}).then(function successCallback(response) {
			if (response.data.errorCode == 0) {
        $scope.popShow = false;
        $scope.modalGoodsSuccess=true;
        $timeout(function(){$scope.modalGoodsSuccess=false},2000);
				console.log(response.data.data.reportUrl);
				$scope.reportUrl = response.data.data.reportUrl;
				window.location.href=$scope.reportUrl;
			}else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "导出excel失败!";
				$scope.PopHide=true;
			}
		})
	}

    //获取用户详情
    $scope.detailUser=function(userID){
      	console.log(userID);
	    $http({
	        method: 'post',
	        data: {userID:userID,ticket:$rootScope.ticket,domain:$rootScope.domain},
	        url: serverUrl+'userManager/queryUserDetail'
	    }).then(function successCallback(response) {
	        if(response.data.errorCode == 0){
	          	$scope.userDetailResult= response.data.data[0];
	        }else{
	        	userAuth.isLogin(response.data);
	          	showError.showErrorMsg('获取用户详情失败');
	        }
	    }, function errorCallback(response) {
	        showError.showErrorMsg('获取用户详情--网络错误');
	    });
    };
    /**
	 * 取消提示
	 */
	$scope.cancel = function() {
		$scope.PopHide = false;
	};
    //关闭模态框
    $scope.closeModalBox=function(){
      $scope.PopHideBox=false;
      $scope.PopHide=false;
    };
    //设置用户状态
     $scope.setUserStatus=function(userID,userName, phoneNO,userStatus){
      	$scope.userID=userID;
      	$scope.userStatus=userStatus;
       	$scope.PopHideBox=true;
       	$scope.PopHide=true;
       	$scope.userType = '';
       	$scope.title='提示';
       	if(userStatus == '2'){
       		$scope.userType = '设为测试用户？';
	       	$scope.context = userName+'('+phoneNO+')';
       	}else if(userStatus == '3'){
       		$scope.userType = '设为黑名单?';
       		$scope.context = userName+'('+phoneNO+')';
       	}else {
       		$scope.userType = '转为正常用户?';
       		$scope.context = userName+'('+phoneNO+')';
       	}
//		$scope.PopHide=true;
    };
    //确认修改用户状态
    $scope.ensureSetUserStatus=function(){
    	console.log('修改用户:'+$scope.userID+'状态为：'+$scope.userStatus);
      	$http({
	        method: 'post',
	        data: {userID:$scope.userID,userStatus:$scope.userStatus,ticket:$rootScope.ticket,domain:$rootScope.domain},
	        url: serverUrl+'userManager/setUserStatus'
      	}).then(function successCallback(response) {
        if(response.data.errorCode==0){
        	var data=getInfo();
	        listUser(data);//修改成功后刷新列表
	        $scope.PopHideBox=false;
	        $scope.PopHide=false;
	        $scope.settingSuceess = true;
			$timeout(function() {
				$scope.settingSuceess = false
			}, 2000);
        }else{
        	userAuth.isLogin(response.data);
          	showError.showErrorMsg('修改用户状态失败');
        }
      }, function errorCallback(response) {
        	showError.showErrorMsg('修改用户状态失败--网络连接失败');
      });
    }

});
