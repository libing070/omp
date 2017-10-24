/**
 * Created by Administrator on 2015/12/7.
 */
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
  .controller('AddSupplierAndGoodsCtrl', function ($scope, $http, $timeout,$routeParams,$location,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
$scope.hasError=false;
    $scope.closeError=function(){
      $scope.hasError=false;
    };
      $scope.hasError=false;

    $scope.ticket=$routeParams.ticket;
    $scope.domain=$routeParams.domain;

    $scope.goTo=function(add){
      $location.path(add);
    };

    if($scope.selName==undefined){$scope.selName="请选择"}

    //获取产品线列表
    $scope.lineList=function(){
      $http({
        method: 'post',
        data: {ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/supplierRelationManager/queryAllGoodsType'
      }).then(function successCallback(response) {
        console.log('产品线'+response.data.errorCode);
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
        data: {cityID:cityID,status:status,ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/cityManager/queryCity'
      }).then(function successCallback(response) {
        console.log('城市'+response.data.errorCode);
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
        data: {supplierID:supplierID,status:status,ticket:$scope.ticket,domain:$scope.domain},
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

    //显示城市选择框
    $timeout(function(){
      $scope.cityDiv=document.getElementById('citySelect');
      $scope.showCitySelect=function(){
        $scope.cityDivShow=true;
        $scope.cityNull=false;
        $scope.cityDiv.style.display="block";
        //if($scope.cityDiv.style.display=="none"){
        //  $scope.cityDiv.style.display="block";
        //}else{
        //  $scope.cityDiv.style.display="none";
        //}
        var len=$scope.citys.length;
        var cityArr=[];
        for(var i=0;i<len;i++){
          cityArr.push($scope.citys[i].cityName);
        }
        var str="<ul><li><a>"+cityArr.join("</a></li><li><a>")+"</li></ul>";
        $scope.cityDiv.innerHTML=str;

        function closeCitySel(){
          if($scope.cityDivShow){
            document.onclick=function(){
              var e = event ? event : window.event;
              var src = e.target || window.event.srcElement;
              if((src.id!="citySelect")&&(src.id!="citySel")){
                if($scope.cityDiv.style.display=="block"){
                  $scope.cityDiv.style.display="none";
                }
              }
            }
          }
        }
        closeCitySel();
      };
      $scope.cityDiv.onclick=function(){
        $scope.selCity=false;
        var e = event ? event : window.event;
        var src = e.target || window.event.srcElement;
        if(src.toString()=="") {
          var len = $scope.citys.length;
          $scope.selName = src.innerHTML;
          for (var i = 0; i < len; i++) {
            if ($scope.citys[i].cityName == src.innerHTML) {
                $scope.cityID = $scope.citys[i].cityID;
                $scope.cityDiv.style.display = "none";
              }
            }
          }
          $timeout(function () {
            $scope.caca = $scope.selName;
          }, 10);
        }
      },500);


    //判断必填项是否已经填写完成
    $scope.canAddSupplier=function () {
      $scope.canAdd = true;
      $scope.lineNull =false;
      $scope.cityNull =false;
      $scope.supNull =false;
      $scope.quoteModeNull= false;
      $scope.insuredModeNull= false;
      if($scope.goodsTypeID == undefined || $scope.goodsTypeID == "") {
        $scope.lineNull = true;
        $scope.canAdd = false;
      }
      else if ($scope.cityID == undefined || $scope.cityID == "") {
        $scope.cityNull = true;
        $scope.canAdd = false;
      }
      else if ($scope.supplierID ==undefined || $scope.supplierID =="") {
        $scope.supNull= true;
        $scope.canAdd = false;
      }else if($scope.quoteMode ==undefined || $scope.quoteMode ==""){
      	$scope.quoteModeNull= true;
        $scope.canAdd = false;
      }else if($scope.insuredMode ==undefined || $scope.insuredMode ==""){
      	$scope.insuredModeNull= true;
        $scope.canAdd = false;
      }
    };
    //获取焦点
    $scope.change=function(){
      $scope.lineNull = false;
      $scope.cityNull = false;
      $scope.supNull = false;
      $scope.quoteModeNull= false;
      $scope.insuredModeNull= false;
      $scope.isContactPhone=true;
      $scope.isEmail=true;
    };
    //新增产品与供应商关系
    $scope.addSuppAGoods=function(){
      $scope.canAddSupplier();
      $scope.judge();
      if(($scope.canAdd == true)&&$scope.isContactPhone&&$scope.isEmail){
        $http({
          method: 'post',
          data: {goodsTypeID:$scope.goodsTypeID,cityID:$scope.cityID,supplierID:$scope.supplierID,quoteMode:$scope.quoteMode,insuredMode:$scope.insuredMode,contactName:$scope.contactName,contactPhone:$scope.contactPhone,email:$scope.email,ticket:$scope.ticket,domain:$scope.domain},
          url: serverUrl+'/supplierRelationManager/insertRelationOfGoodsTypeAndSupplier'
        }).then(function successCallback(response) {
          console.log('新增关系'+response.data.errorCode);
          if(response.data.errorCode==0){
            $scope.rel= response.data.data;
            console.log($scope.rel);
            $scope.suppAGoodsSaved=true;
            $location.path('/suppagoods');
            $timeout(function(){$scope.suppAGoodsSaved=false},2000);
          }else if(response.data.errorCode==7008){
            $scope.suppAGoodsRepeat=true;
          }else{
            userAuth.isLogin(response.data);
            showError.showErrorMsg('新增产品与供应商关系失败');
          }
        }, function errorCallback(response) {
          showError.showErrorMsg('新增产品与供应商关系失败--网络错误');
        });
      }

    };

$scope.closePop=function(){
 $scope.suppAGoodsRepeat=false;
};

      //电话、email输入验证
      $scope.isContactPhone=true;
      $scope.isEmail=true;
      $scope.judge=function(){
        $scope.isContactPhone=true;
        $scope.isEmail=true;
        var reg=/[0-9]{5,}/;
        var emialReg=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if(($scope.contactPhone!=undefined)&&($scope.contactPhone!="")){
          $scope.isContactPhone=reg.test($scope.contactPhone);
        }
        if(($scope.email!=undefined)&&($scope.email!="")){
          $scope.isEmail=emialReg.test($scope.email);
        }
      }






})
