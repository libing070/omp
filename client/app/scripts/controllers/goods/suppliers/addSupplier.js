//
//app
//  .controller('AddSupplierCtrl', function ($scope, $http, $timeout,serverUrl,showError) {
//    this.awesomeThings = [
//      'HTML5 Boilerplate',
//      'AngularJS',
//      'Karma'
//    ];
//
//
//
//  });


app
  .controller('AddSupplierCtrl', function ($scope, $http, $routeParams,$timeout,$location,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  $scope.ticket=$routeParams.ticket;
  $scope.domain=$routeParams.domain;

    $scope.goTo=function(add){
      $location.path(add);
    };

    $scope.hasError=false;
      $scope.closeError=function(){
        $scope.hasError=false;
      };

    $scope.dates = {
      today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
      minDate: moment("2015-12-06 12:13:24")
    };

    $scope.$watch('dates.cooperationStartTime', function() {
      $scope.dates.minDate = $scope.dates.cooperationStartTime || moment("");
      $scope.$broadcast('pickerUpdate', ['cooperationEndTime'], {
        minDate: $scope.dates.minDate,
      });

    });
    $scope.$watch('dates.cooperationEndTime', function() {
      $scope.dates.maxDate = $scope.dates.cooperationEndTime || moment("");
      $scope.$broadcast('pickerUpdate', ['cooperationStartTime'], {
        maxDate: $scope.dates.maxDate,
      });
    });

    $scope.nameNull = false;
    $scope.cnameNull = false;
    $scope.telNull = false;
    $scope.ctelNull = false;



    //判断必选项是否已填
    $scope.canAddSupplier=function () {
      $scope.canAdd = true;
      $scope.nameNull =false;
      $scope.cnameNull =false;
      $scope.telNull =false;
      $scope.ctelNull =false;
      $scope.supplierNumberNull = false;
      if ($scope.supplierNumber == undefined || $scope.supplierNumber == "") {
        $scope.supplierNumberNull = true;
        $scope.canAdd = false;
      }
     else if ($scope.supplierName == undefined || $scope.supplierName == "") {
        $scope.nameNull = true;
        $scope.canAdd = false;
      }
      else if ($scope.shortName == undefined || $scope.shortName == "") {
        $scope.cnameNull = true;
        $scope.canAdd = false;
      }
      else if ($scope.contactPhone == undefined || $scope.contactPhone == "") {
        $scope.telNull = true;
        $scope.canAdd = false;
      }
      else if ($scope.claimPhone == undefined || $scope.claimPhone == "") {
        $scope.ctelNull = true;
        $scope.canAdd = false;
      }
    };
   //获取焦点事件
    $scope.change=function(){
     $scope.nameNull = false;
     $scope.cnameNull = false;
     $scope.telNull = false;
     $scope.ctelNull = false;
      $scope.supplierNumberNull=false;
      $scope.supplierNumberRep=false;
      $scope.isContactTelNumber=true;
      $scope.isClaimTelNumber=true;
    };
    //新增供应商
    $scope.addSupplier=function(){
      $scope.canAddSupplier();
      $scope.judge();
      if (($scope.canAdd == true)&&$scope.isContactTelNumber&&$scope.isClaimTelNumber) {
        console.log($scope.supplierNumber);
        console.log($scope.supplierName);
        console.log($scope.shortName);
        $http({
          method: 'post',
          data: {
            supplierNumber:$scope.supplierNumber,
            supplierName: $scope.supplierName,
            shortName: $scope.shortName,
            contactPhone: $scope.contactPhone,
            claimPhone: $scope.claimPhone,
            cooperationStartTime:$scope.dates.cooperationStartTime ? $scope.dates.cooperationStartTime.format('YYYY-MM-DD') : '',
            cooperationEndTime:$scope.dates.cooperationEndTime ? $scope.dates.cooperationEndTime.format('YYYY-MM-DD') : '',
            ticket:$scope.ticket,domain:$scope.domain
          },
          url: serverUrl + '/supplierManager/insertSupplier'
        }).then(function successCallback(response) {
          $scope.showTip=false;
          $scope.nameRepeat=false;
          $scope.shortNameRepeat=false;
          $scope.saveSupplier=false;
          console.log('新增供应商'+response.data.errorCode);
          if (response.data.errorCode == 0) {
            $scope.saveSupplier=true;
            $location.path('/supplier/');
            $timeout(function(){ $scope.saveSupplier=false;},2000);
          }else if(response.data.errorCode == 7003){
            $scope.showTip=true;
            $scope.nameRepeat=true;
          }else if(response.data.errorCode == 7004){
            $scope.showTip=true;
            $scope.shortNameRepeat=true;
          }else if(response.data.errorCode == 7021){
            $scope.showTip=true;
            $scope.supplierNumberRep=true;
          }else{
            userAuth.isLogin(response.data);
            showError.showErrorMsg('新增供应商失败');
          }
        },function errorCallback(response){
              showError.showErrorMsg('新增供应商失败--网络错误');
          }
        )
      }
    };

      $scope.closePop=function(){
        $scope.nameRepeat=false;
        $scope.supplierNumberRep=false;
        $scope.shortNameRepeat=false;
        $scope.showTip=false;
      };

     //新增电话输入验证
      $scope.isContactTelNumber=true;
      $scope.isClaimTelNumber=true;
      $scope.judge=function(){
        $scope.isContactTelNumber=true;
        $scope.isClaimTelNumber=true;
        var reg=/[0-9]{5,}/;
        if(($scope.contactPhone!=undefined)&&($scope.contactPhone!="")){
          $scope.isContactTelNumber=reg.test($scope.contactPhone);
        }
        if(($scope.claimPhone!=undefined)&&($scope.claimPhone!="")){
          $scope.isClaimTelNumber=reg.test($scope.claimPhone);
        }
      }
    });
