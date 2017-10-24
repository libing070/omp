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
  .controller('PlatnatureCtrl', function ($scope, $http, $timeout,serverUrl,showError,$location,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.goTo=function(add){
      $location.path(add);
    };

    //查询平台属性
    function list(){
      $http({
        method: 'post',
        data: {ticket:$location.$$search.ticket,domain:$location.$$search.domain},
        url: serverUrl+'/systemManager/queryPlatConfig'
      }).then(function successCallback(response) {
        console.log('查询平台属性'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.platList = response.data.data;
            $scope.serviceHotline=response.data.data.serviceHotline;
            $scope.address=response.data.data.address;
            $scope.postcode=response.data.data.postcode;
            $scope.receiver=response.data.data.receiver;
            $scope.phone=response.data.data.phone;
            $scope.serviceTimePrompt=response.data.data.serviceTimePrompt;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取平台属性失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取平台属性失败--网络错误');
      });
    }
    list();

    //关闭模态框
    $scope.closeModal=function(){
      $scope.modalShow=false;
      $scope.modalEditPlat=false;
      list();
      console.log($scope.serviceHotline);
    };

      $scope.hasError=false;
    $scope.closeError=function(){
      $scope.hasError=false;
    };
    //编辑平台属性
    $scope.eidtPlat=function(platConfigID){
      $scope.platConfigID=platConfigID;
      $scope.modalShow=true;
      $scope.modalEditPlat=true;
      $scope.someNull=false;
    };

    //平台属性编辑弹出框
    $scope.someNull=false;
    //判断必填项是否填写
    function canEdit(){
      $scope.someNull=false;
      if(($scope.serviceHotline==undefined||$scope.serviceHotline=="")||($scope.address==undefined||$scope.address=="")||
        ($scope.postcode==undefined||$scope.postcode=="")||($scope.receiver==undefined||$scope.receiver=="")||($scope.phone==undefined||$scope.phone=="")||($scope.serviceTimePrompt==undefined||$scope.serviceTimePrompt=="")){
        $scope.someNull=true;
      }
    }
    //必填项填写完整
    $scope.ensureEditPlat=function(){
      canEdit();
      $scope.judge();
      if(($scope.someNull==false)&&$scope.isServiceHotlineNumber&&$scope.isPostcodeNumber&&$scope.isPhoneNumber){
        $http({
          method: 'post',
          data: {platConfigID:$scope.platConfigID,serviceHotline:$scope.serviceHotline,address:$scope.address,postcode:$scope.postcode,receiver:$scope.receiver,phone:$scope.phone,serviceTimePrompt:$scope.serviceTimePrompt,ticket:$location.$$search.ticket,domain:$location.$$search.domain},
          url: serverUrl+'/systemManager/updatePlatConfig'
        }).then(function successCallback(response) {
          console.log('编辑平台属性'+response.data.errorCode);
          if(response.data.errorCode==0){
            $scope.modalShow=false;
            $scope.modalEditPlat=false;
            $scope.modalPlatAlreadySave=true;
            $timeout(function(){$scope.modalPlatAlreadySave=false;},2000);
            list();
          }else{
            userAuth.isLogin(response.data);
            showError.showErrorMsg('编辑平台属性失败');
          }
        }, function errorCallback(response) {
          showError.showErrorMsg('编辑平台属性失败--网络错误');
        });
      }
    };

$scope.judgeNull=function(){
  $scope.someNull=false;
  $scope.isServiceHotlineNumber=true;
  $scope.isPostcodeNumber=true;
  $scope.isPhoneNumber=true;
};

//校验
$scope.isServiceHotlineNumber=true;
$scope.isPostcodeNumber=true;
$scope.isPhoneNumber=true;
    $scope.judge=function(){
      $scope.isServiceHotlineNumber=true;
      $scope.isPostcodeNumber=true;
      $scope.isPhoneNumber=true;
      var reg=/[0-9]{5,}/;
      var regPostcode=/^[0-9]{6}$/;
      if($scope.serviceHotline.length!=0){
        $scope.isServiceHotlineNumber=reg.test($scope.serviceHotline);
      }
     if($scope.postcode.length!=0){
        $scope.isPostcodeNumber=regPostcode.test($scope.postcode);
      }
      if($scope.phone.length!=0){
        $scope.isPhoneNumber=reg.test($scope.phone);
      }
    }

    
    
  });

