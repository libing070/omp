
/**
 * Created by user on 2015/11/10.
 */
"use strict";
app
	.factory("syncHttp",function($http,$q,serverUrl){

		var data={
			getData:function(url,data,type){
				var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
				$http({
					method: type||'post',
					data: data,
					url: serverUrl+url
				}).then(function successCallback(response) {
					//console.log(response.data.data);
					deferred.resolve(response);  // 声明执行成功，即http请求数据成功，可以返回数据了

				}, function errorCallback(response) {
					deferred.reject(response);   // 声明执行失败，即服务器返回错误

				});
				return deferred.promise;   // 返回承诺，这里并不是最终数据，而是访问最终数据的API

			},
      getDataSync:function(url,data,type){
        var req=new XMLHttpRequest();
        req.open()
        req.onreadystatechange=function(){

        };
        req.send(data);
      }

		};
		return data;
	});
