/**
 * Created by Administrator on 2015/12/7.
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
  .controller('SupplierAndGoodsCtrl', function ($scope, $http, $location,$rootScope,$timeout,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.hasError=false;
    $scope.closeError=function(){
      $scope.hasError=false;
    };

    $rootScope.ticket=$location.$$search.ticket || $rootScope.ticket;
    $rootScope.domain=$location.$$search.domain || $rootScope.domain;

    $scope.goTo=function(add){
      $location.path(add);
    };

    $scope.closeModalBox=function(){
      $scope.delSupplierModal=false;
      $scope.supplierModalBox=false;
      $scope.delSupplierFalseModal=false;
    };

    if($scope.selName==undefined){$scope.selName="所有城市"}
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

    //获取城市列表
    $scope.cityList=function(cityID,status){
      $http({
        method: 'post',
        data: {cityID:cityID,status:status,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/cityManager/queryCity'
      }).then(function successCallback(response) {
        //console.log('城市'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.citys = response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取城市列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取城市列表失败--网络错误');
      });
    };
    $scope.cityList('','N');

    //获取供应商列表
    $scope.supplierList=function(supplierID,status){
      $http({
        method: 'post',
        data: {supplierID:supplierID,status:status,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/supplierManager/querySupplierList'
      }).then(function successCallback(response) {
        //console.log('供应商'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.suppliers = response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取供应商列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取供应商列表失败--网络错误');
      });
    };
    $scope.supplierList('','N');

    ////显示城市选择框
    //  $scope.cityDiv=document.getElementById('citySelect');
    //  $scope.showCitySelect=function(){
    //    $scope.cityNull=false;
    //    if($scope.cityDiv.style.display=="none"){
    //      $scope.cityDiv.style.display="block";
    //    }else{
    //      $scope.cityDiv.style.display="none";
    //    }
    //    var len=$scope.citys.length;
    //    var cityArr=[];
    //    var str="";
    //    for(var i=0;i<len;i++){
    //      cityArr.push($scope.citys[i].cityName);
    //    }
    //    str="<ul><li><a>所有城市</a></li><li><a>"+cityArr.join("</a></li><li><a>")+"</li></ul>";
    //    $scope.cityDiv.innerHTML=str;
    //  };
    //  $scope.cityDiv.onclick=function(){
    //    $scope.selCity=false;
    //    var e = event ? event : window.event;
    //    var src = e.target || window.event.srcElement;
    //    if(src.toString()=="") {
    //      var len = $scope.citys.length;
    //      $scope.selName = src.innerHTML;
    //      for (var i = 0; i < len; i++) {
    //        if (src.innerHTML == "所有城市") {
    //          $scope.cityID = "";
    //          $scope.cityDiv.style.display = "none";
    //        } else {
    //          if ($scope.citys[i].cityName == src.innerHTML) {
    //            $scope.cityID = $scope.citys[i].cityID;
    //            $scope.cityDiv.style.display = "none";
    //          }
    //        }
    //      }
    //      $timeout(function () {
    //        $scope.caca = $scope.selName;
    //      }, 10);
    //    }
    //  };
    //


    //按照关系查询
    $scope.termsSearch=function(){
      $http({
        method: 'post',
        data: {goodsTypeID:$scope.goodsTypeID,cityID:$scope.cityID,supplierID:$scope.supplierID,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/supplierRelationManager/queryRelationOfGoodsTypeAndSupplier'
      }).then(function successCallback(response) {
        console.log('关系查找'+response.data.errorCode);
        console.log(response.data.data);
        if(response.data.errorCode == 0){
          
          $scope.searchResult= response.data.data;
          $scope.searchResult.forEach(function(value){
	        if(value.email==undefined||value.email==""){value.email=' ';}
	        if(value.contactName==undefined||value.contactName==""){value.contactName=' ';}
	        if(value.contactPhone==undefined||value.contactPhone==""){value.contactPhone=' ';}
            if(value.share==undefined){value.share='1';}
            //如果当前的产品与供应商显示的列表中quoteMode或者insuredMode没有值就各自默认为1
            if(value.quoteMode==undefined){value.quoteMode='1';}
            if(value.insuredMode==undefined){value.insuredMode='1';}
          });
          $scope.searchResult= response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('查找产品与供应商关系失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('查找产品与供应商关系失败--网络错误');
      });
    };
    $scope.termsSearch();

      //判断产品与供应商关系在'商品管理'中是否有维护
      $scope.isRelated=function(){
        $http({
          method: 'post',
          data: {goodsTypeCitySupplierRelID:$scope.SgoodsTypeCitySupplierRelID,ticket:$rootScope.ticket,domain:$rootScope.domain},
          url: serverUrl+'/supplierRelationManager/checkRelationOfGoodsTypeAndSupplier'
        }).then(function successCallback(response) {
          console.log('判断是否有维护'+response.data.errorCode);
          console.log('---'+$scope.SgoodsTypeCitySupplierRelID);
          if(response.data.errorCode == 0){
            console.log(response.data.data);
            $scope.isRelatedTag=response.data.data;
            console.log($scope.isRelatedTag);
            if($scope.isRelatedTag=='Y'){
              $scope.delSupplierFalseModal=true;
            }else{
              $scope.delSupplierModal=true;
            }
          }else{
            userAuth.isLogin(response.data);
            showError.showErrorMsg('获取维护关系失败');
          }
        }, function errorCallback(response) {
          showError.showErrorMsg('获取维护关系失败--网络错误');
        });
      };

    //删除产品与供应商关系
    $scope.delSuppAGoods=function(goodsTypeCitySupplierRelID){
      $scope.SgoodsTypeCitySupplierRelID=goodsTypeCitySupplierRelID;
      console.log( $scope.SgoodsTypeCitySupplierRelID);
       $scope.isRelated();
    };

    //删除产品与供应商关系
    $scope.ensureDelSupplier=function(){
      $http({
        method: 'post',
        data: {goodsTypeCitySupplierRelID:$scope.SgoodsTypeCitySupplierRelID,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/supplierRelationManager/deleteRelationOfGoodsTypeAndSupplier'
      }).then(function successCallback(response) {
        console.log('删除'+response.data.errorCode);
        if(response.data.errorCode == 0){
            $scope.supplierModalBox=false;
            $scope.delSupplierModal=false;
            $scope.supplierAlreadyDel=true;
          $scope.delSupplierFalseModal=false;
            $timeout(function(){$scope.supplierAlreadyDel=false},2000);
            $scope.termsSearch();
        }else{
          userAuth.isLogin(response.data);
          $scope.supplierModalBox=false;
          $scope.delSupplierModal=false;
          showError.showErrorMsg('删除产品与供应商关系失败');
        }
      }, function errorCallback(response) {
        $scope.supplierModalBox=false;
        $scope.delSupplierModal=false;
        showError.showErrorMsg('删除产品与供应商关系失败--网络错误');
      });
    };

    //编辑供应商份额
    //$scope.setShare=function(goodsTypeCitySupplierRelID){
    //  $scope.goodsTypeCitySupplierRelID=goodsTypeCitySupplierRelID;
    //}
    $scope.forbidEditShare=true;
    $scope.canShare=function(){
      $scope.forbidEditShare=false;
    };
      $scope.shareInt=true;
    $scope.saveSort=function(){
      var relList=[];
      var canSort=true;
      $scope.searchResult.forEach(function(value){
        $scope.goodsTypeCitySupplierRelID=value.goodsTypeCitySupplierRelID;
        if(/^[1-9]?$/.test(value.share)){
          $scope.share=value.share;
          relList.push({goodsTypeCitySupplierRelID:$scope.goodsTypeCitySupplierRelID,share:$scope.share});
        }else{
          canSort=false;
          $scope.shareInt=false;
        }
      });
      if(canSort){
        console.log(relList);
        $http({
          method: 'post',
          data: {relList:relList,ticket:$rootScope.ticket,domain:$rootScope.domain},
          url: serverUrl+'/supplierRelationManager/editShareOfSupplier'
        }).then(function successCallback(response) {
          console.log('编辑份额'+response.data.errorCode);
          if(response.data.errorCode == 0){
            $scope.forbidEditShare=true;
            $scope.shareInt=true;
          }else{
            userAuth.isLogin(response.data);
            showError.showErrorMsg('编辑供应商份额失败');
          }
        }, function errorCallback(response) {
          showError.showErrorMsg('编辑供应商份额失败--网络错误');
        });
      }
    }

  });

