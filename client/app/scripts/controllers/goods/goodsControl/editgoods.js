/**
 * Created by Administrator on 2015/12/9.
 */

app
  .controller('EditGoodsCtrl', function ($scope, $routeParams,$http, $rootScope,$timeout,$location,serverUrl,showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    //goodsID			//商品ID
    //goodsCustomNumber		//商品自定义编码
    //goodsName		//商品名称
    //goodsDescription    商品描述
    //goodsTypeID		产品线ID
    //insureType			保险种类
    //protectPlanID		保障方案ID
    //protectPlanID		起保间隔当天最小小时
    //minDay			购买最少天数
    //serviceRate		//服务费率
    //.when('/editgoods/:id$:number$:name$:typeID$:description$:insureType$:protectPlanID$:minIntervalTime$:minDay$:serviceRate$:protectPlanName$:plaa',

   $scope.ticket=$routeParams.ticket || $rootScope.ticket;
   $scope.domain=$routeParams.domain || $rootScope.domain;
    var goodsID=$routeParams.id;
    $scope.goodsID=goodsID;
    var goodsCustomNumber=$routeParams.number;
    $scope.goodsCustomNumber=goodsCustomNumber;
    var goodsName=$routeParams.name;
    $scope.goodsName=goodsName;
    var goodsTypeID=$routeParams.typeID;
    $scope.goodsTypeID	=goodsTypeID;
    var goodsTypeName=$routeParams.goodsTypeName;
    $scope.goodsTypeName	=goodsTypeName;
      console.log($scope.goodsTypeName);
    var goodsDescription=$routeParams.description;
    $scope.goodsDescription=goodsDescription;
    var insureTypeName=$routeParams.insureTypeName;
    $scope.insureTypeName=insureTypeName;
    var insureType=$routeParams.insureType;
    $scope.insureType=insureType;
    var protectPlanID=$routeParams.protectPlanID;
    $scope.protectPlanID=protectPlanID;
    //$routeParams.minIntervalTime值的后面会产生多的空格
    var minIntervalTime=$routeParams.minIntervalTime.trim();
    $scope.minIntervalTime=minIntervalTime;
    var minDay=$routeParams.minDay;
    $scope.minDay=minDay;
    var serviceRate=$routeParams.serviceRate;
    $scope.serviceRate=serviceRate;
    var protectPlanName=$routeParams.protectPlanName;
    $scope.protectPlanName=protectPlanName;
    var protectPlanID=$routeParams.plaa;
    $scope.protectPlanID=protectPlanID;
    var status=$routeParams.status;
    $scope.status=status;
    if($scope.status!="草稿"){
      $scope.forbidden=true;
    }

    $scope.hasError=false;
	 $scope.closeError=function(){
        $scope.hasError=false;
      };

    $scope.goTo=function(add){
      $location.path(add);
    };

    $scope.minIntervalTimeInt=true;
    $scope.minDayInt=true;
    $scope.serviceRateInt=true;
    //获取保险种类列表
    function typeKindList(){
      $http({
        method: 'post',
        data: {
        	codeType : 'insureType',ticket:$scope.ticket,domain:$scope.domain
        },
        url: serverUrl+'/systemManager/queryBaseCode'
      }).then(function successCallback(response){
        if(response.data.errorCode==0){
          $scope.typeKindList=response.data.data;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取保险种类列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取保险种类列表失败--网络错误');
      });
    }
    typeKindList();

    //获取险种方案列表
    function planKindList(){
      $http({
        method: 'post',
        data: {ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/protectManager/queryProtectPlanList'
      }).then(function successCallback(response){
        //console.log('险种方案查询'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.palnKindList=response.data.data;
          //console.log( $scope.palnKindList);
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取平台险种列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取平台险种列表失败--网络错误');
      });
    }
    planKindList();

    //获取产品线列表
    $scope.lineList=function(){
      $http({
        method: 'post',
        data: {ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/supplierRelationManager/queryAllGoodsType'
      }).then(function successCallback(response) {
        //console.log('产品线'+response.data.errorCode);
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
    $scope.lineList();

//判断必选项是否已输入,获取焦点事件
      $scope.code=function(){
        $scope.goodsCustomNumberNull=false;
        $scope.goodsNameNull=false;
        $scope.goodsTypeNull=false;
        $scope.goodsDescriptionNull=false;
        $scope.typeNull=false;
        $scope.minIntervalTimeNull=false;
        $scope.minDayNull=false;
        $scope.serviceRateNull=false;
      };
    //判断必填项是否已填
    $scope.canEdit=function() {
      $scope.canE = [];
      $scope.minIntervalTimeInt=true;
      $scope.minDayInt=true;
      $scope.serviceRateInt=true;
      if ($scope.goodsCustomNumber == "" || $scope.goodsCustomNumber == undefined) {
        $scope.goodsCustomNumberNull = true;
        $scope.canE.push(0);
      }
      if ($scope.goodsName == "" || $scope.goodsName == undefined) {
        $scope.goodsNameNull = true;
        $scope.canE.push(0);
      }
      if ($scope.goodsTypeID == "" || $scope.goodsTypeID == undefined) {
        $scope.goodsTypeNull = true;
        $scope.canE.push(0);
      }
      if ($scope.goodsDescription == "" || $scope.goodsDescription == undefined) {
        $scope.goodsDescriptionNull = true;
        $scope.canE.push(0);
      }
      if ($scope.insureType == "" || $scope.insureType == undefined) {
        $scope.typeNull = true;
        $scope.canE.push(0);
      }
      if ($scope.minIntervalTime == "" || $scope.minIntervalTime == undefined) {
        $scope.minIntervalTimeNull = true;
        $scope.canE.push(0);
      }else{
        $scope.minIntervalTimeInt=/^[1-9]([0-9])*(\s)*$/.test($scope.minIntervalTime);
        $scope.minIntervalTimeInt?$scope.canE.push(1):$scope.canE.push(0);
        console.log("=3=="+$scope.canE);
      }
      if ($scope.minDay == "" || $scope.minDay == undefined) {
        $scope.minDayNull = true;
        $scope.canE.push(0);
      }else{
        $scope.minDayInt=/^[1-9][0-9]*(\s)*$/.test($scope.minDay);
        $scope.minDayInt?$scope.canE.push(1):$scope.canE.push(0);
      }
      if ($scope.serviceRate == "" || $scope.serviceRate == undefined) {
        $scope.serviceRateNull = true;
        $scope.canE.push(0);
      }else{
        $scope.serviceRateInt=/^[0-9]+(\.[0-9]{0,2})?(\s)*$/.test($scope.serviceRate);
        console.log($scope.serviceRateInt);
        $scope.serviceRateInt?$scope.canE.push(1):$scope.canE.push(0);
      }
    };

    //编辑商品信息
    $scope.edit=function(){
      $scope.ensureEdit=true;
      $scope.canEdit();
      angular.forEach($scope.canE,function(value){
      	if(!value){
      		$scope.ensureEdit=false;
      	}
      });
      if($scope.ensureEdit==true){
      $http({
        method: 'post',
        data: {goodsID:$scope.goodsID,goodsCustomNumber:$scope.goodsCustomNumber,goodsName:$scope.goodsName,
          goodsDescription:$scope.goodsDescription,goodsTypeID:$scope.goodsTypeID,insureType	:$scope.insureType,
          protectPlanID:$scope.protectPlanID,minIntervalTime:$scope.minIntervalTime,minDay:$scope.minDay,serviceRate:$scope.serviceRate,
          ticket:$scope.ticket,domain:$scope.domain},
        url: serverUrl+'/goodsManager/updateGoodsBaseInfo'
      }).then(function successCallback(response){
        console.log('编辑商品信息'+response.data.errorCode);
        if(response.data.errorCode==0){
          $scope.saveGoods=true;
          $timeout(function(){
            $scope.saveGoods=false;
          },2000);
          $location.path('/goodsupdatepicture/'+$scope.goodsID+'/'+$scope.ticket+'/'+$scope.domain);
        }else if(response.data.errorCode==7011){
          $scope.showGoodsTip=true;
          $scope.GoodsCodeRepeat=true;
        }else if(response.data.errorCode==7012){
          $scope.showGoodsTip=true;
          $scope.GoodsNameRepeat=true;
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('编辑商品信息失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('编辑商品信息失败--网络错误');
      });
    }

    }

      $scope.closePop=function(){
          $scope.showGoodsTip=false;
          $scope.GoodsCodeRepeat=false;
          $scope.GoodsNameRepeat=false;
      };
  });

