/**
 * Created by ZhangZe on 2015-12-11 11:03:32.
 */

app
  .controller('BillDetailCtrl', function ($scope, $routeParams, $http, $timeout,$location,serverUrl,showError, userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.hasError=false;
	$scope.domain=$routeParams.domain;
    $scope.ticket=$routeParams.ticket;

    $scope.goTo=function(add){
      $location.path(add);
    };

    var hirePurchaseAgreementID=$routeParams.hirePurchaseAgreementID;
    $scope.hirePurchaseAgreementID=hirePurchaseAgreementID;
	console.log('-----分期付款计划ID----------'+$scope.hirePurchaseAgreementID);
	console.log('-----domain----------'+$scope.domain);
	console.log('-----ticket----------'+$scope.ticket);
	 //获取用户--账单详情--还款计划及账单明细
    $scope.billDetail=function(){
	    $http({
	        method: 'post',
	        data: {hirePurchaseAgreementID:$scope.hirePurchaseAgreementID,ticket:$scope.ticket,domain:$scope.domain},
	        url: serverUrl+'userManager/queryUserOfBillDetail'
	    }).then(function successCallback(response) {
	        console.log('还款计划:'+response.data.errorCode);
	        if(response.data.errorCode == 0){
	        	console.log(response.data.data)
	        	console.log('账单明细'+response.data.data.billDetailList)
		        $scope.billDetailResult= response.data.data;
		        $scope.billDetailListResult= response.data.data.billDetailList;
	        }else{
	        	userAuth.isLogin(response.data);
	          	showError.showErrorMsg('获取账单明细失败');
	        }
	    }, function errorCallback(response) {
	        showError.showErrorMsg('获取账单明细--网络错误');
	    });
	 }
	 $scope.billDetail();

});

