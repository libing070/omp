'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app
	.controller('gtposterCtrl', function($scope, $http, $timeout, serverUrl, showError, imgUrl,$location,userAuth) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		$scope.prefixUrl = imgUrl;


		/**
		 * 图片浮层展示
		 * @param {Object} src
		 * @param {Object} e
		 */
		$scope.show = function(src, e) {
			//console.log(e.target.getBoundingClientRect().left);
			$scope.showPos = {
				left: e.target.getBoundingClientRect().left + "px",
				top: e.target.getBoundingClientRect().top + 30 + "px"
			}
			$scope.showImg = true;
			$scope.showImgSrc = src;
		};

    $scope.goTo=function(add){
      $location.path(add);
    };

		$scope.hideImg = function() {
			$scope.showImg = false;
		};

    $scope.imgF=[];
		$scope.showImgSrc = "images/upload.png";
		$scope.setFiles = function(files) {
      var index = files.dataset.index;
      var id = files.dataset.cid;
      //console.log(e);
      //console.log(this.files[0].type);
      var file = files.files[0];

      var reader = new FileReader();
      reader.readAsDataURL(file);
      var img = new Image();
      reader.onloadend = function () {
        img.src = reader.result;
        console.info(file.size/1000);
        if ((file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") && file.size <= 300 * 1024) {
        //if ((file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") && file.size <= 300 * 1024 && img.width == 750 && img.height == 375) {
          var form = new FormData();
          form.append("fileName", file.name); // 可以增加表单数据
          form.append("fileSize", file.size); // 可以增加表单数据
          form.append("file", file);
          //console.log(form);
          var req = new XMLHttpRequest();
          req.open("post", imgUrl + 'upload');
          req.send(form);
          req.onreadystatechange = function () {
            if (req.readyState == 4 && req.status == 200) {
              console.log(req.responseText);
              var data = JSON.parse(req.responseText);
              var groupName = data.data.goupName;
              var remoteFileName = data.data.remoteFileName;
              var saveUrl = "/" + groupName + "/" + remoteFileName;
              var picUrl = imgUrl + groupName + "/" + remoteFileName;
              if (data.errorCode == 0) {
                //保存图片资源id 与 产品类别关系
                //$scope.imgF[index].width=img.width;
                //$scope.imgF[index].height=img.height;
                //$scope.imgF[index].fileSize=file.size/1000;
                $scope.imgF.push({index:parseInt(index)+1,width:img.width,height:img.height,fileSize:file.size/1000});
                $scope.goodsTypeList[index].groupName = groupName;
                $scope.goodsTypeList[index].remoteFileName = remoteFileName;
                $scope.goodsTypeList[index]["picUrl"] = picUrl;
                $scope.$apply();
              } else {
                $scope.popShow = true;
                $scope.context = "上传失败图片失败!";
              }

            }
          };
        } else {
          files.value = null;
          $scope.popShow = true;
          $scope.context = "图片尺寸要求：≤300K。请按照此规则上传图片!";
        }
      };
    };

		$scope.hasError = false;
		$scope.enterCity = false;

		function list() {
			$http({
				method: 'post',
				data: {ticket:$location.$$search.ticket,domain:$location.$$search.domain},
				url: serverUrl + 'systemManager/queryGoodsTypeList'
			}).then(function successCallback(response) {
				console.log('查询海报列表' + response.data.errorCode);
				if (response.data.errorCode == 0) {
					$scope.goodsTypeList = response.data.data;
          console.log(response.data.data);
					for(var i=0;i<$scope.goodsTypeList.length;i++){
						var goodsType = $scope.goodsTypeList[i];
						if(goodsType.groupName){
							goodsType.picUrl =imgUrl + goodsType.groupName + "/" + goodsType.remoteFileName;
						}
					}
				} else {
          userAuth.isLogin(response.data);
					showError.showErrorMsg('获取产品线海报列表失败');
				}
			}, function errorCallback(response) {
				showError.showErrorMsg('获取产品线海报列表失败--网络错误');
			});
		}
		list();

		//关闭模态框
		$scope.closePoster = function() {
			$scope.modalShow = false;
			$scope.modalPublish = false;
			$scope.modalNotPublish = false;
		};

		//关闭错误提示
		$scope.closeError = function() {
			$scope.hasError = false;
		};

		//判断是否可以发布
		$scope.modalShow = false;
		$scope.publishPoster = function() {
      //console.log($scope.imgF);
			var posterList = [];
			angular.forEach($scope.goodsTypeList, function(value) {
				var goodsTypeID = value.goodsTypeID;
				var groupName = value.groupName;
				var remoteFileName = value.remoteFileName;
				if (groupName) {
					posterList.push({
						goodsTypeID: goodsTypeID,
						groupName: groupName,
						remoteFileName: remoteFileName,
            //maxWidth:width,
            //maxHeight:height,
            //maxSize:fileSize
					});
				}
			});
      for(var i=0;i<$scope.imgF.length;i++){
        for(var j=0;j<posterList.length;j++){
          if($scope.imgF[i].index==posterList[j].goodsTypeID){
            posterList[j].maxWidth=$scope.imgF[i].width;
            posterList[j].maxHeight=$scope.imgF[i].height;
            posterList[j].maxSize=$scope.imgF[i].fileSize;
          }
        }
      }
      //console.log( posterList);
			$scope.posterList = posterList;
			if ($scope.posterList.length == $scope.goodsTypeList.length) {
				$scope.modalShow = true;
				$scope.modalPublish = true;
			} else {
				$scope.modalPublish = false;
				$scope.modalShow = true;
				$scope.modalNotPublish = true;
			}
		};
		//可以发布
		$scope.ensurePublish = function() {
			console.info($scope.posterList);
			$http({
				method: 'post',
				data: {
					posterList: $scope.posterList,ticket:$location.$$search.ticket,domain:$location.$$search.domain
				},
				url: serverUrl + '/systemManager/publishPosterOfGoodsType'
			}).then(function successCallback(response) {
				console.log('发布海报' + response.data.errorCode);
				if (response.data.errorCode == 0) {
					$scope.modalShow = false;
					$scope.modalPublish = false;
					$scope.modalAlreadyPublish = true;
					$timeout(function() {
						$scope.modalAlreadyPublish = false;
					}, 500);
					list();
				} else {
          userAuth.isLogin(response.data);
					$scope.modalShow = false;
					$scope.modalPublish = false;
					showError.showErrorMsg("发布失败");
				}
			}, function errorCallback(response) {
				$scope.modalShow = false;
				$scope.modalPublish = false;
				showError.showErrorMsg("发布失败-网络连接失败");
			});
		};

    $scope.cancel = function() {
      $scope.popShow = false;
    };

  });
