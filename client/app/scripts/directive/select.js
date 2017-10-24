app.directive('selectBox', [function() {
  return {
    restrict: 'EA',
    templateUrl: 'views/directive/select.html',
    replace: true,
    scope: {
      option: '=',
      ngModel:'='
    },
    link : function(scope, element, attrs) {
        scope.showText=scope.ngModel||attrs.placeholder||" ";
        scope.expandBox=function(){
          scope.showBox=true;
          element[0].classList.add("selected-box");
          //console.log(element)
        };
      scope.hidePop=function(){
        scope.showBox=false;
        element[0].classList.remove("selected-box");
      };
        scope.show=function(item){
          scope.ngModel=item;
          scope.showText=scope.ngModel;
          element[0].classList.remove("selected-box");
          scope.showBox=false;
        }

    }  };
}]);
