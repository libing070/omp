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
  .controller('AddSupportCtrl', function ($scope, $http,  $routeParams, $location,$timeout,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.closeError=function(){
      $scope.hasError=false;
    };
    $scope.hasError=false;

    $scope.ticket=$routeParams.ticket;
    $scope.domain=$routeParams.domain;

    $scope.goTo=function(add){
      $location.path(add);
    };

      //关闭弹出框
      $scope.closeModalBox=function(){
        $scope.supplierNotSel=false;
      };
    function list(){
      $http({
        method: 'post',
        data: {ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/protectManager/queryPlatKindCodeList'
      }).then(function successCallback(response){
        console.log('平台险种查询'+response.data.errorCode);
        if(response.data.errorCode==0){
          var list1=[],list2=[];
          angular.forEach(response.data.data,function(value){
            switch (value.kindType){
              case "1":
              case 1:
                value.kindType=true;
                list1.push(value);
                    break;
              case "2":
              case 2:
                value.kindType=false;
                    list2.push(value);
                    break;
            }
          });
          //console.log(list1);
          //console.log(list2);
          $scope.kindList=list1;
          $scope.kindListF=list2;
          //console.log($scope.kindList);
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取平台险种列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取平台险种列表失败--网络错误');
      });
    }
    list();

    $scope.nameChange=function(){
       $scope.nameSupportNull=false;
      $scope.nameSupportRepeat=false;
    };
      //console.log($scope.amount);

    //判断isFree;
    $scope.changeBox=function(issel,kindID){
      $scope.issel=issel==true?'1':'0';
      $scope.kindID=kindID;
      $scope.kindList.forEach(function(value){
        for(var i=0;i<$scope.kindList.length;i++){
          if($scope.kindList[i].kindID==($scope.kindID)){
            $scope.kindList[i].isFree=$scope.issel;
          }
          else{
            if($scope.kindList[i].isFree==undefined){$scope.kindList[i].isFree='1';}
          }
        }
        for(var i=0;i<$scope.kindListF.length;i++){
          if($scope.kindListF[i].kindID==($scope.kindID)){
            $scope.kindListF[i].isFree=$scope.issel;
          }
          else{
            if($scope.kindList[i].isFree==undefined){$scope.kindListF[i].isFree='0'};
          }
        }
      });
    };
    //新增保障方案
    $scope.canAddSupport=true;
    $scope.save=function(){
      if($scope.protectPlanName==undefined||$scope.protectPlanName==""){$scope.nameSupportNull=true;}
      var tem=[];
      $scope.kindList.forEach(function(value){
          if((value.test==undefined)||(value.test=="")){
            $scope.canAddSupport=false;
            $scope.listNull=true;
          }else{
            var amount=value.test;
            var kindID=value.kindID;
            var mainFlag=value.kindType;
            if(mainFlag==true){mainFlag=1}else{mainFlag=2}
            var isFree;
            if(value.isFree){isFree=value.isFree;}else{isFree='1'}
            if(amount==undefined||amount=="N"){
              isFree='0';
            }else{
              tem.push({kindID:kindID,amount:amount,mainFlag:mainFlag,isFree:isFree});
            }
          }
        //更改tem.push({kindID:kindID,amount:amount,mainFlag:mainFlag,isFree:isFree});
      });
     $scope.kindListF.forEach(function(value){
       //console.log("value==2==");
       //console.log(value);
       if((value.test==undefined)||(value.test=="")){
         $scope.canAddSupport=false;
         $scope.listFNull=true;
       }else{
       var amount=value.test;
       var kindID=value.kindID;
       var mainFlag=value.kindType;
       if(mainFlag==true){mainFlag=1}else{mainFlag=2}
       var isFree;
       if(value.isFree){isFree=value.isFree;}else{isFree='0'}
       if(amount==undefined||amount=="N"){
         isFree='0';
       } else{
         tem.push({kindID:kindID,amount:amount,mainFlag:mainFlag,isFree:isFree});
       }
       }
     });

     if(tem.length==0){
        $scope.supplierNotSel=true;
     }else{
       console.log(tem);
       if($scope.canAddSupport==true){
         $http({
           method: 'post',
           data: {protectPlanName:$scope.protectPlanName,protectDetailList:tem,ticket:$scope.ticket,domain:$scope.domain},
           url: serverUrl+'/protectManager/insertProtectPlan'
         }).then(function successCallback(response) {
           console.log('新增'+response.data.errorCode);
           if(response.data.errorCode==0){
             $scope.nameSupportNull=false;
             $scope.saveSupport=true;
             $timeout(function(){$scope.saveSupport=false;},2000);
             $location.path('/support');
           }else if(response.data.errorCode==7009){
             $scope.nameSupportRepeat=true;
           }else{
             userAuth.isLogin(response.data);
             showError.showErrorMsg('新增保障方案失败');
           }
         }, function errorCallback(response) {
           showError.showErrorMsg('新增保障方案失败');
         });
       }
     }
    };

  $scope.focus=function(){
    $scope.canAddSupport=true;
    $scope.listNull=false;
    $scope.listFNull=false;
  };



  });

