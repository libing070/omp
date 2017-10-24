'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the clientApp
 */
app
  .controller('loginCtr', [function($scope){
    $scope.logout=function(){
      alert("test");
    }
  }]);
