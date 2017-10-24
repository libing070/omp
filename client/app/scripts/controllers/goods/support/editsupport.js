/**
 * Created by Administrator on 2015/12/8.
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
  .controller('EditSupportCtrl', function ($scope,$rootScope,$routeParams, $location, $http, $timeout,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

      $scope.hasError=false;
      $scope.closeError=function(){
        $scope.hasError=false;
      };

      //关闭弹出框
      $scope.closeModalBox=function(){
        $scope.supplierNotSel=false;
      };

    var protectPlanID=$routeParams.id;
    $scope.protectPlanID=protectPlanID;
    var protectPlanName=$routeParams.name;
    $scope.protectPlanName=protectPlanName;
    $scope.ticket=$rootScope.ticket;
    $scope.domain=$rootScope.domain;

    $scope.goTo=function(add){
      $location.path(add);
    };

    //判断保障方案是否允许编辑
    function judgeEdit(protectPlanID){
      $http({
        method: 'post',
        data: {protectPlanID:protectPlanID,ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/protectManager/checkUpdateForProtectPlan'
      }).then(function successCallback(response) {
        console.log(protectPlanID);
        console.log('查看保障方案是否可编辑'+response.data.errorCode);
        console.log(response.data.data);
        if(response.data.errorCode==0){
          $scope.supportCanEdit=response.data.data;
          if($scope.supportCanEdit=='N'){
            $scope.canNotEdit=true;
          }
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('查询保障方案是否可编辑失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('查询保障方案是否可编辑失败--网络错误');
      });
    }
    judgeEdit($scope.protectPlanID);


    $scope.nameChange=function(){
      if ($scope.protectPlanName==undefined||$scope.protectPlanName==""){
        $scope.nameSupportNull=true;
      }
      else{
        $scope.nameSupportNull=false;
      }
      console.log($scope.protectPlanName);
    };

    //查询
    $scope.Tlist=function(){
      $http({
        method: 'post',
        data: {ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/protectManager/queryPlatKindCodeList'
      }).then(function successCallback(response){
        console.log('平台险种查询'+response.data.errorCode);
        console.log(response.data.data);
        if(response.data.errorCode==0){
          var Tlist1=[],Tlist2=[];
          angular.forEach(response.data.data,function(value){
            if(value.amountShow==undefined){
              value.amountShow="不投保";
            }
            switch (value.kindType){
              case "1":
              case 1:
                value.kindType=true;
                Tlist1.push(value);
                break;
              case "2":
              case 2:
                value.kindType=false;
                Tlist2.push(value);
                break;
            }
          });
          $scope.TkindList=Tlist1;
          $scope.TkindListF=Tlist2;
          console.log('0000000000');
          console.log($scope.TkindList);
          console.log($scope.TkindListF);
          $scope.Nlist=function(protectPlanID){
            $http({
                  method: 'post',
                  data: {protectPlanID:protectPlanID,ticket:$scope.ticket,domain:$scope.domain},
                  url: serverUrl+'/protectManager/queryProtectPlanDetail'
                }).then(function successCallback(response) {
                  console.log('查询保障方案详情'+response.data.errorCode);
                  //console.log($scope.protectPlanID);
                  //console.log('000000');
                  //console.log(response.data.data);
                  if(response.data.errorCode==0){
                    $scope.NkindList=[];$scope.NkindListF=[];
                    angular.forEach(response.data.data,function(value){
                      switch (value.mainFlag){
                        case "1":
                        case 1:
                          value.mainFlag=true;
                          var kindID=value.kindID;
                          var NisFree=value.isFree;
                          var NamountShow=value.amountShow;
                          $scope.NkindList.push({kindID:kindID,isFree:NisFree,amountShow:NamountShow});
                          break;
                        case "2":
                        case 2:
                          value.mainFlag=false;
                          var kindID=value.kindID;
                          var NisFree=value.isFree;
                          var NamountShow=value.amountShow;
                          $scope.NkindListF.push({kindID:kindID,isFree:NisFree,amountShow:NamountShow});
                          break;
                      }
                    });

                    for(var i=0;i<$scope.TkindList.length;i++){
                      for(var j=0;j<$scope.NkindList.length;j++){
                        if($scope.TkindList[i].kindID==$scope.NkindList[j].kindID){
                          $scope.TkindList[i].isFree=$scope.NkindList[j].isFree;
                          $scope.TkindList[i].amountShow=$scope.NkindList[j].amountShow;
                        }
                      }
                    }
                    for(var m=0;m<$scope.TkindListF.length;m++){
                      for(var n=0;n<$scope.NkindListF.length;n++){
                        if($scope.TkindListF[m].kindID==$scope.NkindListF[n].kindID){
                          $scope.TkindListF[m].isFree=$scope.NkindListF[n].isFree;
                          $scope.TkindListF[m].amountShow=$scope.NkindListF[n].amountShow;
                        }
                      }
                    }
                    console.log('last============');
                    console.log($scope.TkindList);
                    console.log($scope.TkindListF);
                  }else{
                    userAuth.isLogin(response.data);
                    showError.showErrorMsg('获取保障方案详情失败');
                  }
                }, function errorCallback(response) {
                  showError.showErrorMsg('获取保障方案详情失败');
                });

          };
          $scope.Nlist($scope.protectPlanID);
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取平台险种列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取平台险种列表失败--网络错误');
      });
    };
    $scope.Tlist();


    //判断isFree;
    $scope.changeBox=function(issel,kindID){
      $scope.issel=issel==true?'1':'0';
      $scope.kindID=kindID;
      $scope.TkindList.forEach(function(value){
        for(var i=0;i<$scope.TkindList.length;i++){
          if($scope.TkindList[i].kindID==($scope.kindID)){
            $scope.TkindList[i].isFree=$scope.issel;
            //console.log($scope.kindID+'-----'+$scope.issel);
            //console.log($scope.kindList);
          }
          else{
            //$scope.TkindList[i].isFree='1';
          }
        }
        for(var i=0;i<$scope.TkindListF.length;i++){
          if($scope.TkindListF[i].kindID==($scope.kindID)){
            $scope.TkindListF[i].isFree=$scope.issel;
            //console.log($scope.kindID+'-----'+$scope.issel);
            //console.log($scope.kindList);
          }
          else{
            //$scope.TkindListF[i].isFree='0';
          }
        }
      });
    };
    //编辑保障方案
    $scope.edit=function(){
      if($scope.protectPlanName==undefined||$scope.protectPlanName==""){$scope.nameSupportNull=true;}
      var tem=[];
      //console.log('0123456');
      //console.log($scope.TkindList);
      //console.log($scope.TkindListF);
      $scope.TkindList.forEach(function(value){
        //console.log("value==1==");
        //console.log(value);
        var kindID=value.kindID;
        var amountShow=value.amountShow;
        var mainFlag=value.kindType;
        if(mainFlag==true){mainFlag=1}else{mainFlag=2}
        var amount;
        if(value.test){amount=value.test;}else{
          if(value.amountShow){
            for(var i=0;i<value.amountList.length;i++){
              if(value.amountList[i].amountShow==value.amountShow){
                var amountValue=value.amountList[i].amountValue;
              }
            }
          }
          amount=amountValue;
        }
        var isFree=value.isFree;
        if(amount==undefined||amount=="N"){isFree='0';}else{
          tem.push({kindID:kindID,amount:amount,mainFlag:mainFlag,isFree:isFree});
        }
        //更改tem.push({kindID:kindID,amount:amount,mainFlag:mainFlag,isFree:isFree});
      });
      $scope.TkindListF.forEach(function(value){
        //console.log("value==2==");
        //console.log(value);
        var kindID=value.kindID;
        var amountShow=value.amountShow;
        var mainFlag=value.kindType;
        if(mainFlag==true){mainFlag=1}else{mainFlag=2}
        var amount;
        if(value.test){amount=value.test;}else{
          if(value.amountShow){
            for(var i=0;i<value.amountList.length;i++){
              if(value.amountList[i].amountShow==value.amountShow){
                var amountValue=value.amountList[i].amountValue;
              }
            }
          }
          amount=amountValue;
        }
        var isFree=value.isFree;
        if(amount==undefined||amount=="N"){isFree='0';}else{
          tem.push({kindID:kindID,amount:amount,mainFlag:mainFlag,isFree:isFree});
        }
        //更改tem.push({kindID:kindID,amount:amount,mainFlag:mainFlag,isFree:isFree});
      });
      //console.log('tem===============');
      //console.log(tem);
      if(tem.length==0){
        $scope.supplierNotSel=true;
      }else{
        $http({
          method: 'post',
          data: {protectPlanID:$scope.protectPlanID,protectPlanName:$scope.protectPlanName,protectDetailList:tem,ticket:$scope.ticket,domain:$scope.domain},
          url: serverUrl+'/protectManager/updateProtectPlan'
        }).then(function successCallback(response) {
          //console.log('tem==');
          //console.log(tem);
          console.log('编辑'+response.data.errorCode);
          if(response.data.errorCode==0){
            $scope.nameSupportNull=false;
            $scope.showSupportTip=true;
            $scope.saveSupport=true;
            $timeout(function(){ $scope.showSupportTip=false;$scope.saveSupport=false;},2000);
            $location.path('/support');
          }else if(response.data.errorCode==7009){
            $scope.nameSupportRepeat=true;
            $timeout(function(){ $scope.nameSupportRepeat=false;},2000);
          }else{
            userAuth.isLogin(response.data);
            showError.showErrorMsg('编辑保障方案失败');
          }
        }, function errorCallback(response) {
          showError.showErrorMsg('编辑保障方案失败--网络错误');
        });
      }

    };


  });


