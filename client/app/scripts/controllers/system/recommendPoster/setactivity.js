/**
 * Created by Administrator on 2015/12/11.
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
  .controller('SetactivityCtrl', function ($scope, $http, $routeParams,$rootScope,$timeout,serverUrl,showError,$location,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

      $scope.hasError=false;
      $scope.closeError=function(){
        $scope.hasError=false;
      };

    $scope.ticket=$routeParams.ticket || $rootScope.ticket;
    $scope.domain=$routeParams.domain || $rootScope.domain;

    $scope.goTo=function(add){
      $location.path(add);
    };
    //获取活动列表
  function list(){
    $http({
      method: 'post',
      data: {ticket:$scope.ticket,domain:$scope.domain},
      url: serverUrl+'/systemManager/queryActivityList'
    }).then(function successCallback(response) {
      console.log(response.data.errorCode);
      if(response.data.errorCode==0){
        $scope.activityList= response.data.data;
      }else{
        userAuth.isLogin(response.data);
        showError.showErrorMsg('获取活动列表失败');
      }
    }, function errorCallback(response) {
      showError.showErrorMsg('获取活动列表失败--网络错误');
    });
  }
 list();

    //关闭模态框
   $scope.closeModalDel=function(){
     $scope.modalShow=false;
     $scope.modalDel=false;
     $scope.modalAdd=false;
     $scope.modalEditName=false;
   };
    //删除活动
    $scope.delActivity=function(activityID){
      $scope.activityID=activityID;
      $scope.modalShow=true;
      $scope.modalDel=true;
    };
    //确认删除
  $scope.ensureModalDelActivity=function(){
    $http({
      method: 'post',
      data: {activityID:$scope.activityID,ticket:$scope.ticket,domain:$scope.domain},
      url: serverUrl+'/systemManager/deleteActivity'
    }).then(function successCallback(response) {
      console.log('删除活动'+response.data.errorCode);
      if(response.data.errorCode==0){
        //$scope.modalShow=false;
        $scope.modalDel=false;
        $scope.modalAlreadyDelActivity=true;
        $timeout(function(){$scope.modalAlreadyDelActivity=false;},2000);
        list();
      }else if(response.data.errorCode==7018){
        //$scope.modalShow=false;
        $scope.modalDel=false;
        $scope.modalActivityDelFalse=true;
      }else{
        userAuth.isLogin(response.data);
        $scope.modalShow=false;
        $scope.modalDel=false;
        showError.showErrorMsg('删除失败');
      }
    }, function errorCallback(response) {
      $scope.modalShow=false;
      $scope.modalDel=false;
      showError.showErrorMsg('删除失败--网络错误');
    });
  };

    //新增活动
    $scope.addActivity=function(){
      $scope.modalShow=true;
      $scope.modalAdd=true;
      $scope.activityName='';
      $scope.activityNameNull=false;
      $scope.activityNameRep=false;
    };
    //确定新增活动
    $scope.ensureModalAddActivity=function(){
      if($scope.activityName){
        $http({
          method: 'post',
          data: {activityName:$scope.activityName,ticket:$scope.ticket,domain:$scope.domain},
          url: serverUrl+'/systemManager/insertActivity'
        }).then(function successCallback(response) {
          console.log('新增活动'+response.data.errorCode);
          if(response.data.errorCode==0){
            $scope.modalShow=false;
            $scope.modalAdd=false;
            $scope.activityNameNull=false;
            $scope.activityNameRep=false;
            $scope.modalAlreadyAddActivity=true;
            $timeout(function(){$scope.modalAlreadyAddActivity=false;},2000);
            list();
          }else if(response.data.errorCode==7015){
            $scope.activityNameRep=true;
          }else{
            userAuth.isLogin(response.data);
            $scope.modalShow=false;
            $scope.modalDel=false;
            showError.showErrorMsg('新增失败');
          }
        }, function errorCallback(response) {
          $scope.modalShow=false;
          $scope.modalDel=false;
          showError.showErrorMsg('新增失败--网络错误');
        });
      }else{
        $scope.activityNameNull=true;
      }
    };

    $scope.enterActivityName=function(){
      $scope.activityNameNull=false;
      $scope.activityNameRep=false;
    };

    //编辑名称
 $scope.editName=function(activityID,activityName){
      $scope.activityID=activityID;
      $scope.activityName=activityName;
   $scope.modalShow=true;
   $scope.modalEditName=true;
   $scope.activityNameNull=false;
 };
//编辑活动名称弹出框
    $scope.ensureModalEditActivityName=function(){
      if($scope.activityName==""){$scope.activityNameNull=true;}
      else{
        $http({
          method: 'post',
          data: {activityID: $scope.activityID,activityName:$scope.activityName,ticket:$scope.ticket,domain:$scope.domain},
          url: serverUrl+'/systemManager/updateActivity'
        }).then(function successCallback(response) {
          console.log('编辑活动名称'+response.data.errorCode);
          if(response.data.errorCode==0){
            $scope.modalShow=false;
            $scope.modalEditName=false;
            $scope.modalAlreadyAddActivity=true;
            $timeout(function(){$scope.modalAlreadyAddActivity=false;},2000);
            list();
          }else if(response.data.errorCode==7015){
            $scope.modalActivityRepeat=true;
          }else{
            userAuth.isLogin(response.data);
            $scope.modalShow=false;
            $scope.modalEditName=false;
            showError.showErrorMsg('编辑名称失败');
          }
        }, function errorCallback(response) {
          $scope.modalShow=false;
          $scope.modalEditName=false;
          showError.showErrorMsg('编辑名称失败--网络错误');
        });
      }
    };
      $scope.closePop=function(){
        $scope.modalActivityRepeat=false;
        $scope.modalActivityDelFalse=false;
      };
  });

