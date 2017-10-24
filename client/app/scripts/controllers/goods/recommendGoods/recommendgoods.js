
'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app
  .controller('RecommendGoodsControlCtrl', function ($scope, $http,$rootScope,$location,$timeout,serverUrl,showError,userAuth) {

    $rootScope.ticket=$location.$$search.ticket || $rootScope.ticket;
    $rootScope.domain=$location.$$search.domain || $rootScope.domain;

    $scope.modalGoodsCannotHandle=false;
    $scope.hasError=false;
    $scope.closeError=function(){
      $scope.hasError=false;
    };
    
    $scope.goTo=function(add){
      $location.path(add);
    };
    
  //获取推荐商品列表
    function list(){
      $http({
        method: 'post',
        data: {ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/goodsManager/listRecommendGoods'
      }).then(function successCallback(response){
      	//console.log("response.data.errorCode="+response.data.errorCode)
        if(response.data.errorCode==0){
          if(response.data.data&&response.data.data.length>0){
            $scope.recommendGoodsList=response.data.data;
            angular.forEach( $scope.recommendGoodsList,function(value){
              if(value.priority==undefined){value.priority='1';}
              switch (value.goodsStatus){
                case "1":
                case 1:
                  value.goodsStatus='草稿';
                  break;
                case "2":
                case 2:
                  value.goodsStatus='正式上架';
                  break;
                case "3":
                case 3:
                  value.goodsStatus='灰度上架';
                  break;
                case "4":
                case 4:
                  value.goodsStatus='已下架';
                  break;
              }
            });
          }
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取推荐商品管理列表失败');
        }
      }, function errorCallback() {
        showError.showErrorMsg('获取推荐商品管理列表失败--网络错误');
      });

    }
    list();
   
    //查询推荐商品列表（已经上架跟灰度上架的）
    $scope.goodsList = function(){
    	var goodsStatus = new Array();
    	var tmpone = {};
        tmpone.gstatus = 2; //已经上架的
        goodsStatus.push(tmpone);
        var tmptwo = {};
        tmptwo.gstatus = 3; //灰度上架的
        goodsStatus.push(tmptwo);
        
        $http({
        	method:"post",
        	data:{
        		goodsStatus:goodsStatus,ticket:$rootScope.ticket,domain:$rootScope.domain
        	},
        	url:serverUrl+"/goodsManager/queryGoodsByStatus"
        }).then(function successCallback(response){
        	//console.log("查询推荐商品列表（已经上架跟灰度上架的）="+response.data.data.length);
        	if(response.data.errorCode==0){
        		$scope.goodsByStatusList = response.data.data;
        	}else{
        		showError.showErrorMsg("获取推荐商品列表失败");
        	}
        },function errorCallback(){
        	showError.showErrorMsg("获取推荐商品列表失败--网络错误");
        });
    }

    
    //获取产品线列表
    $scope.lineList=function(){
      $http({
        method: 'post',
        data: {ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/supplierRelationManager/queryAllGoodsType'
      }).then(function successCallback(response) {
        if(response.data.errorCode==0){
          $scope.lines = response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取产品线列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取产品线列表失败--网络错误');
      });
    };
    
    $scope.showGoods = function(){
    	$scope.goodsTypeNull = false;
        $scope.enterGoods = false;
	    $scope.enterAgain=false;
	    
	    $scope.showGoodsTypeID = "";
	    $scope.goodsID = "";
	    $scope.modalAdd=true;  //弹出新增框
	    
	    $scope.goodsList(); //推荐商品列表
	    $scope.lineList();  //呈现的产品类型列表
    }
    
    $scope.code = function(){  //获取焦点
    	$scope.goodsTypeNull = false;
        $scope.enterGoods = false;
	    $scope.enterAgain=false;
    }
    
    $scope.closeRecommendGoods = function(){  //取消新增推荐商品
    	$scope.goodsTypeNull = false;
        $scope.enterGoods = false;
	    $scope.enterAgain=false;
	    $scope.modalAdd = false;
    }
    
    $scope.addRecommendGoods = function(){  //新增推荐商品
      if($scope.showGoodsTypeID==undefined||$scope.showGoodsTypeID==""){
        $scope.goodsTypeNull=true;
      } else if($scope.goodsID==undefined||$scope.goodsID==""){
        $scope.enterGoods=true;
      } else {
//      console.log($scope.goodsTypeNull);
//      console.log($scope.goodsID);
        $http({
          method: 'post',
          data: {goodsID: $scope.goodsID,showGoodsTypeID:$scope.showGoodsTypeID,ticket:$rootScope.ticket,domain:$rootScope.domain},
          url: serverUrl + '/goodsManager/addRecommendGoods'
        }).then(function successCallback(response) {
          //console.log('新增推荐商品='+response.data.errorCode);
          if (response.data.errorCode == 0) {
            $scope.goodsTypeNull = false;
	        $scope.enterGoods = false;
		    $scope.enterAgain=false;
		    $scope.modalAdd = false;
		    $scope.modalGoodsAlreadyAdd=true;
            $timeout(function(){$scope.modalGoodsAlreadyAdd=false},2000);
		    list();
          }else if (response.data.errorCode == 7103) {
            $scope.enterAgain = true;
          }else {
            userAuth.isLogin(response.data);
            $scope.modalAdd = false;
            showError.showErrorMsg("添加推荐商品失败");
          }
        }, function errorCallback(response) {
          $scope.modalAdd = false;
          showError.showErrorMsg("添加推荐商品失败-网络连接失败");
        });
      }
    };
    
    //商品排序
    $scope.sortText="编辑排序";
    $scope.canSort=true;
    $scope.sort=function(){
        $scope.canSort=false;
    };

    $scope.saveSort=function(){
      $http({
        method: 'post',
        data: {sorts: $scope.recommendGoodsList,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl + '/goodsManager/sortRecommendGoods'
      }).then(function successCallback(response) {
        if (response.data.errorCode == 0) {
          //console.log('排序' + response.data.errorCode);
          $scope.sortText = '编辑排序';
          $scope.canSort = true;
        } else {
          userAuth.isLogin(response.data);
          showError.showErrorMsg('商品排序失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('商品排序失败--网络错误');
      });
    };

    //删除推荐商品
    $scope.delGoods=function(recommendGoodsID){
      $scope.modalGooodsDel=true;
      $scope.delrecommendGoodsID=recommendGoodsID;
    };
    $scope.ensureDelGoods=function(){
      $http({
        method: 'post',
        data: {recommendGoodsID:$scope.delrecommendGoodsID,ticket:$rootScope.ticket,domain:$rootScope.domain},
        url: serverUrl+'/goodsManager/deleteRecommendGoods'
      }).then(function successCallback(response){
        //console.log('删除推荐商品='+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.modalGooodsDel=false;
          $scope.modalGoodsAlreadyDel=true;
          $timeout(function(){$scope.modalGoodsAlreadyDel=false},2000);
          $scope.recommendGoodsList.forEach(function(value,index){
            if(value.recommendGoodsID==$scope.delrecommendGoodsID){
              $scope.recommendGoodsList.splice(index,1);
              return false;
            }
          });
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('删除推荐商品失败');
        }
      }, function errorCallback() {
        showError.showErrorMsg('删除推荐商品失败--网络错误');
      });
    };

    $scope.closemodalGoods=function(){  //取消删除
      $scope.modalGooodsDel=false;
    };

    $scope.showTip=function(){
      $scope.mouse=true;
    };
    $scope.hideTip=function(){
      $scope.mouse=false;
    };
    

  });
