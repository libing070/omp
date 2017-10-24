app.directive('logout', ["$http",function($http) {
  return {
    restrict: 'EA',
    //templateUrl: 'views/directive/select.html',
    replace: false,
    //scope: {
    //  option: '=',
    //  ngModel:'='
    //},
    link : function(scope, element, attrs) {
      $http({
        method: 'post',
        data: queryParam,
        url: serverUrl + 'orderManager/queryAllOrderList'
      }).then(function successCallback(response) {


      },function errorCallback(){

      })
    }
  };
}]);
