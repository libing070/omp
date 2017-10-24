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
  .controller('RecommendGoodsControlCtrl', function ($scope, $http,  $rootScope,$location,$timeout,serverUrl,showError,userAuth) {

    $rootScope.ticket=$location.$$search.ticket || $rootScope.ticket;
    $rootScope.domain=$location.$$search.domain || $rootScope.domain;

    $scope.modalGoodsCannotHandle=false;
    $scope.hasError=false;
    $scope.closeError=function(){
      $scope.hasError=false;
    };
    //$scope.modalGoodsHuiFalse=false;
    $scope.goTo=function(add){
      $location.path(add);
    };
  //获取商品列表
    function list(goodsID,payType,goodsStatus){
      $http({
        method: 'post',
        data: {goodsID:goodsID,payType:payType,goodsStatus:goodsStatus,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/goodsManager/queryGoodsList'
      }).then(function successCallback(response){
        if(response.data.errorCode==0){
          $scope.editSuccess=false;

          if(response.data.data&&response.data.data.length>0){
            $scope.goodsList=response.data.data;
            angular.forEach( $scope.goodsList,function(value){
              if(value.protectPlanID==undefined){value.protectPlanID=' '}
              if(value.protectPlanName==undefined){value.protectPlanName=' '}
              if(value.priority==undefined){value.priority='1';}
              switch (value.goodsStatus){
                case "1":
                case 1:
                  value.goodsStatus='草稿';
                  value.goodsHandleL='灰度上架';
                  value.goodsHandleR='正式上架';
                  break;
                case "2":
                case 2:
                  value.goodsStatus='正式上架';
                  value.goodsHandleL='灰度上架';
                  value.goodsHandleR='下架';
                  break;
                case "3":
                case 3:
                  value.goodsStatus='灰度上架';
                  value.goodsHandleL='正式上架';
                  value.goodsHandleR='下架';
                  break;
                case "4":
                case 4:
                  value.goodsStatus='已下架';
                  value.goodsHandleL='灰度上架';
                  value.goodsHandleR='正式上架';
                  break;
              }
            });

          }
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取商品管理列表失败');
        }
      }, function errorCallback() {
        showError.showErrorMsg('获取商品管理列表失败--网络错误');
      });

    }
    list();
    $scope.demoSelect="";
    $scope.optionSelect=[
      "全部",
      "正式上架",
      "灰度上架",
      "已下架",
      "草稿"
    ];
    //商品排序
    $scope.sortText="编辑排序";
    $scope.canSort=true;
    $scope.sort=function(){
      $scope.canSort=false;
    };



    $scope.saveSort=function(){
      $http({
        method: 'post',
        data: {goodsSort: $scope.goodsList,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl + '/goodsManager/updatePriorityOfGoods'
      }).then(function successCallback(response) {
        if (response.data.errorCode == 0) {
          console.log('排序' + response.data.errorCode);
          $scope.sortText = '编辑排序';
          $scope.canSort = true;
          //list();
        } else {
          userAuth.isLogin(response.data);
          showError.showErrorMsg('商品排序失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('商品排序失败--网络错误');
      });
    };

    //删除商品
    $scope.delGoods=function(goodsID){

      $scope.modalGoodsShow=true;
      $scope.modalGooodsDel=true;
      $scope.delgoodsID=goodsID;
    };
    $scope.ensureDelGoods=function(){
      $http({
        method: 'post',
        data: {goodsID:$scope.delgoodsID,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/goodsManager/deleteGoods'
      }).then(function successCallback(response){
        console.log('删除商品'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.modalGoodsShow=false;
          $scope.modalGooodsDel=false;
          $scope.modalGoodsAlreadyDel=true;
          $timeout(function(){$scope.modalGoodsAlreadyDel=false},2000);
          $scope.goodsList.forEach(function(value,index){
            if(value.goodsID==$scope.delgoodsID){
              $scope.goodsList.splice(index,1);
              return false;
            }
          });
        }else if(response.data.errorCode==7013){
          $scope.modalGoodsShow=false;
          $scope.modalGooodsDel=false;
          $scope.modalGoodsDelFalse=true;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('删除商品失败');
        }
      }, function errorCallback() {
        showError.showErrorMsg('删除商品失败--网络错误');
      });
    };

    $scope.closePop=function(){
      $scope.modalGoodsDelFalse=false;
    };

    $scope.closemodalGoods=function(){
      $scope.modalGoodsCannotHandle=false;
      $scope.modalGoodsShow=false;
      $scope.modalGooodsDel=false;
      $scope.modalGoodsShow=false;
      $scope.modalGoodsL=false;
      $scope.modalGoodsR=false;
      $scope.modalGoodsCannotHandleO=false;
      $scope.modalGoodsCannotHandleT=false;
    };

    //编辑商品状态

    //-----------------！注意，页面直接传人good，然后直接修改goods 的值就可以。不用在做循环处理！！！
    $scope.handleL=function(goodsID,goodsName,goodsHandleL,Sstatus){
      $scope.goodsName=goodsName;
      $scope.goodsHandleL=goodsHandleL;
      $scope.Sstatus=Sstatus;
      var goodsHT;
      switch(goodsHandleL){
        case '草稿':
          goodsHT=1;break;
        case '正式上架':
          goodsHT=2;break;
        case '灰度上架':
          goodsHT=3;break;
        case '下架':
          goodsHT=4;break;
      }
      $scope.goodsHT=goodsHT;
      $scope.goodsID=goodsID;
      $scope.modalGoodsShow=true;
      $scope.modalGoodsL=true;
    };
    $scope.handleR=function(goodsID,goodsName,goodsHandleR,Sstatus){
      $scope.goodsName=goodsName;
      $scope.goodsHandleR=goodsHandleR;
      $scope.Sstatus=Sstatus;
      var goodsHT;
      switch(goodsHandleR){
        case '草稿':
          goodsHT=1;break;
        case '正式上架':
          goodsHT=2;break;
        case '灰度上架':
          goodsHT=3;break;
        case '下架':
          goodsHT=4;break;
      }
      $scope.goodsHT=goodsHT;
      $scope.goodsID=goodsID;
      $scope.modalGoodsShow=true;
      $scope.modalGoodsR=true;
    };

    $scope.ensureHandleGoods=function(){
      $scope.statusT='';
      $scope.uploadHandle=true;
      switch($scope.Sstatus){
        case '草稿':
          $scope.statusT=1;break;
        case '正式上架':
          $scope.statusT=2;break;
        case '灰度上架':
          $scope.statusT=3;break;
        case '已下架':
          $scope.statusT=4;break;
      }

      console.log('商品状态__________$scope.goodsID'+$scope.goodsID);
      console.log('商品状态__________$scope.Sstatus'+$scope.Sstatus);
      console.log('商品状态__________$scope.goodsHT'+$scope.goodsHT);

      $http({
        method: 'post',
        data: {goodsID:$scope.goodsID,goodsStatus:$scope.goodsHT,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/goodsManager/updateStatusOfGoods'
      }).then(function successCallback(response){
        console.log('编辑商品状态'+response.data.errorCode);
        $scope.uploadHandle=false;
        if(response.data.errorCode==0){

          $scope.editSuccess=true;
          $scope.modalGoodsShow=false;
          $scope.modalGoodsL=false;
          $scope.modalGoodsR=false;
          $scope.modalGoodsSuccess=true;

          $timeout(function(){$scope.modalGoodsSuccess=false},2000);

          $scope.goodsList.forEach(function(value){
            if(value.goodsID==$scope.goodsID){
              console.log("value______________start");
              console.log(value);
              var St=$scope.goodsHT;
              value.goodsStatus=St;
              console.log("$scope.goodsHT");
              console.log(St);
              switch (St){
                case "1":
                case 1:
                  value.goodsStatus='草稿';
                  value.goodsHandleL='灰度上架';
                  value.goodsHandleR='正式上架';
                  break;
                case "2":
                case 2:
                  value.goodsStatus='正式上架';
                  value.goodsHandleL='灰度上架';
                  value.goodsHandleR='下架';
                  break;
                case "3":
                case 3:
                  value.goodsStatus='灰度上架';
                  value.goodsHandleL='正式上架';
                  value.goodsHandleR='下架';
                  break;
                case "4":
                case 4:
                  value.goodsStatus='已下架';
                  value.goodsHandleL='灰度上架';
                  value.goodsHandleR='正式上架';
                  break;
              }
              console.log("value____________end");
              console.log(value);
              return false;
            }
          });



        }else if(response.data.errorCode==7014){
          $scope.modalGoodsShow=false;
          $scope.modalGoodsL=false;
          $scope.modalGoodsR=false;
          $scope.modalGoodsShow=true;
          $scope.modalGoodsCannotHandle=true;
        }else if(response.data.errorCode==7024){
          $scope.modalGoodsShow=false;
          $scope.modalGoodsL=false;
          $scope.modalGoodsR=false;
          $scope.modalGoodsShow=true;
          $scope.modalGoodsCannotHandleO=true;
        }else if(response.data.errorCode==7025){
          $scope.modalGoodsShow=false;
          $scope.modalGoodsL=false;
          $scope.modalGoodsR=false;
          $scope.modalGoodsShow=true;
          $scope.modalGoodsCannotHandleT=true;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('编辑商品状态失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('编辑商品状态--网络错误');
      });
    };


    $scope.showTip=function(){
      $scope.mouse=true;
    };
    $scope.hideTip=function(){
      $scope.mouse=false;
    };

  });
