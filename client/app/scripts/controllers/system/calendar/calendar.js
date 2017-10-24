/**
 * Created by Administrator on 2015/12/30.
 */
/**
 * Created by Administrator on 2015/12/9.
 */
/**
 * Created by Administrator on 2015/12/8.
 */
/**
 * Created by Administrator on 2015/12/8.
 */
/**
 * Created by Administrator on 2015/12/4.
 */
'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app
  .controller('calendarCtrl', function ($rootScope, $scope,$http, $routeParams, $location,$timeout,$q,serverUrl, imgUrl, showError,userAuth) {
	  $rootScope.ticket=$location.$$search.ticket || $rootScope.ticket;
	    $rootScope.domain=$location.$$search.domain || $rootScope.domain;
      $scope.isActive=2;
      $scope.daysShort=dates['zh-CN'].days.slice(1,8);
      $scope.months=dates['zh-CN'].monthsNums;
      var   d=new Date();
    var currentDate= d.getFullYear()+"-"+(d.getMonth()+1)+"-"+ d.getDate()+" ";
    $scope.currDay=d;
      var month=d.getMonth()+1;
      month=month>9?month+"":"0"+month;
      var days_=d.getDate()>9?d.getDate()+"":"0"+d.getDate();
      $scope.currentDate_ = (d.getFullYear()+"-"+month+"-"+days_);
      $scope.monthSelect=month;
      $scope.isActive= d.getFullYear();
      $scope.list=function list(status){
    	  if(status=="changeYears"){
    		  if($scope.isActive==d.getFullYear()){//如果是当前年份 ,月份从当前月开始
    			  $scope.isActive=d.getFullYear();
    			  var m_=d.getMonth()+1;
    			  $scope.monthSelect=m_>9?m_+"":"0"+m_;
    		  }else if($scope.isActive==(d.getFullYear()+1)){//如果不是当前年份 （即下一年）月份从1月开始
    			  $scope.isActive=d.getFullYear()+1;
    			  $scope.monthSelect="01";
    		  }
    	  }
    	  setLtOrGtDisabled($scope.monthSelect);
        getWorkTime();
        $http({
          method:"post",
          data:{month: $scope.isActive+"-"+$scope.monthSelect,ticket:$rootScope.ticket,domain:$rootScope.domain},
          url:serverUrl+"/systemManager/listScheduling"
        }).then(function successCallback(response){
            if(response.data.errorCode==0){
            	month=parseInt($scope.monthSelect);
              $scope.listArr=response.data.data;

            }else {
              showError.showErrorMsg("获取列表数据失败");
            }
        },function errorCallback(){
          showError.showErrorMsg("获取列表数据失败——网络连接失败");
        });

      };
      $scope.list();
 
    function  getWorkTime(){
      $http({
        method:"post",
        data:{ticket:$rootScope.ticket,domain:$rootScope.domain},
        url:serverUrl+"systemManager/getWorkingTime"
      }).then(function successCallback(response){
        if(response.data.errorCode==0){
          $scope.datesWork.startDate=moment(currentDate+response.data.data.workingStart);
          $scope.datesWork.endDate=moment(currentDate+ response.data.data.workingEnd);
        }else {
          showError.showErrorMsg("获取工作时间设置数据失败");
        }
      },function errorCallback(){
        showError.showErrorMsg("获取工作时间设置数据失败——网络连接失败");

      });
        $scope.changeBymonthSelect=$scope.monthSelect;//当前选中的月份
        $scope.currMonth=month;//当前系统月份
        if($scope.isActive==d.getFullYear()){//本年的做处理
        	if(d.getMonth()+1>$scope.monthSelect){
        		$scope.isDisabled=true;
        		$scope.currStatusCss={
        				"background" : "#e7e8ec",
        				"border":"1px solid #e7e8ec"
        		};
        	}else{
        		$scope.isDisabled=false;
        		$scope.currStatusCss={
        				"background" : "#ff9100",
        				"border":"1px solid #ff9100"
        		};
            }
        }
        else{//非本年
        	$scope.isDisabled=false;
        	$scope.currStatusCss={
    				"background" : "#ff9100",
    				"border":"1px solid #ff9100"
    		};
        }
    }

    $scope.currListLoad=function(){
    	$scope.selectItem.schedulingID="";
    	 if((currentDate!=undefined)&&(""!=currentDate)){
	        	$scope.bg = [];
	        	$scope.bg[currentDate] ='';
     }
    	$scope.list();
    	$scope.calCancle=false;$scope.setWork=false;
    }
    $scope.datesWork = {
      today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
      minDate: moment(currentDate+"09:00"),
      maxDate: moment(currentDate+"18:00"),
    };

    $scope.datesChange = {
      today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
      minDate: moment(currentDate+" 09:00"),
      maxDate: moment(currentDate+" 18:00"),
    };

    $scope.$watch('datesChange.endDate', function() {
      if($scope.selectItem.scheduleType==3){
        $scope.selectItem.workingEnd=$scope.datesChange.endDate.format("HH:mm");
      }
      $scope.datesChange.maxDate = $scope.datesChange.endDate ||$scope.datesChange.maxDate;
      $scope.$broadcast('pickerUpdate', ['startDate'], {
        maxDate: $scope.datesChange.endDate,
      });
    });
    $scope.$watch('datesChange.startDate', function() {
      if($scope.selectItem.scheduleType==3){
        $scope.selectItem.workingStart=$scope.datesChange.startDate.format("HH:mm");
      }
      $scope.datesChange.minDate = $scope.datesChange.startDate || $scope.datesChange.minDate;
      $scope.$broadcast('pickerUpdate', ['endDate'], {
        minDate: $scope.datesChange.startDate,
      });
    });
    
    $scope.setDatePickerPosition=function(){
    	document.getElementById('date-box').style.left=""; 
    	document.getElementById('date-box').style.top=""; 
       // document.querySelector(".firstSetDate").setAttribute("ng-show","firstSetDate");
    //	document.getElementById('firstSetDate').setAttribute("ng-disabled","firstSetDate");
    	//console.log(document.querySelector(".firstSetDate").innerHTML);
    	var div = document.getElementById('date-box');
    	/*console.log($scope.firstSetDate+"之前");
        //if($scope.firstSetDate==undefined){
        	$scope.firstSetDate=false;
    		console.log($scope.firstSetDate+"之后");
    	//}
*/    	
        var width = div.style.width || div.clientWidth || div.offsetWidth || div.scrollWidth; //div宽度;
        var left=div.getBoundingClientRect().left;//div左边位置
        var screen=document.body.clientWidth
        if(width+left>screen){
        	document.getElementById('date-box').style.right="-70px"; 
        }
    }
    
    
    //翻页处理
    $scope.backOrGoMonths=function(status){
    	if("back"==status){
    		if(month>1){--month;}
    	}else if("go"==status){
    		if(month<12){++month;}
    	}
    	setLtOrGtDisabled(month);
    	$scope.monthSelect=(month>9?month+"":"0"+month).toString();
    	$scope.list();
    }
    
    function setLtOrGtDisabled(month){
    	if(month==1){
    		$scope.setLtDisabled=true;}
    	if(month>1){
    		$scope.setLtDisabled=false;
    	}
    	if(month==12){
    		$scope.setGtDisabled=true;
    	}
    	if(month<12){
    		$scope.setGtDisabled=false;
    		
    	}
    }
    //编辑隐藏翻页按钮
    $scope.onHidenPage=function(){
    	getWorkTime();
    	if((currentDate!=undefined)&&(""!=currentDate)){
        	$scope.bg = [];
        	$scope.bg[currentDate] ='';
          }
    	$scope.setLtDisabled=true;
    	$scope.setGtDisabled=true;
    };
    
    $scope.refreshWorkTime=function(){
    	
    }
    $scope.$watch('datesWork.endDate', function() {
      $scope.datesWork.maxDate = $scope.datesWork.endDate ||$scope.datesWork.maxDate;
      $scope.$broadcast('pickerUpdate', ['workStartDate'], {
        maxDate: $scope.datesWork.endDate,
      });
    });
    $scope.$watch('datesWork.startDate', function() {
      $scope.datesWork.minDate = $scope.datesWork.startDate || $scope.datesWork.minDate;
      $scope.$broadcast('pickerUpdate', ['workEndDate'], {
        minDate: $scope.datesWork.startDate,
      });
    });
    $scope.generate=function(){
      $http({
        method:"post",
        data:{schedulingTime: $scope.isActive+"-"+$scope.monthSelect,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url:serverUrl+"/systemManager/createScheduling"
      }).then(function successCallback(response){
        if(response.data.errorCode==0){
          $scope.list();
        }else {
          showError.showErrorMsg("提交失败");
        }
      },function errorCallback(){
        showError.showErrorMsg("提交失败——网络连接失败");
      });
    };

    $scope.setWorkTime=function(){
    	$scope.setDateSuccess=true;
    	$scope.setDateBox=false;
    };
    
    $scope.okSetDate=function(){
    	$scope.divFShowSave=true;
    	$scope.isIntBgColorShow=true;
    	$scope.setDateSuccess=false;
    	$http({
    		method:"post",
    		data:{workingStart: $scope.datesWork.startDate.format("HH:mm"),workingEnd:$scope.datesWork.endDate.format("HH:mm"),ticket:$rootScope.ticket,domain:$rootScope.domain},
    		url:serverUrl+"/systemManager/setWorkingTime"
    	}).then(function successCallback(response){
    		if(response.data.errorCode==0){
    			$scope.setDateBox=false;
    		$timeout(function(){$scope.divFShowSave=false;$scope.isIntBgColorShow=false;},2000);//保存
    		}else {
    			showError.showErrorMsg("提交失败===");
    		}
    	},function errorCallback(){
    		showError.showErrorMsg("提交失败——网络连接失败");
    	});
    };
 
    $scope.exitSetDate=function(){
    	$scope.setDateSuccess=false;
    	$scope.setDateBox=true;
    }
  
    $scope.exitFirstD=function(){
    	//$scope.showDateExit=true;
    	$scope.setDateBox=false;
    }
    $scope.calSetDate=function(){
    	$scope.setDateBox=true;
    	$scope.showDateExit=false;
    }
    $scope.okokSetDate=function(){
     	$scope.showDateExit=false;
    	$scope.divFShowSave=false;
    	$scope.isIntBgColorShow=false;
    }
    $scope.setWork=false;
    $scope.selectItem={};
    $scope.setWorkDay=function(id,day_){
       var day__ = new Date(Date.parse(day_));
       var   d1=new Date();
       var y=d1.getFullYear();//获取当前年份
       var m=d1.getMonth();//获取当前月份
            var d=d1.getDate();//获取当前几号
            var clickYear=day__.getFullYear();//获取点击年份
            var clickMon=day__.getMonth();//获取点击的月份
            var clickDay=day__.getDate();//获取点击的几号 
            if(clickYear==y&&clickMon<m){
               /* $scope.setDateBoxDay=true;
                $scope.hasErrorDay=function(){
                     $scope.setDateBoxDay=false;
            };*/   
            }else if(clickYear==y&&clickMon==m&&clickDay<=d){
            	if($scope.setWork){//编辑的时候才提示
            		/*$scope.setDateBoxDay_=true;
            		$scope.hasErrorDay=function(){
            			$scope.setDateBoxDay_=false;
            		};*/
            	}
            }
     if(day__<=d1){$scope.isDisabledDay=true;}else{$scope.isDisabledDay=false;
           if(!id||!$scope.setWork){return false;}
          $scope.listArr.some(function(item){
           return item.some(function(data){
            if(data.schedulingID==id){
              $scope.selectItem=data;
              if(data.scheduleType==3){
                $scope.datesChange.startDate=moment(currentDate+data.workingStart);
                $scope.datesChange.endDate=moment(currentDate+data.workingEnd);
              }
              return true;
            }
          });
        });
      }
    };
    $scope.isCurrent = function(day){
        if((day!=undefined)&&(""!=day)&&$scope.setWork&&$scope.currentDate_<day){//编辑的时候才有边框
        	$scope.bg = [];
        	$scope.bg[day] ='addCurrTdBorderColor';
        }
    }
    $scope.selectType=function(){
       $scope.isChecked=false;
        if(!$scope.selectItem.schedulingID){
        	$scope.confirmShowError=true;
             return  $scope.hasErrorDay=function(){
                  $scope.confirmShowError=false;
                 return;
            };
        }
        if(!$scope.selectItem.workingStart){
          $scope.datesChange = {
            today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
            minDate: moment(currentDate+" 09:00"),
            maxDate: moment(currentDate+" 18:00"),
          };
          $scope.selectItem.workingStart=moment(currentDate+" 09:00").format("HH:mm");
          $scope.selectItem.workingEnd=moment(currentDate+" 18:00").format("HH:mm");
        }
    };

    $scope.saveCal=function(){
    	if($scope.datesChange.maxDate<=$scope.datesChange.minDate){
    		  $scope.setDateBoxDay__=true;
              $scope.hasErrorDay=function(){
                     $scope.setDateBoxDay__=false;
                     return;
            };
    	}else{
    		$scope.divFShow=true;
    		$scope.isIntBgColorShow=true;
    		$timeout(function(){$scope.divFShow=false;$scope.isIntBgColorShow=false;},1000);
    		$timeout(function(){$scope.divFShowSucc=true;$scope.isIntBgColorShow=true;},1000);
    		
    	}
      $scope.saveCalPop=false;
      var settings=[];
      $scope.listArr.forEach(function(data){
        data.forEach(function(item){
          if(item.schedulingID){
            if(item.scheduleType==3){
              settings.push(item);
            }else {
              settings.push({
            	scheduleDate:item.scheduleDate,
                schedulingID:item.schedulingID,
                scheduleType:item.scheduleType,
              });
            }

          }
        });
      });
   var currentDate_=currentDate.substring(0,currentDate.lastIndexOf("-"));//去掉天;
    $http({
        method:"post",
        data:{month:currentDate_,settings:settings,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url:serverUrl+"/systemManager/updateScheduling"
      }).then(function successCallback(response){
        if(response.data.errorCode==0){
        	$timeout(function(){$scope.divFShowSucc=false;$scope.isIntBgColorShow=false;},2000);//发布成功
		        if((currentDate!=undefined)&&(""!=currentDate)){
		        	$scope.bg = [];
		        	$scope.bg[currentDate] ='';
            }
		        $scope.selectItem.schedulingID="";
               $scope.list();
               $scope.setWork=false;
               $location.reload();
        }else {
          showError.showErrorMsg("提交失败");
        }
      },function errorCallback(){
        showError.showErrorMsg("提交失败——网络连接失败");
      });
    }

  });


