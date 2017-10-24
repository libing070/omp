'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app
  .controller('UpdatePictureCtrl', function($scope, $http, $routeParams, $rootScope, $location, $timeout, imgUrl, serverUrl, showError, userAuth) {
    $scope.ticket = $routeParams.ticket || $rootScope.ticket;
    $scope.domain = $routeParams.domain || $rootScope.domain;
    $scope.goodsCurrentStatus = ['草稿', '上架', '灰度上架', '下架'];
    $scope.goodsID = $routeParams.id; //商品ID
    var details = [];
    var goodsImg = {};

    $scope.goTo = function(add) {
      $location.path(add);
    };

    goodsImg.httpUrl = "images/upload.png";
    goodsImg.goodsImagesRelID = "";
    $scope.disabled = true;
    $scope.sortText = "删除和排序";

    $scope.cancel = function() {
      $scope.popShow = false;
    };

    $scope.hidePop = function() {
      $scope.showPop = false;
    };

    $scope.noUpload = function() {
      $scope.showPop = false;
      $location.path("goodscontrol");
    };

    //完成按钮
    $scope.finish = function() {
      if (!$scope.status || $scope.status == 1) { //商品为草稿状态时
        isUploadComplete();
      } else {
        $location.path("goodscontrol");
        $location.replace();
      }

    };
    function list() {
      $http({
        method: 'post',
        data: {
          goodsID: $scope.goodsID,
          ticket: $scope.ticket,
          domain: $scope.domain
        },
        url: serverUrl + 'goodsManager/getResourceOfGoods'
      }).then(function successCallback(response) {
        if (response.data.errorCode == 0) {
          var imageList = response.data.data.imageList;
          $scope.status = response.data.data.goodsStatus;
          console.info(imageList);
          console.info($scope.status);
          if (imageList.length > 0) {
            imageList.forEach(function(value) {
              console.log(value.resourcesType);
              switch (value.resourcesType) {
                case "1": //1商品头图
                  value.res=value.httpUrl;
                  value.httpUrl = imgUrl + value.httpUrl;
                  $scope.goodsImg = value;
                  break;
                case "2": //2详情页详细图
                  value.res=value.httpUrl;
                  value.httpUrl = imgUrl + value.httpUrl;

                  if (value.priority != '') {
                    value.priority = parseInt(value.priority);
                    console.info(value.priority);
                  }
                  $scope.details.push(value);
                  break;
              }

            });

          }

        } else {
          userAuth.isLogin(response.data);
          $scope.popShow = true;
          $scope.context = "获取商品图片信息失败!";
        }
      }, function errorCallback() {
        $scope.popShow = true;
        $scope.context = "获取商品图片数据失败——网络连接失败!";
      });
    }


    $scope.del = function(index) {
      if ($scope.status != 1 && $scope.details.length == 1) {
        $scope.popShow = true;
        $scope.context = "商品为" + $scope.goodsCurrentStatus[$scope.status - 1] + "状态，不能删除最后一张图片，请更换图片";
      } else {
        var fileID = $scope.details[index].httpUrl.slice(imgUrl.length);
        if(fileID.substring(0,1)=="/"){
        	fileID = fileID.slice(1);
        }
        $http({
          method: 'get',
          data:null,
          url: imgUrl + 'delete?fileID='+fileID
        }).then(function successCallback(response) {
          if (response.data.errorCode == 0) {
            $http({
              method: 'post',
              data: {
                goodsID: $scope.goodsID,
                goodsImagesRelID: $scope.details[index].goodsImagesRelID,
                ticket: $scope.ticket,
                domain: $scope.domain
              },
              url: serverUrl + 'goodsManager/deleteResourceOfGoods'
            }).then(function successCallback(response) {
              if (response.data.errorCode == 0) {
                $scope.disabled = false;
                $scope.sortText = "保存";

                $scope.details.splice(index, 1);
                if ($scope.details.length == 0) {
                  $scope.disabled = true;
                }
                $scope.popShow = true;
                $scope.context = "删除成功";
              } else {
                userAuth.isLogin(response.data);
                $scope.popShow = true;
                $scope.context = "删除失败";
              }

            })
          } else {
            userAuth.isLogin(response.data);
            $scope.popShow = true;
            $scope.context = "图片资源删除失败";
          }

        });

      }

    };




    /**
     * 图片排序
     */
    $scope.sort = function() {
      var imagesSort = new Array();
      $scope.details.forEach(function(value) {
        var tmp = {};
        tmp.goodsImagesRelID = value.goodsImagesRelID;
        tmp.priority = value.priority || '';
        imagesSort.push(tmp);
      });
      console.info($scope.details);
      if ($scope.details.length < 1) {
        $scope.popShow = true;
        $scope.context = "请上传图片";
      } else {
        if ($scope.sortText == "删除和排序") {
          $scope.disabled = false;
          $scope.sortText = "保存";
        } else {
          $http({ //保存[删除和排序]
            method: 'post',
            data: {
              imagesSort: imagesSort,
              ticket: $scope.ticket,
              domain: $scope.domain
            },
            url: serverUrl + 'goodsManager/updateImagePriorityForGoods'
          }).then(function successCallback(response) {
            if (response.data.errorCode == 0) {
              $scope.disabled = true;
              $scope.sortText = "删除和排序";

              $scope.popShow = true;
              $scope.context = "排序成功";
            } else {
              userAuth.isLogin(response.data);
              $scope.popShow = true;
              $scope.context = "排序失败";
            }
          }, function errorCallback() {
            $scope.popShow = true;
            $scope.context = "排序成功失败——网络连接失败";
          });
        }
      }

    };

    $scope.setFiles = function(files) {
      var goodsImagesRelID = files.dataset.cid;
      var nth = files.dataset.nth;
      var type = files.dataset.type;
      var file = files.files[0];
      var id = files.dataset.cid;
      //var index = files.dataset.index;


      var reader = new FileReader();
      reader.readAsDataURL(file);
      var img = new Image();

      reader.onloadend = function() {
        img.src = reader.result;
        if ((file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif")) {
          console.log(file.size / 1000);
          //if ((type == 1) && (file.size > 200 * 1024 || img.width != 200 || img.height != 200)) {
          if ((type == 1) && (file.size > 300 * 1024)) {
            files.value = null;
            $scope.context = "图片尺寸要求 : ≤300K。请按照此规则上传图片!";
            $scope.popShow = true;
            $scope.$apply();
          } else if ((type == 2) && (file.size > 500 * 1024)) {
            //} else if ((type == 2) && (file.size > 500 * 1024 || img.width != 750)) {
            files.value = null;
            $scope.context = "图片尺寸要求：≤500K。请按照此规则上传图片!";
            $scope.popShow = true;
            $scope.$apply();
          } else {
            //if (file.type == "image/jpeg" || file.type == "image/png") {
            var form = new FormData();
            form.append("fileName", file.name); // 可以增加表单数据
            form.append("fileSize", file.size); // 可以增加表单数据
            form.append("file", file);
            //console.log(form);
            var req = new XMLHttpRequest();
            req.open("post", imgUrl + 'upload');
            req.send(form);
            req.onreadystatechange = function() {
              angular.element(inputElem).val(null); //清空图片值
              if (req.readyState == 4 && req.status == 200) {
                var data = JSON.parse(req.responseText);
                var groupName = data.data.goupName;
                var remoteFileName = data.data.remoteFileName;
                var saveUrl = groupName + "/" + remoteFileName;
                var httpUrl = imgUrl + groupName + "/" + remoteFileName;
                if (data.errorCode == 0) {
                  $http({
                    method: 'post',
                    data: {
                      goodsImagesRelID: goodsImagesRelID,
                      goodsID: $scope.goodsID,
                      httpUrl: httpUrl,
                      groupName: groupName,
                      remoteFileName: remoteFileName,
                      maxWidth: img.width,
                      maxHeight: img.height,
                      maxSize: file.size / 1000,
                      resourcesType: type,
                      ticket: $scope.ticket,
                      domain: $scope.domain
                    },
                    url: serverUrl + 'goodsManager/editImageForGoods'
                  }).then(function successCallback(response) {
                    console.log(response.data.errorCode);
                    if (response.data.errorCode == 0) {
                      var goodsImagesRelID = response.data.data.goodsImagesRelID;
                      if (type == 1) {

                        if($scope.goodsImg.res){
                          var delUrl=$scope.goodsImg.res;
                                 //delUrl=delUrl.substr(delUrl.search(/group/),delUrl);

                          $http({
                            method: 'post',
                            url: imgUrl + 'delete?fileID='+delUrl.substr(delUrl.search(/group/),delUrl.length)
                          }).then(function successCallback(response) {
                            if (response.data.errorCode==0){
                              console.log("删除图片成功");
                            }else {
                              console.log("删除图片失败：————————————————————");
                              console.log(response);
                            }

                          });
                        }

                        //console.log($scope.goodsImg.httpUrl)
                        //console.log(httpUrl)
                        //console.log("$scope.goodsImg.httpUrl")

                        $scope.goodsImg.httpUrl = httpUrl;
                        $scope.goodsImg.res=saveUrl;
                        $scope.goodsImg.goodsImagesRelID = goodsImagesRelID;
                      } else { //2详情页详细图
                        console.log(nth);
                        if (nth == -1) {
                          var obj = {
                            "goodsImagesRelID": goodsImagesRelID,
                            "resourcesType": 2,
                            "httpUrl": httpUrl,
                            "priority": ''
                          };
                          console.log(obj);
                          $scope.details.push(obj)
                        } else {

                          if($scope.details[nth].res) {
                            var delUrl=$scope.details[nth].res;
                            $http({
                              method: 'post',
                              url: imgUrl + 'delete?fileID=' + delUrl.substr(delUrl.search(/group/),delUrl.length)
                            }).then(function successCallback(response) {
                              if (response.data.errorCode==0){
                                console.log("删除图片成功");
                              }else {
                                console.log("删除图片失败：————————————————————");
                                console.log(response);
                              }



                            });
                          }
                          $scope.details[nth].goodsImagesRelID = goodsImagesRelID;
                          $scope.details[nth].httpUrl = httpUrl;
                          $scope.details[nth].res = saveUrl;
                        }
                      }
                    } else {
                      userAuth.isLogin(response.data);
                      $scope.popShow = true;
                      $scope.context = "图片上传后关联失败";
                    }

                  }, function errorCallback() {
                    $scope.popShow = true;
                    $scope.context = "图片上传后关联失败——网络连接失败";
                  });

                } else {
                  $scope.popShow = true;
                  $scope.context = "上传失败图片失败";
                }
              }
            };
          }
        } else {
          $scope.popShow = true;
          $scope.context = "上传图片格式不支持";
          $scope.$apply();
        }

      };
    };


    // 判断当前商品所有类型图片是否完成 ，完成时自动更新商品的状态
    function isUploadComplete() {
      $http({
        method: 'post',
        data: {
          goodsID: $scope.goodsID,
          ticket: $scope.ticket,
          domain: $scope.domain
        },
        url: serverUrl + 'goodsManager/checkUploadFinishForGoods'
      }).then(function successCallback(response) {
        var result = response.data;
        if (result.errorCode == 0 && result.data == 'N') { // 完成
          $scope.showPop = true;
        } else {
          userAuth.isLogin(response.data);
          $location.path("goodscontrol");
          $location.replace();
        }
      }, function errorCallback(response) {
        $scope.popShow = true;
        $scope.context = "获取商品信息——网络连接失败";
      });
    }


    list();
    $scope.goodsImg = goodsImg;
    $scope.details = details;

  });
