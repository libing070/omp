/**
 * Created by libing on 2016/4/13.
 */
'use strict';

app
	.controller('ttbEditManagerCtrl', function($scope,$routeParams,$rootScope, $http, $timeout, $location, serverUrl, openCity, userAuth) {
		 $scope.ticket=$location.$$search.ticket;
		   $scope.domain=$location.$$search.domain;
		var quotationID=$routeParams.quotationID;
		var lockOwner=$routeParams.lockOwner;
		var lockStatus=$routeParams.lockStatus;
		var goodsTypeID=$routeParams.goodsTypeID;
		var findParms=eval('(' + $routeParams.obj + ')');
		$scope.quoteRadio={isChecked:'1'};//默认选中报价成功
		$scope.showSuccessTable=true;
		listQuoteDetail();
		
		
		
		$scope.goTo=function(add){
		      $location.path(add);
		    };
		    
		/**
		 * 获取报价单详情
		 */
		function listQuoteDetail() {
			$http({
				method: 'post',
				data: {
					ticket: $scope.ticket,
					domain:  $scope.domain,
					lockOwner:lockOwner,
					lockStatus:lockStatus,
					quotationID:quotationID
				},
				url: serverUrl + 'orderManager/detailQuotation'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.quoteDetail=response.data.data;
					$scope.currCarOwner=response.data.data.carOwnerInfo.carOwner;
					$scope.currGoodsTypeName=response.data.data.goodsTypeName;
					var am=response.data.data.amount;
						if(am=='0'||am=='0.00'){
							$scope.ttbQuoteInput="";
						}else{
							$scope.ttbQuoteInput=response.data.data.amount;
						}
				
					$scope.kindList=response.data.data.kindList;
					$scope.kindLength=response.data.data.kindList.length;
					document.getElementById("getTableInfo").innerHTML=getTabel(response.data.data.kindList);
					if(response.data.data.quotationStatus=="3"){
						$scope.showFailDialog=true;
						$scope.showSuccessTable=false;
						$scope.quoteRadio={isChecked:'0'};//默认选中报价成功
						$scope.failDescription=response.data.data.failDescription;
					}
				}else {
					userAuth.isLogin(response.data);
					$scope.title = "提示";
					$scope.context = "加载报价单详情失败!";
					$scope.PopHide = true;
				}
			})
		}
		function getTabel(list){
			var flagArray1=new Array();
			var flagArray2=new Array();
			var flagArray3=new Array();
			var str="",tr1="",tr2="",tr3="";
			for(var k=0;k<list.length;k++){
				var amountShow=list[k].amountShow==undefined||list[k].amountShow==""?"":"("+list[k].amountShow+")";
				var td="<td><strong>"+list[k].kindName+amountShow+"</strong></td>";
				if(list[k].mainFlag=="1"){
					flagArray1.push(td);
				}else if(list[k].mainFlag=="2"){
					flagArray2.push(td);
				}else if(list[k].mainFlag=="3"){
					flagArray3.push(td);
				}
				
			}
			if(flagArray1.length>0){
				tr1="<tr><td>主险</td><td></td></tr>";
				for(var i=0;i<flagArray1.length;i++){tr1+=flagArray1[i];if(i%2==1){tr1+="</tr><tr>"}}
				tr1+="</tr>";
			}
			if(flagArray2.length>0){
				tr2="<tr><td>附加险</td><td></td></tr>";
			    for(var i=0;i<flagArray2.length;i++){tr2+=flagArray2[i];if(i%2==1){tr2+="</tr><tr>"}}
			    tr2+="</tr>";
			}
			if(flagArray3.length>0){
				tr3="<tr><td>不计免赔</td><td></td></tr>";
		        for(var i=0;i<flagArray3.length;i++){tr3+=flagArray3[i];if(i%2==1){tr3+="</tr><tr>"}}
			    tr3+="</tr>";
			}
		     str=tr1+tr2+tr3;
		    return str;
		}
		$scope.setInput=function (event){
		   //即时处理输入框的内容,比如进行某些运算
			 var k = event.keyCode;   //48-57是大键盘的数字键，96-105是小键盘的数字键
			 var FirstChar=$scope.ttbQuoteInput.substr(0,1);//获取文本首个字符
			 if(FirstChar=="0"||FirstChar=="."){//首位不能是0或.
				 $scope.ttbQuoteInput = "";
				 return false;
			 }
			 if ((k <= 57 && k >= 48) || (k <= 105 && k >= 96||k==110||k==190)||(event.ctrlKey&&k==67)||(event.ctrlKey&&k==86)){//k=110,190  (区分全键盘小键盘)是小数点
				 if($scope.ttbQuoteInput.indexOf(".")!=$scope.ttbQuoteInput.lastIndexOf(".")){//只能有一个小数点
					 $scope.ttbQuoteInput="";
					 return false;
				 }
				 var num=$scope.ttbQuoteInput;
				 if($scope.ttbQuoteInput.lastIndexOf(".")>0){//如果有小数点 只能输入两位小数
					 var sublen=num.substring(num.lastIndexOf(".")+1,num.length).length;
					 if(sublen>2){
						 $scope.ttbQuoteInput=num.substring(0,num.lastIndexOf(".")+3);//小数点第三位不能输入（保留两位）
						 return false;
					 }
				 }
			 }
			 //var a=/^[+-]{0,1}\d+(\.\d+){0,1}$/;//浮点数
			 var b=/^[\d]{1}([\d]|[\.])*$/;//筛选数字和小数点
			 if(!b.test($scope.ttbQuoteInput)){
				 $scope.ttbQuoteInput="";
				 return false;
			 }

		}

	       $scope.blurs=function(){//离开文本框  验证最后输入的一个值是否是"."
	    	  if($scope.ttbQuoteInput.lastIndexOf(".")==$scope.ttbQuoteInput.length-1){
	    		  var lastNum=$scope.ttbQuoteInput.substring(0,$scope.ttbQuoteInput.length-1);
	    		 $scope.ttbQuoteInput=lastNum;
	    	  }
	      }
		$scope.getFailTextarea=function(){
			$scope.showFailDialog=true;
			$scope.showSuccessTable=false;
		}
		$scope.getSuccessInput=function(){
			$scope.showSuccessTable=true;
			$scope.showFailDialog=false;
		}
		//重新填写
		$scope.reload=function(){
			$scope.showQuoteDialog=false;
		}
		//确认报价
		$scope.okQuote=function(quotationStatus){
			$http({
				method: 'post',
				data: {
					ticket: $scope.ticket,
					domain:  $scope.domain,
					quotationID:quotationID,
					lockStatus:lockStatus,
					quotationStatus:quotationStatus,
					goodsTypeID:goodsTypeID,
					failDescription:$scope.failDescription||"",
					businessInsurance:$scope.businessInsurance||"",
					trafficInsurance:$scope.trafficInsurance||"",
					kindList:$scope.kindList||"",
					amount:$scope.ttbQuoteInput
				},
				url: serverUrl + 'orderManager/editQuotation'
			}).then(function successCallback(response) {
				var obj=JSON.stringify(findParms);
				if (response.data.errorCode == 0) {
					$scope.quoteDetail=response.data.data;
					 if("3"==quotationStatus){
							$scope.divFShowError=true;
							$scope.isIntBgColorShow=true;
							$timeout(function(){$scope.divFShowError=false;$scope.isIntBgColorShow=false;$location.path('quoteManager/'+obj);},2000);//保存
						}else{
							$scope.showQuoteDialog=false;
							$location.path('quoteManager/'+obj);
							$location.replace();
						}
				} else {
					userAuth.isLogin(response.data);
					$scope.showQuoteDialog=false;
					$scope.quotationShowError=true;
					$scope.isIntBgColorShow=true;
					$timeout(function(){$scope.quotationShowError=false;$scope.isIntBgColorShow=false;$location.path('quoteManager/'+obj);},2000);//保存
				}
			})
		}
		$scope.onSubmitOK=function(){
			var currCheck=$scope.quoteRadio.isChecked;
			if("1"==currCheck){
				if($scope.ttbQuoteInput==""){
					$scope.divFShow=true;
					$scope.isIntBgColorShow=true;
					$timeout(function(){$scope.divFShow=false;$scope.isIntBgColorShow=false;},2000);//保存
					return false;
				}else{
					$scope.showQuoteDialog=true;
					var temp={"premium":$scope.ttbQuoteInput,"proposalNO":""};
					$scope.businessInsurance=temp;
				}
			}else{
				$scope.trafficInsurance="";
				$scope.businessInsurance="";
				$scope.kindList="";
				$scope.okQuote(3);
			}
			
		}
	});
