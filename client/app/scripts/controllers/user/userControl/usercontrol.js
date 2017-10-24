'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */


app.
	controller('UserCtrl', function($scope, $http, $timeout,serverUrl, showError){
		this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.hasError=false;
    $scope.enterCity=false;
    function list(userID){
	    $http({
	    	method : 'post',
	    	data : {userID : userID},
	    	url : serverUrl + 'userManager/queryUser'
	    }).then(function successCallback(response){
	    	console.log(response.data.errorCode); 
	    	if(response.data.errorCode == 0){
	    		$scope.users = response.data.data;
	    	}else{
	    		showError.showErrorMsg('获取用户列表失败');
	    	}
	    }, function errorCallback(response){
	    	showError.showErrorMsg('获取用户列表失败');
	    });
    }
    list();
    
    
    
});
