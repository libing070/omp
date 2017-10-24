/**
 * Created by user on 2015/11/10.
 */
"use strict";
app
	.factory("openCity",function($http,$q,serverUrl,$location){

		var city={
//			getdefaultCity:function(){
//				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
//				$http({
//					method: 'post',
//					data: null,
//					url: serverUrl+'plateSetManager/getDefaultCity'
//				}).then(function successCallback(response) {
//					//console.log(response.data.data);
//					deferred.resolve(response);  // 声明执行成功，即http请求数据成功，可以返回数据了
//
//				}, function errorCallback(response) {
//					deferred.reject(response);   // 声明执行失败，即服务器返回错误
//				});
//				return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API
//
//			},
			getOpenList:function(){
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
				$http({
					method: 'post',
					data: {
						status:'N',
						ticket: $location.$$search.ticket,
						domain: $location.$$search.domain
					},
					url: serverUrl+'cityManager/queryCity'
				}).then(function successCallback(response) {
					//console.log(response.data.data);
					deferred.resolve(response);  // 声明执行成功，即http请求数据成功，可以返回数据了

				}, function errorCallback(response) {
					deferred.reject(response);   // 声明执行失败，即服务器返回错误
				});
				return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API

			}
		};
		return city;
	});