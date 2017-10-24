/**
 * Created by libing on 2016/4/13.
 */
'use strict';

app.controller('jqxEditManagerCtrl', function($scope, $routeParams ,$rootScope,$http,
		$timeout, $location, serverUrl, openCity, userAuth) {
	 $scope.ticket=$location.$$search.ticket;
	   $scope.domain=$location.$$search.domain;
	var quotationID = $routeParams.quotationID;
	var lockOwner = $routeParams.lockOwner;
	var lockStatus = $routeParams.lockStatus;
	var goodsTypeID = $routeParams.goodsTypeID;
	var findParms=eval('(' + $routeParams.obj + ')');
	$scope.quoteRadio = {
		isChecked : '1'
	};//默认选中报价成功
	$scope.showSuccessDialog = true;
	listQuoteDetail();
	/**
	 * 获取报价单详情
	 */
	function listQuoteDetail() {
		$http({
			method : 'post',
			data : {
				ticket: $scope.ticket,
				domain:  $scope.domain,
				lockOwner : lockOwner,
				lockStatus : lockStatus,
				quotationID : quotationID
			},
			url : serverUrl + 'orderManager/detailQuotation'
		}).then(function successCallback(response) {
			if (response.data.errorCode == 0) {
				$scope.quoteDetail = response.data.data;
				$scope.currCarOwner=response.data.data.carOwnerInfo.carOwner;
				if(response.data.data.trafficInsurance!=undefined&&response.data.data.trafficInsurance!=""&&response.data.data.trafficInsurance!="{}"){
					var par=eval('(' + response.data.data.trafficInsurance + ')');
					
					document.getElementById("search_createTimeStart").setAttribute("placeholder",par.lastYearEndDate==""?"请选择上年终保日期":par.lastYearEndDate);
					$scope.jqxPremium=par.premium;
					$scope.jqxSumTravelTax=par.sumTravelTax;
					$scope.jqxProposalNO=par.proposalNO;
				}else{
					document.getElementById("search_createTimeStart").setAttribute("placeholder","请选择上年终保日期");
				}
				$scope.currGoodsTypeName=response.data.data.goodsTypeName;
				if(response.data.data.quotationStatus=="3"){
					$scope.showFailDialog=true;
					$scope.showSuccessDialog=false;
					$scope.quoteRadio={isChecked:'0'};
					if(response.data.data.failDescription==""){
						$scope.failDescription="您购买交强险的保障期还有90天以上，不允许投保交强险";
					}else{
						$scope.failDescription=response.data.data.failDescription;
					}
				}
			} else {
				userAuth.isLogin(response.data);
				$scope.title = "提示";
				$scope.context = "加载报价单详情失败!";
				$scope.PopHide = true;
			}
		})
	}

	$scope.getFailTextarea = function() {
		if($scope.failDescription==undefined||$scope.failDescription==""){
			$scope.failDescription="您购买交强险的保障期还有90天以上，不允许投保交强险";
		}
		$scope.showFailDialog = true;
		$scope.showSuccessDialog = false;
	}
	$scope.getSuccessInput = function() {
		$scope.showSuccessDialog = true;
		$scope.showFailDialog = false;
	}

	$scope.goTo = function(add) {
		$location.path(add);
	};
	//重新填写
	$scope.reload=function(){
		$scope.showQuoteDialog=false;
	}
	$scope.setJqxInput1 = function(event) {
      var k = event.keyCode;   //48-57是大键盘的数字键，96-105是小键盘的数字键
 	 var FirstChar=$scope.jqxPremium.substr(0,1);//获取文本首个字符
 	 if(FirstChar=="0"||FirstChar=="."){//首位不能是0或.
 		 $scope.jqxPremium = "";
 		 return false;
 	 }
 	 if ((k <= 57 && k >= 48) || (k <= 105 && k >= 96||k==110||k==190)||(event.ctrlKey&&k==67)||(event.ctrlKey&&k==86)){//k=110,190  (区分全键盘小键盘)是小数点
 		 if($scope.jqxPremium.indexOf(".")!=$scope.jqxPremium.lastIndexOf(".")){//只能有一个小数点
 			 $scope.jqxPremium="";
 			 return false;
 		 }
 		 var num=$scope.jqxPremium;
 		 if($scope.jqxPremium.lastIndexOf(".")>0){//如果有小数点 只能输入两位小数
 			 var sublen=num.substring(num.lastIndexOf(".")+1,num.length).length;
 			 if(sublen>2){
 				 $scope.jqxPremium=num.substring(0,num.lastIndexOf(".")+3);//小数点第三位不能输入（保留两位）
 				 return false;
 			 }
 		 }
 	 }
 	 var b=/^[\d]{1}([\d]|[\.])*$/;//筛选数字和小数点
 	 if(!b.test($scope.jqxPremium)){
 		 $scope.jqxPremium="";
 		 return false;
 	 
	  }
 	 }
	$scope.setJqxInput2 = function(event) {
   //即时处理输入框的内容,比如进行某些运算
	 var k = event.keyCode;   //48-57是大键盘的数字键，96-105是小键盘的数字键
	 var FirstChar=$scope.jqxSumTravelTax.substr(0,1);//获取文本首个字符
	 if(FirstChar=="0"||FirstChar=="."){//首位不能是0或.
		 $scope.jqxSumTravelTax = "";
		 return false;
	 }
	 if ((k <= 57 && k >= 48) || (k <= 105 && k >= 96||k==110||k==190)||(event.ctrlKey&&k==67)||(event.ctrlKey&&k==86)){//k=110,190  (区分全键盘小键盘)是小数点
		 if($scope.jqxSumTravelTax.indexOf(".")!=$scope.jqxSumTravelTax.lastIndexOf(".")){//只能有一个小数点
			 $scope.jqxSumTravelTax="";
			 return false;
		 }
		 var num=$scope.jqxSumTravelTax;
		 if($scope.jqxSumTravelTax.lastIndexOf(".")>0){//如果有小数点 只能输入两位小数
			 var sublen=num.substring(num.lastIndexOf(".")+1,num.length).length;
			 if(sublen>2){
				 $scope.jqxSumTravelTax=num.substring(0,num.lastIndexOf(".")+3);//小数点第三位不能输入（保留两位）
				 return false;
			 }
		 }
	 }
	 var b=/^[\d]{1}([\d]|[\.])*$/;//筛选数字和小数点
	 if(!b.test($scope.jqxSumTravelTax)){
		 $scope.jqxSumTravelTax="";
		 return false;
	 }

	}
	
	   $scope.blurs=function(num){//离开文本框  验证最后输入的一个值是否是"."
			   var currNum=num==1?$scope.jqxPremium:$scope.jqxSumTravelTax;
				   if(currNum!=undefined&&currNum.lastIndexOf(".")==currNum.length-1){
					   var lastNum=currNum.substring(0,currNum.length-1);
					   if(num==1)
					   {$scope.jqxPremium=lastNum;}
					   else if(num==2)
					   {$scope.jqxSumTravelTax=lastNum;}
				   } 
	      }
	   $scope.dates = {
			};
	function toVaild(){
		    $scope.placeholder_=document.getElementById("search_createTimeStart").attributes["placeholder"].value;
		    if($scope.placeholder_=="请选择上年终保日期"){
		    	$scope.placeholder_="";
		    }
		    /*var search_createTimeStart=$scope.dates.search_createTimeStart?$scope.dates.search_createTimeStart.format('YYYY-MM-DD'):$scope.placeholder_?$scope.placeholder_:"";*/
		    var jqxPremium=$scope.jqxPremium||"";
		    var jqxProposalNO=$scope.jqxProposalNO||"";
		    var jqxSumTravelTax=$scope.jqxSumTravelTax||"";
		    $scope.createTimeStartStyle="";
		    $scope.jqxPremiumStyle="";
		    $scope.jqxProposalNOStyle="";
		    $scope.jqxSumTravelTaxStyle="";
		  //  if(search_createTimeStart==""){$scope.createTimeStartStyle={"border":"1px solid red"}; return false;}
		    if(jqxPremium==""){$scope.jqxPremiumStyle={"border":"1px solid red"}; return false;}
		    if(jqxProposalNO==""){$scope.jqxProposalNOStyle={"border":"1px solid red"}; return false;}
		    if(jqxSumTravelTax==""){$scope.jqxSumTravelTaxStyle={"border":"1px solid red"}; return false;}
		    return true;
	}
	  $scope.onSubmitOK=function(){
			var currCheck=$scope.quoteRadio.isChecked;
			if("1"==currCheck){
				if(toVaild()){
					$scope.showQuoteDialog=true;
					$scope.trafficInsurance={"premium":$scope.jqxPremium,"lastYearEndDate":$scope.dates.search_createTimeStart?$scope.dates.search_createTimeStart.format('YYYY-MM-DD'):$scope.placeholder_?$scope.placeholder_:"","sumTravelTax":$scope.jqxSumTravelTax,"proposalNO":$scope.jqxProposalNO};
					$scope.amount=Number($scope.jqxPremium)+Number($scope.jqxSumTravelTax);
				};
			}else{
				$scope.trafficInsurance="";
				$scope.amount="";
				$scope.businessInsurance="";
				$scope.kindList="";
				$scope.okQuote(3);
			}
			
		} 
	  
	//确认报价
		$scope.okQuote=function(quotationStatus){
			$http({
				method: 'post',
				data: {
					ticket: $scope.ticket,
					domain:  $scope.domain,
					quotationID:quotationID,
					quotationStatus:quotationStatus,
					goodsTypeID:goodsTypeID,
					lockStatus:lockStatus,
					failDescription:$scope.failDescription||"",
					businessInsurance:$scope.businessInsurance||"",
					trafficInsurance:$scope.trafficInsurance||"",
					kindList:$scope.kindList||"",
					amount:$scope.amount
				},
				url: serverUrl + 'orderManager/editQuotation'
			}).then(function successCallback(response) {
				var obj=JSON.stringify(findParms);
				if (response.data.errorCode == 0) {
					$scope.quoteDetail=response.data.data;
					if("3"==quotationStatus){
						$scope.divFShow=true;
						$scope.isIntBgColorShow=true;
						$timeout(function(){$scope.divFShow=false;$scope.isIntBgColorShow=false;$location.path('quoteManager/'+obj);},2000);//保存
					}else{
						$scope.showQuoteDialog=false;
						$location.path('quoteManager/'+obj);
						 $location.replace();
					}
				} else {
					userAuth.isLogin(response.data);
					$scope.showQuoteDialog=false;
					$scope.divFShowError=true;
					$scope.isIntBgColorShow=true;
					$timeout(function(){$scope.divFShowError=false;$scope.isIntBgColorShow=false;$location.path('quoteManager/'+obj);},2000);//保存
				}
			})
		}
});
