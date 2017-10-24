/**
 * 描述：
 * 		活动管理模块公共函数类
 * 说明：
 * 		factory中的参数是由框架自动注入，全局声明的值
 *
 * @author Jungle
 */
"use strict";
app.factory("httpUtils", function($http, $q, serverUrl) {

	var tmpObj = {

		invoke: function(params, httpUrl,type) {
			// 声明延后执行 ，后续监控执行
			var deferred = $q.defer();
			$http({
				method:type|| 'post',
				data: params|null,
				url: httpUrl
			}).then(function successCallback(response) {
				// 上抛响应请求
				deferred.resolve(response);
			}, function errorCallback() {
				deferred.reject(response);
			});
			return deferred.promise;
		},
    req:function(params, httpUrl,type,sync){


      var req=new XMLHttpRequest();
      var reqType=type||"post";
      var reqSync=sync||false;
      req.open(reqType,httpUrl,sync);
      req.send(params);
      var data={
        data:JSON.parse(req.response),
        status:req.status,
        statusText:req.readyState
      };

      var tem={
        then:function(success,error){
          success(data);
          error(data)


          return "then end line";
        }
      };
      return tem;



    }
	};
  var Ajax =
    function(){
      function request(url,opt){
        function fn(){}
        var async   = opt.async !== false,
          method  = opt.method    || 'GET',
          data    = opt.data      || null,
          success = opt.success   || fn,
          failure = opt.failure   || fn;
        method  = method.toUpperCase();
        if(method == 'GET' && data){
          url += (url.indexOf('?') == -1 ? '?' : '&') + data;
          data = null;
        }
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
        xhr.onreadystatechange = function(){
          _onStateChange(xhr,success,failure);
        };
        xhr.open(method,url,async);
        if(method == 'POST'){
          xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;');
        }
        xhr.send(data);
        return xhr;
      }
      function _onStateChange(xhr,success,failure){
        if(xhr.readyState == 4){
          var s = xhr.status;
          if(s>= 200 && s < 300){
            success(xhr);
          }else{
            failure(xhr);
          }
        }else{}
      }
      return {request:request};
    }();
	return tmpObj;

});
