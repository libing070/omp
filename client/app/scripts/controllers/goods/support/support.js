/**
 * Created by Administrator on 2015/12/8.
 */
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
  .controller('SupportCtrl', function ($scope, $http, $location,$timeout,$rootScope,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
      $scope.hasError=false;
      $scope.closeError=function(){
        $scope.hasError=false;
      };

    $scope.goTo=function(add){
      $location.path(add);
    };

    $rootScope.ticket=$location.$$search.ticket || $rootScope.ticket;
    $rootScope.domain=$location.$$search.domain || $rootScope.domain;
    $scope.list=function(){
      $http({
        method: 'post',
        data: {ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/protectManager/queryProtectPlanList'
      }).then(function successCallback(response) {
        console.log('查询保障方案列表'+response.data.errorCode);
        console.log(response.data.data);
        if(response.data.errorCode==0){
          $scope.protectPlans = response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取保障方案列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取保障方案列表失败--网络错误');
      });
    };
    $scope.list();

    //关闭模态框
    $scope.closeModalBox=function(){
      $scope.supplierModalBox=false;
      $scope.supportModal=false;
    };

    //删除保障方案
     $scope.delSupport=function(protectPlanID){
      $scope.protectPlanID=protectPlanID;
       $scope.supplierModalBox=true;
       $scope.supportModal=true;
    };
    //确认删除
    $scope.ensureDelSupport=function(){
      $http({
        method: 'post',
        data: {protectPlanID:$scope.protectPlanID,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/protectManager/deleteProtectPlan'
      }).then(function successCallback(response) {
        console.log('删除保障方案'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.list();
          $scope.supplierModalBox=false;
          $scope.supportModal=false;
          $scope.supplierAlreadyDel=true;
          $timeout(function(){$scope.supplierAlreadyDel=false;},2000);
        }else if(response.data.errorCode==7010){
          $scope.supplierModalBox=false;
          $scope.supportModal=false;
          $scope.supplierDelFalse=true;
        }else{
          userAuth.isLogin(response.data);
          $scope.supplierModalBox=false;
          $scope.supportModal=false;
          showError.showErrorMsg('删除保障方案失败');
        }
      }, function errorCallback(response) {
        $scope.supplierModalBox=false;
        $scope.supportModal=false;
        showError.showErrorMsg('删除保障方案失败--网络连接失败');
      });
    };

      $scope.closePop=function(){
        $scope.supplierDelFalse=false;
      };
  });

