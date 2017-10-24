/**
 * Created by libing on 2016/4/13.
 */
'use strict';

app
	.controller('cxbtEditManagerCtrl', function($scope,$rootScope,$compile,$routeParams, $http, $timeout, $location, serverUrl, openCity, userAuth) {
	
		   $scope.ticket=$location.$$search.ticket;
		   $scope.domain=$location.$$search.domain;
			var quotationID=$routeParams.quotationID;
			var lockOwner=$routeParams.lockOwner;
			var lockStatus=$routeParams.lockStatus;
			var goodsTypeID=$routeParams.goodsTypeID;
			var findParms=eval('(' + $routeParams.obj + ')');
			$scope.quoteRadio={isChecked:'1'};//默认选中报价成功
			$scope.showSuccessDialog=true;
			listQuoteDetail();
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
						$scope.kindList=response.data.data.kindList;
						$scope.kindListLength=response.data.data.kindList.length;
						for(var i=0;i<response.data.data.kindList.length;i++){
							if(i%2==1){
								$scope.kindList[i].class="quoteTrRightCss";
							}else{
								$scope.kindList[i].class="quoteTrLeftCss";
							}
							if($scope.kindList[i].mainFlag==1){
								$scope.zhuxianShow=true;
							}else if($scope.kindList[i].mainFlag==2){
								$scope.fujiaxianShow=true;
							}else if($scope.kindList[i].mainFlag==3){
								$scope.bujimianpeiShow=true;
							}
						}
						if(response.data.data.businessInsurance!=undefined&&response.data.data.businessInsurance!=""){
							var parms1=eval('(' + response.data.data.businessInsurance + ')');
							$scope.syPremium=parms1.premium;
							$scope.syProposalNO=parms1.proposalNO;
						}
						if(response.data.data.trafficInsurance!=undefined&&response.data.data.trafficInsurance!=""){
							var parms2=eval('(' + response.data.data.trafficInsurance + ')');
							$scope.jqxPremium=parms2.premium;
							$scope.jqxSumTravelTax=parms2.sumTravelTax;
							$scope.jqxProposalNO=parms2.proposalNO;
						}
						$scope.currCarOwner=response.data.data.carOwnerInfo.carOwner;
						$scope.currGoodsTypeName=response.data.data.goodsTypeName;
						
						if(response.data.data.quotationStatus=="3"){
							for(var i=0;i<$scope.kindListLength;i++){
					    		  $scope.kindList[i].premium="";
					    		  $scope.kindList[i].disabled=true;
								  $scope.kindList[i].kindListStyle={"border":""};
								}
							$scope.showFailDialog=true;
							$scope.showSuccessDialog=false;
							$scope.quoteRadio={isChecked:'0'};
							$scope.failDescription=response.data.data.failDescription;
						}
					} else {
						userAuth.isLogin(response.data);
						$scope.title = "提示";
						$scope.context = "加载报价单详情失败!";
						$scope.PopHide = true;
					}
				})
			}
			 $scope.setInput=function(event,th){
				 var k = event.keyCode;   //48-57是大键盘的数字键，96-105是小键盘的数字键
				 var FirstChar=th.kind.premium.substr(0,1);//获取文本首个字符
				 if(FirstChar=="0"||FirstChar=="."){//首位不能是0或.
					 th.kind.premium= "";
					 return false;
				 }
				 if ((k <= 57 && k >= 48) || (k <= 105 && k >= 96||k==110||k==190)||(event.ctrlKey&&k==67)||(event.ctrlKey&&k==86)){//k=110,190  (区分全键盘小键盘)是小数点
					 if(th.kind.premium.indexOf(".")!=th.kind.premium.lastIndexOf(".")){//只能有一个小数点
						 th.kind.premium="";
						 return false;
					 }
					 var num=th.kind.premium;
					 if(th.kind.premium.lastIndexOf(".")>0){//如果有小数点 只能输入两位小数
						 var sublen=num.substring(num.lastIndexOf(".")+1,num.length).length;
						 if(sublen>2){
							 th.kind.premium=num.substring(0,num.lastIndexOf(".")+3);//小数点第三位不能输入（保留两位）
							 return false;
						 }
					 }
				 }
				 var b=/^[\d]{1}([\d]|[\.])*$/;//筛选数字和小数点
				 if(!b.test(th.kind.premium)){
					 th.kind.premium="";
					 return false;
				 }
			}
			
			 
			 $scope.$watch('kindList', changeCurrValues, true);// 监听显示表格的数据，如果修改了就调用changeCurrValues的方法
		      function changeCurrValues() {
		        $scope.preferential = 0;
		        //var temp= /^[0-9]+.?[0-9]*$/;;
		        for (var i = 0; i < $scope.kindListLength; i++) {
		          var p = $scope.kindList[i].premium;
		          if (p!=undefined&&p != null) {
		            $scope.preferential += ($scope.kindList[i].premium-0);
		          }
		        }
		      }
		      
		       $scope.blurs=function(num,th){//离开文本框  验证最后输入的一个值是否是"."
		    	 var currNum=num==0?th.kind.premium:num==1?$scope.syPremium:num==2?$scope.jqxPremium:$scope.jqxSumTravelTax;
		    	  if(currNum!=undefined&&currNum.lastIndexOf(".")==currNum.length-1){
		    		  var lastNum=currNum.substring(0,currNum.length-1);
		    		  if(num==0){th.kind.premium=lastNum;}
		    		  else if(num==1)
		    		  {$scope.syPremium=lastNum;}
		    		  else if(num==2)
		    		  {$scope.jqxPremium=lastNum;}
		    		  else if(num==3)
		    		  {$scope.jqxSumTravelTax=lastNum;}
		    	  }
		      }
		      $scope.getFailTextarea=function(){
		    	  for(var i=0;i<$scope.kindListLength;i++){
		    		  $scope.kindList[i].premium="";
		    		  $scope.kindList[i].disabled=true;
					  $scope.kindList[i].kindListStyle={"border":""};
					}
					$scope.showFailDialog=true;
					$scope.showSuccessDialog=false;
					$scope.preferential=0;
				}
				$scope.getSuccessInput=function(){
					for (var i = 0; i < $scope.kindListLength; i++) {
						$scope.kindList[i].disabled=false;
					}
					$scope.showSuccessDialog=true;
					$scope.showFailDialog=false;
				}
				
				//重新填写
				$scope.reload=function(){
					$scope.showQuoteDialog=false;
				}
				$scope.goTo=function(add){
				      $location.path(add);
				    };
				    var kindList_="";
				    $scope.onSubmitOK=function(){
						var currCheck=$scope.quoteRadio.isChecked;
						if("1"==currCheck){
							if(toVaild()){
								$scope.showQuoteDialog=true;
								$scope.businessInsurance={"premium":$scope.syPremium||"","proposalNO":$scope.syProposalNO||""};
								$scope.trafficInsurance={"premium":	$scope.jqxPremium||"","sumTravelTax":$scope.jqxSumTravelTax||"","proposalNO":$scope.jqxProposalNO||""};
								$scope.amount=Number($scope.businessInsurance.premium)+Number($scope.trafficInsurance.premium)+Number($scope.trafficInsurance.sumTravelTax);
								if($scope.kindListLength>0){
									var arrayObj = new Array();
									for(var i=0;i<$scope.kindListLength;i++){
										var temp={kindID:$scope.kindList[i].kindID,kindName:$scope.kindList[i].kindName,premium:$scope.kindList[i].premium};
										arrayObj.push(temp);
									}
									kindList_=arrayObj;
								}
								$scope.failDescription="";
							};
						}else{
							$scope.businessInsurance="";
							$scope.trafficInsurance="";
							kindList_="";
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
								kindList:kindList_||"",
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
									$timeout(function(){$scope.divFShow=false;$scope.isIntBgColorShow=false;$location.path('quoteManager/'+obj);;},2000);//保存
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
								$timeout(function(){$scope.divFShowError=false;$scope.isIntBgColorShow=false;$location.path('quoteManager/'+obj);;},2000);//保存
							}
						})
					}
				    
		 function toVaild(){
			 for(var i=0;i<$scope.kindListLength;i++){
				if($scope.kindList[i].premium==undefined||$scope.kindList[i].premium==""){
					$scope.kindList[i].kindListStyle={"border":"1px solid red"};
					return false;
				}else{
					$scope.kindList[i].kindListStyle={"border":""};
				}
			 }
				    var	syPremium=$scope.syPremium||"";
				    var syProposalNO=$scope.syProposalNO||"";
				    var jqxPremium=$scope.jqxPremium||"";
				    var jqxProposalNO=$scope.jqxProposalNO||"";
				    var jqxSumTravelTax=$scope.jqxSumTravelTax||"";
				    if(syPremium ==""){
				    	$scope.syPremiumStyle={"border":"1px solid red"};
				    	return false;
				    }else{
				    	$scope.syPremiumStyle={"border":""};
				    }
				    if(syProposalNO==""){
				    	$scope.syProposalNOStyle={"border":"1px solid red"};
				    	return false;
				    }else{
				    	$scope.syProposalNOStyle={"border":""};
				    }
				    var notFill=(jqxPremium==""&&jqxProposalNO==""&&jqxSumTravelTax=="");
				    if(!notFill){
				    	if(jqxPremium!=""&&jqxProposalNO!=""&&jqxSumTravelTax!=""){
				    		if(jqxPremium!="")$scope.jqxPremiumStyle={"border":""};
				    		if(jqxProposalNO!="")$scope.jqxProposalNOStyle={"border":""};
				    		if(jqxSumTravelTax!="")$scope.jqxSumTravelTaxStyle={"border":""};
				    		$scope.jqxPremiumShow=true;
				    		$scope.jqxSumTravelTaxShow=true;
				    		//alert("都要填ok");
				    	}else{
				    		//alert("都要填");
				    		if(jqxPremium==""){$scope.jqxPremiumStyle={"border":"1px solid red"};}else{$scope.jqxPremiumStyle={"border":""}}
				    		if(jqxProposalNO==""){$scope.jqxProposalNOStyle={"border":"1px solid red"};}else{$scope.jqxProposalNOStyle={"border":""}}
				    		if(jqxSumTravelTax==""){$scope.jqxSumTravelTaxStyle={"border":"1px solid red"};}else{$scope.jqxSumTravelTaxStyle={"border":""}}
				    		return false;
				    	}
				    }else{
				    	//alert("都不填ok");
				    	$scope.jqxPremiumStyle={"border":""};
			    		$scope.jqxProposalNOStyle={"border":""};
			    		$scope.jqxSumTravelTaxStyle={"border":""};
			    		$scope.jqxPremiumShow=false;
			    		$scope.jqxSumTravelTaxShow=false;
				    }
				return true;
			 }
		 
		 $scope.setSyInput=function (event,currnum){
			 $scope.curr=currnum==1?$scope.syPremium:currnum==2?$scope.jqxPremium:$scope.jqxSumTravelTax;
			 var k = event.keyCode;  
			 var k = event.keyCode;   //48-57是大键盘的数字键，96-105是小键盘的数字键
			 var FirstChar=$scope.curr.substr(0,1);//获取文本首个字符
			 if(FirstChar=="0"||FirstChar=="."){//首位不能是0或.
				 if(currnum==1){$scope.syPremium="";}else if(currnum==2){$scope.jqxPremium="";}else if(currnum==3){$scope.jqxSumTravelTax="";}
				 return false;
			 }
			 if ((k <= 57 && k >= 48) || (k <= 105 && k >= 96||k==110||k==190)||(event.ctrlKey&&k==67)||(event.ctrlKey&&k==86)){//k=110,190  (区分全键盘小键盘)是小数点
				 if($scope.curr.indexOf(".")!=$scope.curr.lastIndexOf(".")){//只能有一个小数点
					 if(currnum==1){$scope.syPremium="";}else if(currnum==2){$scope.jqxPremium="";}else if(currnum==3){$scope.jqxSumTravelTax="";}
					 return false;
				 }
				 if($scope.curr.lastIndexOf(".")>0){//如果有小数点 只能输入两位小数
					 var num=$scope.curr;
					 var sublen=num.substring(num.lastIndexOf(".")+1,num.length).length;
					 if(sublen>2){
						 var index_=num.substring(0,num.lastIndexOf(".")+3);//小数点第三位不能输入（保留两位）
						 if(currnum==1){$scope.syPremium=index_;}else if(currnum==2){$scope.jqxPremium=index_;}else if(currnum==3){$scope.jqxSumTravelTax=index_;}
						 return false;
					 }
				 }
			 }
			 var b=/^[\d]{1}([\d]|[\.])*$/;//筛选数字和小数点
			 if(!b.test($scope.curr)){
				 if(currnum==1){$scope.syPremium="";}else if(currnum==2){$scope.jqxPremium="";}else if(currnum==3){$scope.jqxSumTravelTax="";}
				 return false;
			 }
		}
	});

