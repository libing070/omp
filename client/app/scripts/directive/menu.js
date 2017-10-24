app.directive('menus',["$http","$rootScope","serverUrl" ,function($http,$rootScope,serverUrl) {
  return {
    restrict: 'EA',
    templateUrl: 'views/directive/menu.html',
    replace: true,
    link : function(scope, element, attrs) {

    //console.log("cc");
    //  $http({
    //    method: 'post',
    //    //data: queryParam,
    //    url: serverUrl + 'login/menu'
    //  }).then(function successCallback(response) {
    //        console.log(response.data.data);
    //    if(response.data.errorCode==0){
    //      scope.list=response.data.data;
    //      beActive(window.location.hash);
    //    }
    //  });

     scope.list = [
        {"name": "首页", "href": "#/index", "icon": "\ue607"}, {
          "name": "商品",
          "href": "#/city",
          "icon": "\ue60a",
          active:true,
          "sub": [{"name": "城市管理", "href": "#/city",active:true}, {"name": "供应商管理", "href": "#/supplier"}, {
            "name": "产品与供应商关系",
            "href": "#/suppagoods"
          }, {"name": "保障方案管理", "href": "#/support"}, {"name": "商品管理", "href": "#/goodscontrol"},{"name": "推荐商品管理", "href": "#/recommendgoods"}]
        }, {
          "name": "订单",
          "href": "#/orderManager",
          "icon": "\ue608",
          "sub": [{"name": "订单管理", "href": "#/orderManager"}, {
				"name" : "报价单管理",
				"href" : "#/quoteManager"
			}, {
            "name": "投保单拒保处理",
            "href": "#/refusePolicy"
          }, {"name": "人工出单", "href": "#/errorProposal"}, {
            "name": "投保单支付保费",
            "href": "#/prePayProposal"
          }, {"name": "保单申请快递", "href": "#/expressPolicy"}, {"name": "交易统计", "href": "#/orderStatistics"}]
        }, {
          "name": "费用",
          "href": "#/listSettlement",
          "icon": "\ue609",
          "sub": [{"name": "手续费结算", "href": "#/listSettlement"}, {"name": "收支管理", "href": "#/listPaymentDetail"}]
        }, {
          "name": "用户",
          "href": "#/user",
          "icon": "\ue60b",
          "sub": [{"name": "用户查询", "href": "#/user"}, {"name": "逾期未还款用户", "href": "#/delay_first"}]
        }, {
          "name": "设置",
          "href": "#/gtposter",
          "icon": "\ue60c",
          "sub": [{"name": "首页产品海报管理", "href": "#/gtposter"}, {
            "name": "推荐区海报管理",
            "href": "#/rmposter"
          }, {"name": "平台属性设置", "href": "#/platnature"},{"name": "精友库文件更新", "href": "#/JYK"},{"name": "工作排程设置", "href": "#/calendar"}]
        },{
            "name": "数据统计",
            "href": "#/operationAnalysis",
            "icon": "\ue60e",
            "sub": [{"name": "运营分析", "href": "#/operationAnalysis"},
                    {"name": "流量分析", "href": "#/flowAnalysis"},
                    {"name": "用户分析", "href": "#/userAnalysis"}
                    ]
          }];
      beActive(window.location.hash);
      window.onhashchange=function(){
        beActive(window.location.hash)
      };
      function beActive(href){
        angular.forEach(scope.list,function(value){
          if(value.href==href){
            value.active=true;
          }else {
            value.active=false;
          }
          if(value.sub&&value.sub.length>0){
            value.sub.forEach(function(item){
              if(item.href==href){
                item.active=true;
                value.active=true;
              }else {
                item.active=false;
              }
            })

          }

        });
      }
    }
  };
}]);
