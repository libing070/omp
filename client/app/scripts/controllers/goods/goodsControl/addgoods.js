/**
 * Created by Administrator on 2015/12/9.
 */
/**
 * Created by Administrator on 2015/12/8.
 */
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
  .controller('AddGoodsCtrl', function ($rootScope, $scope,$http,  $routeParams, $location,$timeout,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
$scope.hasError=false;
    $scope.closeError=function(){
      $scope.hasError=false;
    };
    $rootScope.ticket=$routeParams.ticket;
    $rootScope.domain=$routeParams.domain;
    $scope.minIntervalTimeInt=true;
    $scope.minDayInt=true;
    $scope.serviceRateInt=true;

    $scope.goTo=function(add){
      $location.path(add);
    };

    //获取保险种类列表
    function typeKindList(){
      $http({
        method: 'post',
        data: {
        	codeType : 'insureType',ticket:$rootScope.ticket,domain:$rootScope.domain
        },
        url: serverUrl+'/systemManager/queryBaseCode'
      }).then(function successCallback(response){
        if(response.data.errorCode==0){
          $scope.typeKindList=response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取保险种类列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取保险种类列表失败--网络错误');
      });
    }
   typeKindList();

    //获取险种方案列表
    function planKindList(){
      $http({
        method: 'post',
        data: {ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/protectManager/queryProtectPlanList'
      }).then(function successCallback(response){
        //console.log('险种方案查询'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.palnKindList=response.data.data;
          //console.log( $scope.palnKindList);
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取平台险种列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取平台险种列表失败--网络错误');
      });
    }
    planKindList();

    //获取产品线列表
    $scope.lineList=function(){
      $http({
        method: 'post',
        data: {ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/supplierRelationManager/queryAllGoodsType'
      }).then(function successCallback(response) {
        //console.log('产品线'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.lines = response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取产品线列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取产品线列表失败--网络错误');
      });
    };
    $scope.lineList();

    //判断必选项是否已输入,获取焦点事件
    $scope.code=function(){
        $scope.goodsCustomNumberNull=false;
        $scope.goodsNameNull=false;
        $scope.goodsTypeNull=false;
        $scope.goodsDescriptionNull=false;
        $scope.typeNull=false;
        $scope.minIntervalTimeNull=false;
        $scope.minDayNull=false;
        $scope.serviceRateNull=false;
        $scope.planKindNull=false;
        $scope.minIntervalTimeInt=true;
        $scope.minDayInt=true;
        $scope.serviceRateInt=true;
    };

    //判断必填项是否已填
    $scope.judgeCanAdd=function(){
      $scope.minIntervalTimeInt=true;
      $scope.minDayInt=true;
      $scope.serviceRateInt=true;
      $scope.canAdd=true;
      if($scope.goodsCustomNumber==""||$scope.goodsCustomNumber==undefined){
        $scope.goodsCustomNumberNull=true;
        $scope.canAdd=false;
      }
      if($scope.goodsName==""||$scope.goodsName==undefined){
        $scope.goodsNameNull=true;
        $scope.canAdd=false;
      }
      if($scope.goodsTypeID==""||$scope.goodsTypeID==undefined){
        $scope.goodsTypeNull=true;
        $scope.canAdd=false;
      }
      if($scope.goodsDescription==""||$scope.goodsDescription==undefined){
        $scope.goodsDescriptionNull=true;
        $scope.canAdd=false;
      }
      if($scope.type==""||$scope.type==undefined){
        $scope.typeNull=true;
        $scope.canAdd=false;
      }
      if($scope.protectPlanID==""||$scope.protectPlanID==undefined){
        $scope.planKindNull=true;
        $scope.canAdd=false;
      }
      if($scope.minIntervalTime==""||$scope.minIntervalTime==undefined){
        $scope.minIntervalTimeNull=true;
        $scope.canAdd=false;
      }else{
        $scope.minIntervalTimeInt=/^[1-9][0-9]*(\s)*$/.test($scope.minIntervalTime);
        $scope.canAdd=$scope.minIntervalTimeInt;
      }
      if($scope.minDay==""||$scope.minDay==undefined){
        $scope.minDayNull=true;
        $scope.canAdd=false;
      }else{
        $scope.minDayInt=/^[1-9][0-9]*(\s)*$/.test($scope.minDay);
        $scope.canAdd=$scope.minDayInt;
      }
      if($scope.serviceRate==""||$scope.serviceRate==undefined){
        $scope.serviceRateNull=true;
        $scope.canAdd=false;
      }else{
        $scope.serviceRateInt=/^[0-9]+(\.[0-9]{0,2})?(\s)*$/.test($scope.serviceRate);
        $scope.canAdd=$scope.serviceRateInt;
      }
    };
    //新增商品
    $scope.add=function(){
      $scope.judgeCanAdd();
      console.info($scope.canAdd);
      if($scope.canAdd==true&&$scope.protectPlanID){
        $http({
          method: 'post',
          data: {goodsCustomNumber:$scope.goodsCustomNumber,goodsName:$scope.goodsName,goodsDescription:$scope.goodsDescription,
            goodsTypeID:$scope.goodsTypeID,goodsTypeName:$scope.goodsTypeName, insureType:$scope.type,
            protectPlanID:$scope.protectPlanID,minIntervalTime:$scope.minIntervalTime,minDay:$scope.minDay,serviceRate:$scope.serviceRate,
            ticket:$rootScope.ticket,domain:$rootScope.domain
          },
          url: serverUrl+'/goodsManager/insertGoodsBaseInfo'
        }).then(function successCallback(response){
          console.log('新增商品信息'+response.data.errorCode);
          if(response.data.errorCode==0){
            $scope.saveGoods=true;
            $timeout(function(){$scope.saveGoods=false;},2000);
//        $location.path('/goodscontrol');
            var goodsID = response.data.data.goodsID;
           $location.path('/goodsupdatepicture/'+goodsID+'/'+$rootScope.ticket+'/'+$rootScope.domain);
          }else if(response.data.errorCode==7011){
            $scope.showGoodsTip=true;
            $scope.GoodsCodeRepeat=true;
          }else if(response.data.errorCode==7012){
            $scope.showGoodsTip=true;
            $scope.GoodsNameRepeat=true;
          }else{
            userAuth.isLogin(response.data);
            showError.showErrorMsg('新增商品失败');
          }
        }, function errorCallback(response) {
          showError.showErrorMsg('新增商品失败--网络错误');
        });
      }
    };

      $scope.closePop=function(){
          $scope.showGoodsTip=false;
          $scope.GoodsNameRepeat=false;
        $scope.GoodsCodeRepeat=false;
      };

  });

