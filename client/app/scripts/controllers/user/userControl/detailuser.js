/**
 * Created by ZhangZe on 2015-12-11 11:03:32.
 */

app
  .controller('DetailUserCtrl', function ($scope, $rootScope,$routeParams, $http, $timeout,$location,serverUrl,showError, userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.userStatusTemp = ['正常用户','测试用户', '黑名单'];
    $scope.orderStatus = ['待支付', '已支付', '超时取消', '已确定分期', '确认中', '保险公司拒保', '完成出单', '已退费', '已取消', '欠款', '已退保'];
    $scope.hasError=false;

    var userID=$routeParams.userID;
    $scope.domain=$routeParams.domain || $rootScope.domain;
    $scope.ticket=$routeParams.ticket || $rootScope.ticket;
    $scope.userID=userID;
	console.log('-----用户ID----------'+$scope.userID);
	console.log('-----domain----------'+$scope.domain);
	console.log('-----ticket----------'+$scope.ticket);

    $scope.goTo=function(add){
      $location.path(add);
    };

    //获取用户--基本详情
    $scope.detailUser=function(){
	    $http({
	        method: 'post',
	        data: {userID:$scope.userID,ticket:$scope.ticket,domain:$scope.domain},
	        url: serverUrl+'userManager/queryUserDetail'
	    }).then(function successCallback(response) {
	        console.log('用户详情:'+response.data.errorCode);
	        if(response.data.errorCode == 0){
	        	console.log(response.data.data)
	          	$scope.userDetailResult= response.data.data;
	        }else{
	          	userAuth.isLogin(response.data);
	          	showError.showErrorMsg('获取用户详情失败');
	        }
	    }, function errorCallback(response) {
	        showError.showErrorMsg('获取用户详情--网络错误');
	    });
	 }
	 $scope.detailUser();


	 //获取用户--车辆记录
    $scope.carInfoForUser=function(){
	    $http({
	        method: 'post',
	        data: {userID:$scope.userID,ticket:$scope.ticket,domain:$scope.domain},
	        url: serverUrl+'userManager/queryCarInfoForUser'
	    }).then(function successCallback(response) {
	        console.log('车辆记录:'+response.data.errorCode);
	        if(response.data.errorCode == 0){
	        	console.log(response.data.data)
	          	$scope.carInfoResult= response.data.data;
	        }else{
	        	userAuth.isLogin(response.data);
	          	showError.showErrorMsg('获取车辆记录失败');
	        }
	    }, function errorCallback(response) {
	        showError.showErrorMsg('获取车辆记录--网络错误');
	    });
	 }
	 $scope.carInfoForUser();

	  //获取用户--还款记录
    $scope.queryPaymentRecordForUser=function(){
	    $http({
	        method: 'post',
	        data: {userID:$scope.userID,ticket:$scope.ticket,domain:$scope.domain},
	        url: serverUrl+'userManager/queryPaymentRecordForUser'
	    }).then(function successCallback(response) {
	        console.log('还款记录:'+response.data.errorCode);
	        if(response.data.errorCode == 0){
	        	console.log(response.data.data)
	          	$scope.paymentRecordResult= response.data.data;
	        }else{
	        	userAuth.isLogin(response.data);
	          	showError.showErrorMsg('获取还款记录失败');
	        }
	    }, function errorCallback(response) {
	        showError.showErrorMsg('获取还款记录--网络错误');
	    });
	 }
	$scope.queryPaymentRecordForUser();

	//获取用户--订单记录
    $scope.queryOrderRecordForUser=function(){
	    $http({
	        method: 'post',
	        data: {userID:$scope.userID,ticket:$scope.ticket,domain:$scope.domain},
	        url: serverUrl+'userManager/queryOrderRecordForUser'
	    }).then(function successCallback(response) {
	        console.log('订单记录:'+response.data.errorCode);
	        if(response.data.errorCode == 0){
	        	console.log(response.data.data)
	          	$scope.orderRecordResult= response.data.data;
	        }else{
	        	userAuth.isLogin(response.data);
	          	showError.showErrorMsg('获取订单记录失败');
	        }
	    }, function errorCallback(response) {
	        showError.showErrorMsg('获取订单记录--网络错误');
	    });
	 }
	$scope.queryOrderRecordForUser();
});

