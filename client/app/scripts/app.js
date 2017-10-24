'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */

var app=angular
  .module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'bw.paging',
    'datePicker'
  ]);
app
.constant('serverUrl', "http://127.0.0.1:8010/jsse/")
//.constant('serverUrl', "http://192.168.1.136:8080/jsse/")
   //.constant('serverUrl', "http://192.168.1.96:8080/jsse/")
 //.constant('serverUrl', "http://113.108.40.12:12010/jsse/")
  .constant('imgUrl', "http://113.108.40.12:12010/miResourceMgr/")
  .constant('mapUrl', "http://113.108.40.12:12010/")
/*  .constant('payPrimiumURL', "http://113.108.40.12:12010/jsse/SL_PEM/thirdPay/toPay.do")
  .constant('pageURL', "http://113.108.40.12:12010/jsse/orderManager/payPremiumForProposal")*/


  .run(['$rootScope', '$location', function($rootScope, $location){
    $rootScope.$on('$routeChangeStart', function(evt, next, current){
      if(window.sessionStorage.getItem("token")=="false"){
        window.location.href="login.html";
      }
      console.log('route begin change');
      //console.log(evt);
      //console.log(next);
      //console.log(current);
    });
  }])
  .run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function(evt, current, previous) {

      console.log('route have already changed');
    });
  }])
   .config(["$routeProvider",function ($routeProvider) {
     $routeProvider
       .when('/index', {
         templateUrl: 'views/index.html',
         controller: 'indexCtrl',
         controllerAs: 'index'
       })
       //商品系列
       .when('/city', {
         templateUrl: 'views/goods/city.html',
         controller: 'CityCtrl',
         controllerAs: 'City'
       })
       //供应商
       .when('/supplier', {
         templateUrl: 'views/goods/supplier.html',
         controller: 'SupplierCtrl',
         controllerAs: 'Supplier'
       })
       .when('/addSupplier/:ticket/:domain', {
         templateUrl: 'views/goods/suppliers/addSupplier.html',
         controller: 'AddSupplierCtrl',
         controllerAs: 'AddSupplier'
       })
       .when('/delSupplier', {
         templateUrl: 'views/goods/suppliers/delSupplier.html',
         controller: 'DelSupplierCtrl',
         controllerAs: 'DelSupplier'
       })
       .when('/editSupplier/:id/:ticket/:domain', {
         templateUrl: 'views/goods/suppliers/editSupplier.html',
         controller: 'EditSupplierCtrl',
         controllerAs: 'EditSupplier'
       })
       .when('/supplierKind/:id/:ticket/:domain', {
         templateUrl: 'views/goods/suppliers/supplierKind.html',
         controller: 'SupplierKindCtrl',
         controllerAs: 'SupplierKind'
       })

       //产品与供应商关系
       .when('/suppagoods', {
         templateUrl: 'views/goods/suppAgoods/suppagoods.html',
         controller: 'SupplierAndGoodsCtrl',
         controllerAs: 'SupplierAndGoods'
       })
       .when('/addsuppagoods/:ticket/:domain', {
         templateUrl: 'views/goods/suppAgoods/addsuppagoods.html',
         controller: 'AddSupplierAndGoodsCtrl',
         controllerAs: 'AddSupplierAndGoods'
       })
       .when('/editsuppagoods/:goodsTypeID/:cityID/:supplierID/:goodsTypeCitySupplierRelID/:ticket/:domain', {
         templateUrl: 'views/goods/suppAgoods/editsuppagoods.html',
         controller: 'EditSupplierAndGoodsCtrl',
         controllerAs: 'EditSupplierAndGoods'
       })

       //保障方案
       .when('/support', {
         templateUrl: 'views/goods/support/support.html',
         controller: 'SupportCtrl',
         controllerAs: 'Support'
       })
       .when('/addsupport/:ticket/:domain', {
         templateUrl: 'views/goods/support/addsupport.html',
         controller: 'AddSupportCtrl',
         controllerAs: 'AddSupport'
       })
       .when('/editsupport/:id/:name/:ticket/:domain', {
         templateUrl: 'views/goods/support/editsupport.html',
         controller: 'EditSupportCtrl',
         controllerAs: 'EditSupport'
       })
       //商品管理
       .when('/goodscontrol', {
         templateUrl: 'views/goods/goodsControl/goodscontrol.html',
         controller: 'GoodsControlCtrl',
         controllerAs: 'GoodsControl'
       })
       .when('/addgoods/:ticket/:domain', {
         templateUrl: 'views/goods/goodsControl/addgoods.html',
         controller: 'AddGoodsCtrl',
         controllerAs: 'AddGoods'
       })
       .when('/editgoods/:id/:number/:name/:typeID/:typeName/:description/:insureTypeName/:insureType/:protectPlanID/:minIntervalTime/:minDay/:serviceRate/:protectPlanName/:plaa/:status/:ticket/:domain', {
         templateUrl: 'views/goods/goodsControl/editgoods.html',
         controller: 'EditGoodsCtrl',
         controllerAs: 'EditGoods'
       })
       .when('/goodsupdatepicture/:id/:ticket/:domain', {
         templateUrl: 'views/goods/goodsControl/goodsupdatepicture.html',
         controller: 'UpdatePictureCtrl',
         controllerAs: 'UpdatePicture'
       })
       
       //推荐商品管理
       .when('/recommendgoods', {
         templateUrl: 'views/goods/recommendGoods/recommendgoods.html',
         controller: 'RecommendGoodsControlCtrl',
         controllerAs: 'RecommendGoodsControl'
       })

       //产品海报管理
       .when('/gtposter', {
         templateUrl: 'views/system/productPoster/gtposter.html',
         controller: 'gtposterCtrl',
         controllerAs: 'system'
       })
       //推荐区海报管理
       .when('/rmposter', {
         templateUrl: 'views/system/recommendPoster/rmposter.html',
         controller: 'rmposterCtrl',
         controllerAs: 'system'
       })
       //新增推荐区海报
       .when('/addrmposter/:ticket/:domain', {
         templateUrl: 'views/system/recommendPoster/addrmposter.html',
         controller: 'addrmposterCtrl',
         controllerAs: 'system'
       })
       //编辑推荐区海报
       .when('/editrmposter/:recommendID/:recommendName/:recommendType/:valueName/:valueID/:ticket/:domain', {
         templateUrl: 'views/system/recommendPoster/editrmposter.html',
         controller: 'EditrmposterCtrl',
         controllerAs: 'EditrmposterCtrl'
       })
       //设置活动
       .when('/setactivity/:ticket/:domain', {
         templateUrl: 'views/system/recommendPoster/setactivity.html',
         controller: 'SetactivityCtrl',
         controllerAs: 'system'
       })
       .when('/uploadPoster/:id/:name/:ticket/:domain', {
         templateUrl: 'views/system/recommendPoster/uploadPoster.html',
         controller: 'uploadPosterCtrl',
         controllerAs: 'uploadPoster'
       })
       //平台属性设置
       .when('/platnature', {
         templateUrl: 'views/system/platNature/platnature.html',
         controller: 'PlatnatureCtrl',
         controllerAs: 'Platnature'
       })
       //订单
       .when('/orderManager', {
         templateUrl: 'views/order/orderManager/orderManager.html',
         controller: 'orderManagerCtrl',
         controllerAs: 'orderManager'
       })
        .when('/quoteManager', {
         templateUrl: 'views/order/quoteManager/quoteManager.html',
         controller: 'quoteManagerCtrl',
         controllerAs: 'quoteManager'
       })
       .when('/ttbEditManager/:quotationID/:lockOwner/:lockStatus/:goodsTypeID/:ticket/:domain', {
    	   templateUrl: 'views/order/quoteManager/ttbEditManager.html',
    	   controller: 'ttbEditManagerCtrl',
    	   controllerAs: 'ttbEditManager'
       })
       .when('/cxbtEditManager/:quotationID/:lockOwner/:lockStatus/:goodsTypeID/:ticket/:domain', {
    	   templateUrl: 'views/order/quoteManager/cxbtEditManager.html',
    	   controller: 'cxbtEditManagerCtrl',
    	   controllerAs: 'cxbtEditManager'
       })
       .when('/jqxEditManager/:quotationID/:lockOwner/:lockStatus/:goodsTypeID/:ticket/:domain', {
    	   templateUrl: 'views/order/quoteManager/jqxEditManager.html',
    	   controller: 'jqxEditManagerCtrl',
    	   controllerAs: 'jqxEditManager'
       })
       .when('/refusePolicy', {
         templateUrl: 'views/order/refusePolicy/refusePolicy.html',
         controller: 'refusePolicyCtrl',
         controllerAs: 'refusePolicy'
       })
       .when('/errorProposal', {
         templateUrl: 'views/order/errorProposal/errorProposal.html',
         controller: 'errorProposalCtrl',
         controllerAs: 'errorProposal'
       })
       .when('/prePayProposal', {
         templateUrl: 'views/order/prePayProposal/prePayProposal.html',
         controller: 'prePayProposalCtrl',
         controllerAs: 'prePayProposal'
       })
       .when('/expressPolicy', {
         templateUrl: 'views/order/expressPolicy/expressPolicy.html',
         controller: 'expressPolicyCtrl',
         controllerAs: 'expressPolicy'
       })

//     .when('/orderStatistics', {
//       templateUrl: 'views/order/statistics/index.html',
//       controller: 'orderStatisticsCtrl',
//       controllerAs: 'orderStatisticsCtrl'
//     })


       //费用
       .when('/listSettlement', {
         templateUrl: 'views/fee/listSettlement.html',
         controller: 'listSettlementCtrl',
         controllerAs: 'listSettlement'
       })
       .when('/listPaymentDetail', {
         templateUrl: 'views/fee/listPaymentDetail.html',
         controller: 'listPaymentDetailCtrl',
         controllerAs: 'listPaymentDetail'
       })
       //用户系列
       //用户查询
       .when('/user', {
         templateUrl: 'views/user/user.html',
         controller: 'UserCtrl',
         controllerAs: 'User'
       })
       .when('/detailuser/:userID/:domain/:ticket', {//用户详情
         templateUrl: 'views/user/userControl/detailuser.html',
         controller: 'DetailUserCtrl',
         controllerAs: 'DetailUser'
       })
       .when('/billdetail/:hirePurchaseAgreementID/:domain/:ticket', {//用户详情--账单详情
         templateUrl: 'views/user/userControl/billdetail.html',
         controller: 'BillDetailCtrl',
         controllerAs: 'BillDetail'
       })
       .when('/kinddetail/:goodsOrderID/:domain/:ticket', {//用户详情--保障详情
         templateUrl: 'views/user/userControl/kinddetail.html',
         controller: 'KindDetailCtrl',
         controllerAs: 'KindDetail'
       })
       //逾期未还款
       .when('/delay_first', {//首次未还款 和 二次未还款
         templateUrl: 'views/user/delay/firstpay.html',
         controller: 'FirstPayCtrl',
         controllerAs: 'FirstPay'
       })
//     .when('/statistics', {//用户统计
//       templateUrl: 'views/user/statistics/index.html',
//       controller: 'UserStatisticsCtrl',
//       controllerAs: 'UserStatistics'
//     })
       //精友库文件更新
       .when('/JYK', {
         templateUrl: 'views/system/JYK.html',
         controller: 'JYKCtrl',
         controllerAs: 'JYK'
       })
  		//calendar
       .when('/calendar', {
         templateUrl: 'views/system/calendar/calendar.html',
         controller: 'calendarCtrl',
         controllerAs: 'calendar'
       })
	   
  		//h5Record
       .when('/h5Record', {
         templateUrl: 'views/h5record/recordManager/recordManager.html',
         controller: 'recordCtrl',
         controllerAs: 'recode'
       })
        //用户分析
       .when('/userAnalysis', {
        	 templateUrl: 'views/operation/userAnalysis/userAnalysis.html',
        	 controller: 'userAnalysisCtrl',
        	 controllerAs: 'userAnalysis'
         })
       //运营分析
       .when('/operationAnalysis', {
           templateUrl: 'views/operation/operationAnalysis/operationAnalysis.html',
           controller: 'operationAnalysisCtrl',
           controllerAs: 'operationAnalysis'
         })

       .otherwise({
         redirectTo: '/index'
       });

   }]);


