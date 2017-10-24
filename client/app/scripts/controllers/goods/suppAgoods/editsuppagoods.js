/**
 * Created by Administrator on 2015/12/7.
 */

app
  .controller('EditSupplierAndGoodsCtrl', function ($scope, $routeParams, $rootScope,$http, $timeout,$location,serverUrl,showError,userAuth) {
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

    $scope.goodsTypeID=$routeParams.goodsTypeID;
    $scope.cityID=$routeParams.cityID;
    $scope.quoteMode=$routeParams.quoteMode;
    $scope.insuredMode=$routeParams.insuredMode;
    
    $scope.contactName=$routeParams.contactName;
    $scope.contactPhone=$routeParams.contactPhone;
    $scope.email=$routeParams.email;
    $scope.supplierID=$routeParams.supplierID;
    $scope.goodsTypeCitySupplierRelID=$routeParams.goodsTypeCitySupplierRelID;
    $scope.ticket=$rootScope.ticket;
    $scope.domain=$rootScope.domain;

    //获取编辑条目相关信息显示在页面
    $scope.termsSearch=function(){
      $http({
        method: 'post',
        data: {goodsTypeID:$scope.goodsTypeID,cityID:$scope.cityID,supplierID:$scope.supplierID,ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/supplierRelationManager/queryRelationOfGoodsTypeAndSupplier'
      }).then(function successCallback(response) {
        console.log('关系查找'+response.data.errorCode);
        if(response.data.errorCode == 0){
          $scope.searchResult= response.data.data[0];
          $scope.quoteMode=$scope.searchResult.quoteMode;
          $scope.insuredMode=$scope.searchResult.insuredMode;
          $scope.contactName=$scope.searchResult.contactName;
          $scope.contactPhone=$scope.searchResult.contactPhone;
          $scope.email=$scope.searchResult.email;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('查询产品与供应商关系失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('查询产品与供应商关系失败--网络错误');
      });
    };
    $scope.termsSearch();

	//判断必填项是否已经填写完成
    $scope.canAddSupplier=function () {
      $scope.canAdd = true;
      $scope.quoteModeNull= false;
      $scope.insuredModeNull= false;
      if($scope.quoteMode ==undefined || $scope.quoteMode ==""){
      	$scope.quoteModeNull= true;
        $scope.canAdd = false;
      }else if($scope.insuredMode ==undefined || $scope.insuredMode ==""){
      	$scope.insuredModeNull= true;
        $scope.canAdd = false;
      }
    };

    ////编辑产品与供应商关系
    $scope.editSuppagoods=function(){
      $scope.canAddSupplier();
      $scope.judge();
      if(($scope.canAdd == true)&&$scope.isContactPhone&&$scope.isEmail) {
        $http({
          method: 'post',
          data: {
            goodsTypeCitySupplierRelID: $scope.goodsTypeCitySupplierRelID,
            quoteMode: $scope.quoteMode,
            insuredMode: $scope.insuredMode,
            contactName: $scope.contactName,
            contactPhone: $scope.contactPhone,
            email: $scope.email,
            ticket:$scope.ticket,domain:$scope.domain
          },
          url: serverUrl + '/supplierRelationManager/updateRelationOfGoodsTypeAndSupplier'
        }).then(function successCallback(response) {
          console.log('编辑关系' + response.data.errorCode);
          if (response.data.errorCode == 0) {
            $scope.supplierAlreadySaved = true;
            $timeout(function () {
              $scope.supplierAlreadySaved = false
            }, 2000);
            $location.path('/suppagoods');
          } else if (response.data.errorCode == 7008) {
            $scope.suppAGoodsRepeat = true;
          } else {
            userAuth.isLogin(response.data);
            showError.showErrorMsg('编辑产品与供应商关系失败');
          }
        }, function errorCallback(response) {
          showError.showErrorMsg('编辑产品与供应商关系失败--网络错误');
        });
      }
    };

      $scope.closePop=function(){
        $scope.suppAGoodsRepeat=false;
      };

      //获取焦点
      $scope.change=function(){
      	$scope.quoteModeNull= false;
        $scope.insuredModeNull= false;
        $scope.isContactPhone=true;
        $scope.isEmail=true;
      };
      //电话、email输入验证
      $scope.isContactPhone=true;
      $scope.isEmail=true;
      $scope.judge=function(){
        $scope.isContactPhone=true;
        $scope.isEmail=true;
        var reg=/[0-9]{5,}/;
        var emialReg=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if($scope.contactPhone){
          if($scope.contactPhone.length!=0){
            if(($scope.contactPhone!=undefined)&&($scope.contactPhone!='')){
              $scope.isContactPhone=reg.test($scope.contactPhone);
            }
          }
        }
        if($scope.email){
          if($scope.email.length!=0){
            if(($scope.email!=undefined)&&($scope.email!='')){
              $scope.isEmail=emialReg.test($scope.email);
            }
          }
        }

      }

  });

