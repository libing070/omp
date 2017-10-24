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
  .controller('JYKCtrl', function ($rootScope, $scope,$http, $routeParams, $location,$timeout,serverUrl, imgUrl, showError,userAuth) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.goTo=function(add){
      $location.path(add);
    };
   $scope.closeModal=function(){
     $scope.modalDel=false;
   };
    //查询精友库DB文件列表
    function list(){
      $http({
        method: 'post',
        data: {ticket:$location.$$search.ticket,domain:$location.$$search.domain},
        url: serverUrl+'/systemManager/listjykCar'
      }).then(function successCallback(response) {
        console.log('获取精友库文件列表：'+response.data.errorCode);
        if(response.data.errorCode==0){
          console.info(response.data.data);
          $scope.files = response.data.data;
          $scope.files.forEach(function(value){
            if(value.status==1 || value.status=='1'){
              value.statusT='草稿';
            }else{
              value.statusT='已发布';
            }
          });

        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('获取精友库文件列表失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('获取精友库文件列表失败--网络错误');
      });
    }
    list();

    //删除
    $scope.delFile=function(id){
      $scope.id=id;
      $scope.modalDel=true;
    };
    //确认删除
  $scope.ensureDelFile=function(){
    $http({
      method: 'post',
      data: {id:$scope.id,ticket:$location.$$search.ticket,domain:$location.$$search.domain},
      url: serverUrl+'/systemManager/deletejykCar'
    }).then(function successCallback(response) {
      console.log('删除：'+response.data.errorCode);
      if(response.data.errorCode==0){
        list();
        $scope.modalDel=false;
        $scope.modalAlreadyDel=true;
        $timeout(function(){
          $scope.modalAlreadyDel=false;
        },2000);
      }else if(response.data.errorCode==7101){
        $scope.modalDel=false;
        $scope.NoCFile=true;
        $scope.errorTip="该精友库文件非草稿状态，不允许删除、编辑";
      }else{
        userAuth.isLogin(response.data);
        showError.showErrorMsg('删除精友库文件失败');
      }
    }, function errorCallback(response) {
      showError.showErrorMsg('删除精友库文件失败--网络错误');
    });
  };

    //发布
  $scope.publishFile=function(){
  var cList=[];
  $scope.files.forEach(function(value){
    if(value.status=='1' || value.status==1){
      $scope.publishID=value.id;
      cList.push(value);
    }
  });
    console.log('cList===');
    console.log(cList);
    if(cList.length==0){
        $scope.NoCFile=true;
      $scope.errorTip="无草稿状态的文件可发布";
    }else{
      $http({
        method: 'post',
        data: {id:$scope.publishID,ticket:$location.$$search.ticket,domain:$location.$$search.domain},
        url: serverUrl+'/systemManager/publishjykCar'
      }).then(function successCallback(response) {
        console.log('发布：'+response.data.errorCode);
        if(response.data.errorCode==0){
            $scope.modalAlreadyPub=true;
          $timeout(function(){
            $scope.modalAlreadyPub=false;
          },2000);
          list();
        }else{
          userAuth.isLogin(response.data);
          showError.showErrorMsg('发布精友库文件失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('发布精友库文件失败--网络错误');
      });
    }
};

    //上传文件
    $scope.uploadFile=function(id,name,gname,fname,ticket,domain){
      $http({
        method: 'post',
        data: {
          id:id,
          name:name,
          groupName:gname,
          remoteFileName:fname,
          ticket: ticket,
          domain: domain
        },
        url: serverUrl + '/systemManager/addjykCar'
      }).then(function successCallback(response) {
        console.log('编辑：' + response.data.errorCode);
        if (response.data.errorCode == 0) {
          $scope.fileID = response.data.data.id;
          console.log($scope.fileID);
          list();
        } else if(response.data.errorCode == 7102){
          $scope.NoCFile=true;
          $scope.errorTip="精友库文件名称重复，请更改名称后再上传";
        }else {
          userAuth.isLogin(response.data);
          showError.showErrorMsg('编辑友库文件失败');
        }
      }, function errorCallback(response) {
        showError.showErrorMsg('编辑精友库文件失败--网络错误');
      });
      $scope.$apply();
    };
    $scope.setFiles = function(files) {
      var id = files.dataset.cid;
      var file = files.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        var form = new FormData();
        form.append("fileName", file.name); // 可以增加表单数据
        form.append("fileSize", file.size); // 可以增加表单数据
        form.append("file", file);
        var req = new XMLHttpRequest();
        req.open("post", imgUrl + 'upload');
        req.send(form);
        req.onreadystatechange = function () {
          if (req.readyState == 4 && req.status == 200) {
            console.log(req.responseText);
            var data = JSON.parse(req.responseText);
            var groupName = data.data.goupName;
            var remoteFileName = data.data.remoteFileName;
            if (data.errorCode == 0) {
                $scope.files.forEach(function(value){
                    if(value.status==1 || value.status=='1'){
                      $scope.fileID=value.id;
                      $scope.edit=true;
                    }
                });
              if($scope.edit){
                $scope.uploadFile($scope.fileID,file.name,groupName,remoteFileName,$location.$$search.ticket,$location.$$search.domain);
              }else{
                $scope.uploadFile('',file.name,groupName,remoteFileName,$location.$$search.ticket,$location.$$search.domain);
              }
              }
          }else{
            files.value = null;
          }
        }
      };
    };

      //下载文件
    $scope.getXML=function(httpUrl){
      $scope.httpUrl=imgUrl+httpUrl;
      window.location.href = $scope.httpUrl;
    };

    $scope.closeModal=function(){
      $scope.NoCFile=false;
      $scope.modalDel=false;
    }

  });


