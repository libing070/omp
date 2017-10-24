

"use strict";
app
	.directive('selectCity', function() {
		return {
			restrict : 'A',
			replace : true,
			transclude : true,
			scope: {
				listCity:"=",
				listCityCheck:"=",
				openCities:"=",
			},

			templateUrl :'views/factory/selectCity.html',
			link : function(scope, element, attrs) {
				var input=$("#showID");
				var box=input.next();

				//var listCites={};
				//function init(){
				//	console.log("scope.listCityCheck.length");
				//	console.log(scope.listCityCheck);
				//	console.log(scope.listCityCheck.length);
				//	if(scope.listCityCheck.length>0){
				//		var cityArr=[];
				//		scope.listCityCheck.forEach(function(vaule){
				//			cityArr.push(vaule.id);
				//		});
				//		scope.listCity=scope.openCities.map(function(value){
				//			var tem=value;
				//			if(cityArr.indexOf(tem.cityID)==-1){
				//				return tem;
				//			}
				//		});
				//		scope.showListCityStr=cityArr.join("/");
				//	}else{
				//		scope.listCity=scope.openCities;
				//		scope.showListCityStr="选择城市";
				//	}
				//}
				function showStr(){
					var cityArr=[];
					if(scope.listCityCheck.length>0){
						scope.listCityCheck.forEach(function(vaule){
							cityArr.push(vaule.id);
						});
					}
					if(cityArr.length>0){
						scope.showListCityStr=cityArr.join("/");
					}else{
						scope.showListCityStr="选择城市";
					}
				}
				//console.log("scope.openCities.length");
				//console.log(scope.openCities);
				//console.log("scope.listCity.length");
				//console.log(scope.listCity);
				//init();






				//var selectBox=box.children(".select-box");
				//var selectAccept=box.children(".select-accept");
				var btn=box.children(".btn-remove");

				//var tem=[];
				$(document).on("click",".select-box .btn",function(){
					var index=parseInt($(this).data("index"));
					//console.log("index")
					//console.log(index)
					//console.log(typeof (index));
					//console.log("scope.listCity");
					//console.log(scope.listCity);
					//console.log("scope.listCity[index]");
					//console.log(scope.listCity[index]);
					//var list=scope.listCity;
					//var check=scope.listCityCheck;
					//var tem=scope.listCity[index];
					//list.splice(index,1);
					//check.push(tem);
					scope.listCityCheck.push(scope.listCity[index]);
					showStr();
					scope.listCity.splice(index,1);
					//init();


					//var cid=$(this).data("cid");
					////console.log(cid);
					//listCites[parseInt(cid)]=true;
					////console.log(listCites);
					//selectAccept.append($(this));
					//tem=[];
					//for (var i in listCites){
					//	//console.log("i_____________"+i);
					//	//console.log(listCites[i]);
					//	if(listCites[i]){
					//		tem.push(i);
					//	}
					//}
					////var str=tem.join("|");
					//scope.showListCity.str=tem.join("|");
					////input.val(str);
					//scope.showListCity.city=tem;
					scope.$apply();

				});
				$(document).on("click",".select-accept .btn",function(){
					var index=$(this).data("index");

					scope.listCity.push(scope.listCityCheck[index]);
					scope.listCityCheck.splice(index,1);
					showStr();
					//init();
					//var cid=$(this).data("cid");
					////console.log(cid);
					//listCites[parseInt(cid)]=false;
					//console.log(listCites);
					//selectBox.append($(this));
					//tem=[];
					//for (var i in listCites){
					//	//console.log("i_____________"+i);
					//	//console.log(listCites[i]);
					//	if(listCites[i]){
					//		tem.push(i);
					//	}
					//}
					//scope.showListCity.str=tem.join("|");
					////input.val(str);
					//scope.showListCity.city=tem;
					scope.$apply();
					//console.log((tem))
				});
				input.on("click",function(){

					box.removeClass("hidden")
				});
				btn.on("click",function(){
					box.addClass("hidden")
				});

			}
		}

	});
