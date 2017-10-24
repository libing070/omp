
/**
 * Created by user on 2015/11/10.
 */
'use strict';
app
	.factory("showError",function($rootScope){
		$rootScope.hasError=false;
		$rootScope.hideError=function(){
			$rootScope.hasError=false;
			$rootScope.errorMsg="";
		};
		var error={
			showErrorMsg:function(string){
				$rootScope.errorMsg=string;
				$rootScope.hasError=true;
			},
			hideErrorBox:function(){
				$rootScope.hasError=false;
			}
		};
		return error;
	});