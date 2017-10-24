'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app
  .controller('CityCtrl', function ($scope, $rootScope,$http, $location,$timeout,serverUrl, showError, userAuth) {
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
    console.info($rootScope.ticket);
    console.info($rootScope.domain);

      $scope.enterCity=false;
    function list(cityID,status){
      //queryParam['ticket'] = $location.$$search.ticket;
      //queryParam['domain'] = $location.$$search.domain;
      $http({
        method: 'post',
        data: {cityID:cityID,status:status,ticket:$location.$$search.ticket,domain:$location.$$search.domain},
        url: serverUrl+'cityManager/queryCity'
      }).then(function successCallback(response) {
        console.log('刷页面');
        console.log(response.data.errorCode);
        console.log(response.data.data);
        if(response.data.errorCode==0){
          $scope.citys = response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取城市列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取城市列表失败--网络错误');
      });
    }
    list('','N');

    function listAll(cityID,status){
      $http({
        method: 'post',
        data: {cityID:cityID,status:status,ticket:$location.$$search.ticket,domain:$location.$$search.domain},
        url: serverUrl+'cityManager/queryCity'
      }).then(function successCallback(response) {
        //console.log('刷新城市列表');
        if(response.data.errorCode==0){
          $scope.citysList = response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取城市列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取城市列表失败--网络错误');
      });
    }
    listAll('','N');

    $scope.searchCity=function(){
      if($scope.selectCity=="allCity"){listAll();}
     else{list($scope.selectCity,'N');}
    };

    $scope.modalShow=false;
    $scope.showCity=function(){
      $scope.enterAgain = false;
      $scope.cityAdvise = '';
      $scope.newCity='';
      $scope.cityNumber="";
      $scope.citySubEn = true;
      $scope.modalAdd=true;
    };

    $scope.closeCity=function(){
      $scope.modalShow=false;
      $scope.modalAdd=false;
      $scope.modalDel=false;
    };

	//$scope.changeName = function(name) {
	//	$scope.citySubEn = true;
	//	$scope.cityAdvise = '';
	//	if (!name || name.charAt(name.length - 1) != '市') {
	//		return;
	//	}
	//	var url = mapUrl + 'place/v2/suggestion?query=' + name + '&region=全国&output=json&ak=wDB25MdadZqetoQDvUKnyMBx'
	//	$http({
	//		method: 'get',
	//		url: url
	//	}).then(function successCallback(response) {
	//		if (response.data.status == 0) {
	//			if (response.data.result.length > 0) {
	//				var result = response.data.result;
	//				for (var i = 0; i <= result.length; i++) {
	//					if (result[i] && result[i].name == name && result[i].location && result[i].cityid) {
	//						$scope.cityAdvise = "您当前获取的城市名称为： " + result[i].name;
	//						$scope.citySubEn = false;
	//						break;
	//					}
	//				}
	//			}
	//		}
	//	}, function errorCallback(response) {
	//		$scope.cityAdvise = "获取城市地址信息失败";
	//		$scope.citySubEn = true;
	//	});
	//};



    $scope.addCity=function(){
      if($scope.cityNumber==undefined||$scope.cityNumber==""){
        $scope.cityNumberNull=true;
      } else if($scope.newCity==undefined||$scope.newCity==""){
        $scope.enterCity=true;
      } else {
        console.log($scope.newCity);
        console.log($scope.cityNumber);
        $http({
          method: 'post',
          data: {cityName: $scope.newCity,cityNumber:$scope.cityNumber,ticket:$location.$$search.ticket,domain:$location.$$search.domain},
          url: serverUrl + '/cityManager/insertCity'
        }).then(function successCallback(response) {
          console.log('新增城市'+response.data.errorCode);
          if (response.data.errorCode == 0) {
            $scope.enterCity = false;
            $scope.modalShow = false;
            $scope.modalAdd = false;
            list('','N');
            listAll('','N');
          }else if (response.data.errorCode == 7001) {
            $scope.enterAgain = true;
            //successCallback(response);
          }else if(response.data.errorCode == 7020){
            $scope.cityNumberRep=true;
          }else {
            userAuth.isLogin(response.data);
            $scope.modalShow = false;
            $scope.modalAdd = false;
            showError.showErrorMsg("添加失败");
          }
        }, function errorCallback(response) {
          $scope.modalShow = false;
          $scope.modalAdd = false;
          showError.showErrorMsg("添加失败-网络连接失败");
        });
      }
    };

      //获取焦点事件
      $scope.nameRep=function(){
          $scope.enterAgain = false;
         $scope.enterCity=false;
        $scope.cityNumberNull=false;
        $scope.cityNumberRep=false;
      };

    $scope.delCity=function(cityID){
      $scope.cityID=cityID;
      $scope.modalShow=true;
      $scope.modalDel=true;
    };
    $scope.ensureDelCity=function(){
      $http({
        method: 'post',
        data: {cityID:$scope.cityID,ticket:$location.$$search.ticket,domain:$location.$$search.domain},
        url: serverUrl+'/cityManager/deleteCity'
      }).then(function successCallback(response) {
        console.log(response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.modalShow=false;
          $scope.modalDel=false;
          $scope.modalAlreadyDel=true;
          $timeout(function(){$scope.modalAlreadyDel=false; },2000);
          list('','N');
          listAll('','N');
        }else if(response.data.errorCode==7002){
            $scope.modalShow=false;
            $scope.modalDelFalse=true;
            $scope.modalDel=false;
        }else if(response.data.errorCode==7022){
          $scope.modalShow=false;
          $scope.modalDelFalseCar=true;
          $scope.modalDel=false;
        }else{
          userAuth.isLogin(response.data);
          $scope.modalShow=false;
          $scope.modalDel=false;
          showError.showErrorMsg("删除失败");
        }
      }, function errorCallback(response) {
        $scope.modalShow=false;
        $scope.modalDel=false;
        showError.showErrorMsg("删除失败-网络连接失败");
      });


    };

$scope.closePop=function(){
  $scope.modalDelFalse=false;
  $scope.modalDelFalseCar=false;
}


  });

