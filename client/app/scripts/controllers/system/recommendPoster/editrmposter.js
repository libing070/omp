/**
 * Created by Administrator on 2015/12/9.
 */

app
  .controller('EditrmposterCtrl', function ($scope, $rootScope,$routeParams,$http, $timeout,$location,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 BoilerplateE',
      'AngularJS',
      'Karma'
    ];
     // .when('/editrmposter/:recommendID/:recommendName/:recommendType/:valueName/:valueID', {

      $scope.hasError=false;
      $scope.closeError=function(){
        $scope.hasError=false;
      };
    $rootScope.ticket=$routeParams.ticket;
    $rootScope.domain=$routeParams.domain;
    console.log($rootScope.ticket);
    console.log($rootScope.domain);

    $scope.goTo=function(add){
      $location.path(add);
    };

    var recommendID=$routeParams.recommendID;
    $scope.recommendID=recommendID;
    var recommendName=$routeParams.recommendName;
    $scope.recommendName=recommendName;
    var recommendType=$routeParams.recommendType;
    $scope.recommendType=recommendType;
    $scope.recommendCopy=$routeParams.recommendType;
      if($scope.recommendType==2){
        $scope.recommendTypeName='活动';
        $scope.AleadySelGoods=false;
      }else if($scope.recommendType==1){
        $scope.recommendTypeName='商品';
        $scope.AleadySelGoods=true;
      }
    $scope.valueID	=$routeParams.valueID;
    $scope.valueIDCopy=$routeParams.valueID;
    $scope.valueName=$routeParams.valueName;
    $scope.valueNameACopy=$routeParams.valueName;
    $scope.valueIDNull=false;

      //获取商品编号
      $scope.getGoodNumber=function(){
        if($scope.recommendType==1){
          $http({
            method: 'post',
            data: {goodsID:$scope.valueID,ticket:$rootScope.ticket,domain:$rootScope.domain},
            url: serverUrl+'/goodsManager/queryGoodsList'
          }).then(function successCallback(response){
            console.log('查询商品名称'+response.data.errorCode);
            if(response.data.errorCode==0){
              $scope.goodList=response.data.data[0];
              if($scope.goodList){
                $scope.valueName=$scope.goodList.goodsCustomNumber+"    "+$scope.goodList.goodsName;
                $scope.valueNameCopy=$scope.goodList.goodsCustomNumber+"    "+$scope.goodList.goodsName;
              }
              //console.log($scope.goodsList);
            }else{
              userAuth.isLogin(response.data);
              showError.showErrorMsg('获取商品名称失败');
            }
          }, function errorCallback(response) {
            showError.showErrorMsg('获取商品名称失败--网络错误');
          });
        }

      };
      $scope.getGoodNumber();
    //获取目标活动列表
    function getActivityList(){
      $http({
        method: 'post',
        data: {ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/systemManager/queryActivityList'
      }).then(function successCallback(response){
        console.log('获取目标活动列表'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.activityList=[];
          angular.forEach(response.data.data,function(value){
            if(value.activityName==$scope.valueName){
              //console.log('true--');
              value.isSel=true;
            }
            $scope.activityList.push(value);
          });
          //$scope.activityList=response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取目标活动列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取目标活动列表失败--网络错误');
      });
    }

    //获取商品列表
    function getGoodsList(){
      $http({
        method: 'post',
        data: {goodsStatus:"2",ticket:$rootScope.ticket,domain:$rootScope.domain},//商品必须为上架状态
        url: serverUrl+'/goodsManager/queryGoodsList'
      }).then(function successCallback(response){
        console.log('获取商品列表'+response.data.errorCode);
        if(response.data.errorCode==0){
          //console.log($scope.valueName);
          $scope.goodsList=[];
          angular.forEach(response.data.data,function(value){
            if(value.goodsCustomNumber+"    "+value.goodsName==$scope.valueName){
              //console.log('true---');
              value.isSel=true;
            }
            $scope.goodsList.push(value);
          });
          //$scope.goodsList=response.data.data;
          //console.log($scope.goodsList);
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取目标商品列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取目标商品列表失败--网络错误');
      });
    }


    //关闭选择模态框
    $scope.closePoster=function(){
      $scope.modalSelectActivity=false;
      $scope.modalSelectGoods=false;
      $scope.modalShow=false;
      $scope.activityPicNull=false;
    };

    //选择活动或者商品
    $scope.selectType=function(){
      $scope.valueIDNull=false;
      $scope.hided=false;
      //console.log($scope.selType);
      //console.log($scope.recommendType);
      $scope.AleadySelGoods=$scope.selType=='商品'?true:false;
      if($scope.recommendCopy==1){
        if($scope.selType=="活动"){
          $scope.valueName="";
          $scope.valueID='';
        }else{
          $scope.valueName=$scope.valueNameCopy;
          $scope.valueID=$scope.valueIDCopy;
          //console.log($scope.valueName);
        }
      }else if($scope.recommendCopy==2){
        if($scope.selType=="商品"){
          $scope.valueName="";
          $scope.valueID='';
        }else{
          $scope.valueName=$scope.valueNameACopy;
          $scope.valueID=$scope.valueIDCopy;
        }
      }
    };

      $scope.showSelGoods=function(){
        $scope.AleadySelGoods=true;
        $scope.modalSelectActivity=false;
        $scope.modalSelectGoods=true;
        $scope.valueIDNull=false;
        $scope.formDataa.goodsID="";
        getGoodsList();
      };
      $scope.showSelActivity=function(){
        $scope.AleadySelGoods=false;
        $scope.modalSelectGoods=false;
        $scope.modalSelectActivity=true;
        $scope.valueIDNull=false;
        $scope.formData.activityID="";
        getActivityList();
      };
      //选择商品
      $scope.formDataa={};
      $scope.selGoods=function(){
        if($scope.recommendCopy==1){
          $scope.selGoodsID=$scope.formDataa.goodsID||$scope.valueIDCopy;
        }else{
          $scope.selGoodsID=$scope.formDataa.goodsID;
        }
       if(($scope.selGoodsID!=undefined)&&($scope.selGoodsID!="")){
          $scope.recommendType=1;
          $http({
            method: 'post',
            data: {goodsID:$scope.selGoodsID,ticket:$rootScope.ticket,domain:$rootScope.domain},
            url: serverUrl+'/goodsManager/queryGoodsList'
          }).then(function successCallback(response){
            console.log('查询商品名称'+response.data.errorCode);
            if(response.data.errorCode==0){
              $scope.goodList=response.data.data[0];
              if($scope.goodList){
                $scope.valueName=$scope.goodList.goodsCustomNumber+"    "+$scope.goodList.goodsName;
              }
            }else{
              userAuth.isLogin(response.data);
              showError.showErrorMsg('获取商品名称失败');
            }
          }, function errorCallback(response) {
            showError.showErrorMsg('获取商品名称失败--网络错误');
          });
        }else{
        //  console.log('sel undefined');
        //  console.log($scope.recommendType);
        //  $scope.cancelSel();
        }
      };

      // 选择活动
    $scope.canAddActivity=true;
      $scope.formData={};
      $scope.selActivity=function(){
        if($scope.recommendCopy==2){
          $scope.selActivityID=$scope.formData.activityID||$scope.valueIDCopy;
        }else{
          $scope.selActivityID=$scope.formData.activityID;
        }
        if($scope.selActivityID!=undefined){
          $scope.recommendType=2;
        $http({
          method: 'post',
          data: {activityID:$scope.selActivityID,ticket:$rootScope.ticket,domain:$rootScope.domain},
          url: serverUrl+'/systemManager/queryActivityName'
        }).then(function successCallback(response){
          console.log('查询活动名称'+response.data.errorCode);
          if(response.data.errorCode==0){
            $scope.valueName=response.data.data.activityName;
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
        }
      };

      //判断必填项是否已经填写
      $scope.canEditR=true;
      $scope.judgeEdit=function(){
        if($scope.recommendName==undefined||$scope.recommendName==""){
          $scope.recommendNameNull=true;
          $scope.canEditR=false;
        }
        if($scope.valueID==''){
          $scope.valueIDNull=true;
          $scope.canEditR=false;
        }
      };
//获得焦点
      $scope.changeName=function(){
        $scope.recommendNameNull=false;
      };
    //编辑推荐区海报
    $scope.editPoster=function(){
      if($scope.recommendType==2){
        $scope.valueID=$scope.selActivityID||$scope.valueID;
      }
      if($scope.recommendType==1){
        $scope.valueID=$scope.selGoodsID||$scope.valueID;
      }
      $scope.judgeEdit();
      //console.log('1-1-1-1-1-1:');
      //console.log('recommendID:'+$scope.recommendID);
      //console.log('recommendName:'+$scope.recommendName);
      //console.log('recommendType:'+$scope.recommendType);
      //console.log('valueID:'+$scope.valueID);
      if($scope.canEditR==true){
        if($scope.canAddActivity==true){
          $http({
            method: 'post',
            data: {recommendID:$scope.recommendID,recommendName:$scope.recommendName,
              recommendType:$scope.recommendType,valueID:$scope.valueID,ticket:$rootScope.ticket,domain:$rootScope.domain},
            url: serverUrl+'/systemManager/updateRecommend'
          }).then(function successCallback(response){
            console.log('编辑推荐区海报'+response.data.errorCode);
            if(response.data.errorCode==0){
              $scope.modalAlreadySave=true;
              $timeout(function(){$scope.modalAlreadySave=false;},2000);
              $location.path('/rmposter/');
            }else{
              userAuth.isLogin(response.data);
              showError.showErrorMsg('编辑推荐区海报失败');
            }
          }, function errorCallback(response) {
            showError.showErrorMsg('编辑推荐区海报失败--网络错误');
          });
        }else{
          $scope.activityPicNull=true;
        }

      }
    };


  });

