/**
 * Created by user on 2015/11/10.
 */
"use strict";
app
	.factory("userAuth", function($http, $q, serverUrl) {

		var userAuth = {
			isLogin: function(response) {
				if(response.errorCode == -1000){
					window.parent.location.href = response.data.logoutUrl;
					return;
				}
			}
		};
		return userAuth;
	});