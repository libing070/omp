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
  .controller('SupplierCtrl', function ($scope, $http, $rootScope,$timeout,serverUrl,showError,$location,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $rootScope.ticket=$location.$$search.ticket || $rootScope.ticket;
    $rootScope.domain=$location.$$search.domain || $rootScope.domain;
  console.log($rootScope.ticket);
  console.log($rootScope.domain);

    $scope.goTo=function(address){
      $location.path(address);
    };

    $scope.supplierModalBox=false;
    $scope.supplierModal=false;
    $scope.hasError=false;
    $scope.supplierAlreadyDel=false;
    $scope.supplierDelFalse=false;

    $scope.closeError=function(){
      $scope.hasError=false;
    };


    $scope.list=function(supplierID,status){
      $http({
        method: 'post',
        data: {supplierID:supplierID,status:status,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/supplierManager/querySupplierList'
      }).then(function successCallback(response) {
        console.log('获取供应商列表'+response.data.errorCode);
        console.log(response.data.data);
        if(response.data.errorCode==0){
          $scope.suppliers = response.data.data;
          $scope.suppliers.forEach(function(value){
            //if(value.cooperationStartTime==undefined){value.cooperationStartTime='  '}
            //if(value.cooperationEndTime==undefined){value.cooperationEndTime='  '}
          });
          $scope.searchResult= response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取供应商列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取供应商列表失败--网络错误');
      });
    };
    $scope.list('','N');

    $scope.delSupplier=function(supplierID){
      $scope.supplierID=supplierID;
      $scope.supplierModalBox=true;
      $scope.supplierModal=true;
    };
    $scope.closeModalBox=function(){
      $scope.supplierModalBox=false;
      $scope.supplierModal=false;
    };

    $scope.ensureDelSupplier=function(){
      $http({
        method: 'post',
        data: {supplierID:$scope.supplierID,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/supplierManager/deleteSupplier'
      }).then(function successCallback(response) {
        console.log(response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.supplierModalBox=false;
          $scope.supplierModal=false;
          $scope.supplierAlreadyDel=true;
          $timeout(function(){
            $scope.supplierAlreadyDel=false;
          },2000);
          $scope.list('','N');
        }else if(response.data.errorCode==7005){
          $scope.supplierModalBox=false;
          $scope.supplierModal=false;
          $scope.supplierNotFalse=true;
        }else if(response.data.errorCode==7023){
          $scope.supplierModalBox=false;
          $scope.supplierModal=false;
          $scope.supplierNotFalseOrder=true;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('删除供应商失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('删除供应商失败--网络连接失败');
      });
    };

$scope.closePop=function(){
    $scope.supplierNotFalse=false;
  $scope.supplierNotFalseOrder=false;
};


  });

