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
  .controller('addrmposterCtrl', function ($scope, $http, $routeParams, $location,$timeout,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

      $scope.hasError=false;
      $scope.closeError=function(){
        $scope.hasError=false;
      };

    $scope.ticket=$routeParams.ticket;
    $scope.domain=$routeParams.domain;

    $scope.goTo=function(add){
      $location.path(add);
    };
    //获取跳转类型下拉列表
    function list(){
      $http({
        method: 'post',
        data: {codeType:"publishType",ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/systemManager/queryBaseCode'
      }).then(function successCallback(response){
        if(response.data.errorCode==0){
          $scope.recommendList=response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取跳转类型下拉列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取跳转类型下拉列表失败--网络错误');
      });
    }
    list();

    //选择活动或者商品
    $scope.selectType=function(){
      if($scope.recommendType==1){
        $scope.showGoods=true;
        $scope.showActivity=false;
      }else{
        $scope.showActivity=true;
        $scope.showGoods=false;
      }
    };

    //获取目标活动列表
    function getActivityList(){
      $http({
        method: 'post',
        data: {ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/systemManager/queryActivityList'
      }).then(function successCallback(response){
        if(response.data.errorCode==0){
          $scope.activityList=response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取目标活动列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取目标活动列表失败--网络错误');
      });
    }
    getActivityList();

    //获取商品列表
    function getGoodsList(status){
      $http({
        method: 'post',
        data: {goodsStatus:status,ticket:$scope.ticket,domain:$scope.domain},//商品必须为上架状态
        url: serverUrl+'/goodsManager/queryGoodsList'
      }).then(function successCallback(response){
        if(response.data.errorCode==0){
          $scope.goodsList=response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取目标商品列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取目标商品列表失败--网络错误');
      });
    }
    getGoodsList('2');

    //显示选择活动页面
    $scope.showSelActivity=function(){
      $scope.modalSelectActivity=true;
      $scope.modalShow=true;
      $scope.ActivityNull=false;
    };
    //显示选择商品页面
    $scope.showSelGoods=function(){
      $scope.modalSelectGoods=true;
      $scope.modalShow=true;
      $scope.goodsNull=false;
      getGoodsList('2');
    };

  //关闭选择模态框
   $scope.closePoster=function(){
  $scope.modalSelectActivity=false;
     $scope.modalSelectGoods=false;
  $scope.modalShow=false;
     $scope.activityPicNull=false;
 };

      //选择商品
      $scope.formDataa={};
      $scope.selGoods=function(){
        $scope.selGoodsID=$scope.formDataa.goodsID;
        if($scope.selGoodsID!=undefined){
          $http({
            method: 'post',
            data: {goodsID:$scope.selGoodsID,ticket:$scope.ticket,domain:$scope.domain},
            url: serverUrl+'/goodsManager/queryGoodsList'
          }).then(function successCallback(response){
            console.log('查询商品名称'+response.data.errorCode);
            if(response.data.errorCode==0){
              $scope.goodsList=response.data.data[0];
              //console.log($scope.goodsList);
            }else{
              userAuth.isLogin(response.data);
              showError.showErrorMsg('获取商品名称失败');
            }
          }, function errorCallback(response) {
            showError.showErrorMsg('获取商品名称失败--网络错误');
          });
        }
        else if($scope.selGoodsID==undefined){
          $scope.recommendType="";
          $scope.modalSelectGoods=false;
          $scope.showGoods=false;
        }
      };

      // 选择活动
      $scope.formData={};
    $scope.canAddActivity=true;
      $scope.selActivity=function(){
        $scope.selActivityID=$scope.formData.activityID;
        $http({
          method: 'post',
          data: {activityID:$scope.selActivityID,ticket:$scope.ticket,domain:$scope.domain},
          url: serverUrl+'/systemManager/queryActivityName'
        }).then(function successCallback(response){
          console.log('查询活动名称'+response.data.errorCode);
          if(response.data.errorCode==0){
            $scope.activityName=response.data.data.activityName;
            $scope.imageFlag=response.data.data.imageFlag;
            console.log($scope.imageFlag);
            if($scope.imageFlag=='Y'){
              $scope.activityPicNull=false;
              $scope.canAddActivity=true;
            }else{
              $scope.canAddActivity=false;
            }
          }else{
            userAuth.isLogin(response.data);
            showError.showErrorMsg('获取活动名称失败');
          }
        }, function errorCallback(response) {
          showError.showErrorMsg('获取活动名称失败--网络错误');
        });
        if($scope.selActivityID==undefined){
          $scope.recommendType="";
          $scope.modalSelectActivity=false;
          $scope.showActivity=false;
        }
      };

      //取消选择cancelSel
      $scope.closeSel=function(){
        $scope.modalSelectActivity=false;
        $scope.modalSelectGoods=false;
        $scope.modalShow=false;
        $scope.recommendType="";
        $scope.modalSelectActivity=false;
        $scope.modalSelectGoods=false;
        $scope.showActivity=false;
        $scope.showGoods=false;
      };

      //判断必填项是否已经填写
      $scope.canAddR=true;
      $scope.judgeAdd=function(){
        if($scope.recommendName==undefined||$scope.recommendName==""){
          $scope.recommendNameNull=true;
          $scope.canAddR=false;
        }
        if($scope.recommendType==undefined||$scope.recommendType==""){
          $scope.recommendTypeNull=true;
          $scope.canAddR=false;
        }
        if($scope.selActivityID==undefined||$scope.activityType==""){
          $scope.ActivityNull=true;
        }
        if($scope.selGoodsID==undefined||$scope.goodsType==""){
          $scope.goodsNull=true;
        }
        console.log('=====');
        console.log($scope.canAddR);

      };
      //获取焦点事件
      $scope.code=function(){
        $scope.recommendNameNull=false;
        $scope.recommendTypeNull=false;
        $scope.ActivityNull=false;
        $scope.goodsNull=false;
      };
      //新增推荐取海报
$scope.addrmposter=function(){
  $scope.judgeAdd();
  $scope.valueID=$scope.selActivityID||$scope.selGoodsID;
  console.log('recommendName');
  console.log($scope.recommendName);
  console.log('recommendType');
  console.log($scope.recommendType);
  console.log('valueID');
  console.log($scope.valueID);
  console.log($scope.canAddR);
  //if($scope.canAddR==true){
  if($scope.canAddActivity==true){
    $scope.activityPicNull=false;
    $http({
      method: 'post',
      data: {recommendName:$scope.recommendName,recommendType:$scope.recommendType	,valueID:$scope.valueID,ticket:$scope.ticket,domain:$scope.domain},
      url: serverUrl+'/systemManager/insertRecommend'
    }).then(function successCallback(response){
      console.log('新增推荐区海报'+response.data.errorCode);
      if(response.data.errorCode==0){
        $location.path('/rmposter');
      }else{
        userAuth.isLogin(response.data);
        showError.showErrorMsg('新增推荐区海报失败');
      }
    }, function errorCallback(response) {
      showError.showErrorMsg('新增推荐区海报失败--网络错误');
    });
  }else{
    $scope.activityPicNull=true;
  }
  //}

};


  });
