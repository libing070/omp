/**
 * Created by ZhangZe on 2015-12-11 11:03:32.
 */

app
  .controller('KindDetailCtrl', function ($scope, $rootScope,$routeParams, $http, $timeout,$location,serverUrl,showError, userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.orderStatus = ['未激活', '系统投保', '系统转投保单失败', '系统转投保单成功', '核保通过', '核保不通过', '公司已支付', '系统转保单失败', '系统转保单成功', '已退费', '已退保','欠款',' 已退保','已取消'];
	$scope.type = ['商业险', '交强险'];
    $scope.hasError=false;
    $scope.ticket = $routeParams.ticket || $rootScope.ticket;
    $scope.domain = $routeParams.domain || $rootScope.domain;
    var goodsOrderID=$routeParams.goodsOrderID;
    $scope.goodsOrderID=goodsOrderID;
	console.log('-----商品订单ID----------'+$scope.goodsOrderID);
	console.log('-----domain----------'+$scope.domain);
	console.log('-----ticket----------'+$scope.ticket);

    $scope.goTo=function(add){
      $location.path(add);
    };

	 //获取用户--订单记录--保障详情
    $scope.queryUserOfKindDetail=function(){
	    $http({
	        method: 'post',
	        data: {goodsOrderID:$scope.goodsOrderID,ticket:$scope.ticket,domain:$scope.domain},
	        url: serverUrl+'/orderManager/queryProtectDetailForOrder'
	    }).then(function successCallback(response) {
	        console.log('保障详情:'+response.data.errorCode);
	        if(response.data.errorCode == 0){
	        	console.log(response.data.data)
	        	console.log('保障明细'+response.data.data.kindList)
	          	$scope.orderDetailResult= response.data.data;
	          	$scope.kindListResult= response.data.data.kindList;
	        }else{
	        	userAuth.isLogin(response.data);
	          	showError.showErrorMsg('获取保障明细失败');
	        }
	    }, function errorCallback(response) {
	        showError.showErrorMsg('获取保障明细--网络错误');
	    });
	 }
	 $scope.queryUserOfKindDetail();

});

