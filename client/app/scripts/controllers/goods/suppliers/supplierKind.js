
app
  .controller('SupplierKindCtrl', function ($scope, $http,$routeParams,$rootScope, $timeout,serverUrl,showError,userAuth,$location) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.hasError=false;
      $scope.closeError=function(){
        $scope.hasError=false;
      };
    var supplierID=$routeParams.id;
    $scope.supplierID=supplierID;
    $scope.ticket=$routeParams.ticket;
    $scope.domain=$routeParams.domain;
		$rootScope.ticket=$routeParams.ticket || $rootScope.ticket;
    $rootScope.domain=$routeParams.domain || $rootScope.domain;
    $scope.goTo=function(add){
      $location.path(add);
    };

    $scope.closeModalBox=function(){
      $scope.kindModalBox=false;
      $scope.kindModalInsert=false;
      $scope.kindModal=false;
      $scope.kindModalDel=false;
    };


    function getSupplier(supplierID,status){
      $http({
        method: 'post',
        data: {supplierID:supplierID,status:status,ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/supplierManager/querySupplierList'
      }).then(function successCallback(response) {
        //console.log(response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.supplier = response.data.data[0];
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取供应商信息失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取供应商信息失败--网络连接错误');
      });
    }
    getSupplier($scope.supplierID,'N');

    $scope.list=function(){
      $http({
        method: 'post',
        data: {supplierID:$scope.supplierID,ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/supplierManager/querySupplierKind'
      }).then(function successCallback(response) {
        if(response.data.errorCode==0){
          $scope.kinds = response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取险种列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取险种列表失败--网络连接错误');
      });
    };
    $scope.list();

    //编辑险种
   $scope.editKind=function(supplierID,kindName,supplierKindID,kindID,supplierKindCode){
     $scope.supplierID=supplierID;
     $scope.kindName=kindName;
     $scope.supplierKindID=supplierKindID;
     $scope.kindID=kindID;
     $scope.editSupplierKindCode=supplierKindCode;
     $scope.kindModalBox=true;
     $scope.kindModal=true;
     $scope.supplierKindNameNull=false;
     $scope.modalAlreadyHas=false;
     $scope.modalAlreadyExit=false;
     $scope.supplierKindNull=false;
     //console.log('5454545');
     //console.log($scope.editSupplierKindCode);
   };

    $scope.ensureSaveKind=function(){
      if($scope.editSupplierKindCode==""){
        $scope.supplierKindNameNull=true;
      }
      console.log('supplierKindID'+$scope.supplierKindID);
      console.log('supplierID'+$scope.supplierID);
      console.log('kindID'+$scope.kindID);
      console.log('supplierKindCode'+$scope.supplierKindCode);
      $http({
        method: 'post',
        data: {supplierKindID:$scope.supplierKindID,supplierID:$scope.supplierID,kindID:$scope.kindID,supplierKindCode:$scope.editSupplierKindCode,ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/supplierManager/updateSupplierKind'
      }).then(function successCallback(response) {
        console.log(response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.kindModalBox=false;
          $scope.kindModal=false;
          $scope.modalAlreadySave=true;
          $timeout(function(){$scope.modalAlreadySave=false;},2000);
          $scope.list();
        }else if(response.data.errorCode==7006){
          $scope.modalAlreadyExit=true;
        }
        else if(response.data.errorCode==7007){
          $scope.modalAlreadyHas=true;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('保存险种失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('保存险种失败--网络连接错误');
      });
    };

      $scope.enterName=function(){
        $scope.modalAlreadyExit=false;
        $scope.modalAlreadyHas=false;
        $scope.supplierKindNameNull=false;
        $scope.supplierKindNull=false;
      };
    //平台险种--下拉列表
    function getAllKind(){
      $http({
        method: 'post',
        data: {ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/supplierManager/queryAllKind'
      }).then(function successCallback(response) {
        if(response.data.errorCode==0){
          $scope.allKind = response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取平台险种列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取平台险种列表失败--网络错误');
      });
    }
    getAllKind();

      //添加险种代码弹出框
    $scope.addNewKind=function(supplierID){
      $scope.supplierID=supplierID;
      //$scope.kindModalBox=true;
      $scope.kindModalInsert=true;
      $scope.supplierKindNameNull=false;
      $scope.supplierKindNull=false;
      //清空
      $scope.modalAlreadyRepExit=false;
      $scope.modalAlreadyRepHas=false;
      $scope.supplierKindNull=false;
      $scope.supplierKindNameNull=false;
      $scope.modalAlreadyExit=false;
      $scope.modalAlreadyHas=false;
      $scope.kindID='';
      $scope.supplierKindCode='';
    };

//添加险种代码
    $scope.insertKind=function(){
      if($scope.kindID==undefined||$scope.kindID==""){
        $scope.supplierKindNull=true;
      }else if($scope.supplierKindCode==undefined||$scope.supplierKindCode==""){
        $scope.supplierKindNameNull=true;
      }
      $http({
        method: 'post',
        data: {supplierID:$scope.supplierID,kindID:$scope.kindID,supplierKindCode:$scope.supplierKindCode,ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/supplierManager/insertSupplierKind'
      }).then(function successCallback(response) {
        console.log(response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.kindModalBox=false;
          $scope.kindModalInsert=false;
          $scope.supplierKindNameNull=false;
          $scope.supplierKindNull=false;
          $scope.list();
        }else if(response.data.errorCode==7006){
          $scope.modalAlreadyExit=true;
        }
        else if(response.data.errorCode==7007){
          $scope.modalAlreadyHas=true;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('添加险种失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('添加险种失败--网络连接错误');
      });
    };

    $scope.delKind=function(supplierKindID){
        $scope.supplierKindID=supplierKindID;
        $scope.kindModalBox=true;
        $scope.kindModalDel=true;
    };
    $scope.ensureDelKind=function(){
      $http({
        method: 'post',
        data: {supplierKindID:$scope.supplierKindID,ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/supplierManager/deleteSupplierKind'
      }).then(function successCallback(response) {
        console.log($scope.supplierKindID);
        if(response.data.errorCode==0){
          $scope.kindModalBox=false;
          $scope.kindModalDel=false;
          $scope.list();
          $scope.modalAlreadyDel=true;
          $timeout(function(){$scope.modalAlreadyDel=false;},500);
        }else{
          userAuth.isLogin(response.data);
          $scope.kindModalBox=false;
          $scope.kindModalDel=false;
          showError.showErrorMsg("删除险种失败");
        }
      }, function errorCallback(response) {
        $scope.kindModalBox=false;
        $scope.kindModalDel=false;
        showError.showErrorMsg("删除险种失败-网络连接失败");
      });
    }



  });

