'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app
	.controller('rmposterCtrl', function($scope, $rootScope, $http, $timeout, $location, serverUrl, showError, imgUrl, userAuth) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];
		$scope.hasError = false;
		$scope.enterCity = false;
		$rootScope.ticket = $location.$$search.ticket || $rootScope.ticket;
		$rootScope.domain = $location.$$search.domain || $rootScope.domain;

		console.log($rootScope.ticket);
		console.log($rootScope.domain);

    $scope.goTo=function(add){
      $location.path(add);
    };

		$scope.cancel = function() {
			$scope.popShow = false;
		};


		function list() {
			$http({
				method: 'post',
				data: {
					ticket: $rootScope.ticket,
					domain: $rootScope.domain
				},
				url: serverUrl + 'systemManager/queryRecommendList'
			}).then(function successCallback(response) {
				console.log('查询海报列表' + response.data.errorCode);
				if (response.data.errorCode == 0) {
					$scope.posterList = response.data.data;
          console.info(response.data.data);
					$scope.recommendList = [];
					angular.forEach(response.data.data, function(value) {
						//console.log("value===============================");
						//console.log(value);

						if (value.valueName == undefined) {
							value.valueName = ' ';
						}
						if (value.priority == undefined) {
							value.priority = '1';
						}
						if (value.groupName) {
							value.picUrl = imgUrl + value.groupName + "/" + value.remoteFileName;
						}
						$scope.recommendList.push(value);
					});

				} else {
					userAuth.isLogin(response.data);
				}
			}, function errorCallback(response) {
				$scope.popShow = true;
				$scope.context = "获取推荐区海报列表失败!";
			});
			console.log('-=-=-=');
			console.log($scope.recommendList);
		}
		list();



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
			};
			$scope.showImg = true;
			$scope.showImgSrc = src;
		};


		$scope.hideImg = function() {
			$scope.showImg = false;
		};

    $scope.imgF=[];
		$scope.showImgSrc = "images/upload.png";
		$scope.setFiles = function(files) {

			var index = files.dataset.index;
			var id = files.dataset.cid;
			var file = files.files[0];

			var reader = new FileReader();
			reader.readAsDataURL(file);
			var img = new Image();

			reader.onloadend = function() {
				img.src = reader.result;
				img.onload = function() {
					console.info(file.size/1000);
					//if ((file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") && file.size <= 300 * 1024 && img.width == 750 && img.height == 375) {
					if ((file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") && file.size <= 300 * 1024) {
						var form = new FormData();
						form.append("fileName", file.name); // 可以增加表单数据
						form.append("fileSize", file.size); // 可以增加表单数据
						form.append("file", file);
						//console.log(form);
						var req = new XMLHttpRequest();
						req.open("post", imgUrl + 'upload');
						req.send(form);
						req.onreadystatechange = function() {
							if (req.readyState == 4 && req.status == 200) {
								console.log(req.responseText);
								var data = JSON.parse(req.responseText);
								var groupName = data.data.goupName;
								var remoteFileName = data.data.remoteFileName;
								var saveUrl = "/" + groupName + "/" + remoteFileName;
								var picUrl = imgUrl + groupName + "/" + remoteFileName;
								if (data.errorCode == 0) {
									//保存图片资源id 与 产品类别关系
                  $scope.imgF.push({width:img.width,height:img.height,fileSize:file.size/1000,remoteFileName:remoteFileName});
									$scope.recommendList[index].groupName = groupName;
									$scope.recommendList[index].remoteFileName = remoteFileName;
									$scope.recommendList[index]["picUrl"] = picUrl;
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
				}

			}


		};


		$scope.modalShow = false;
		$scope.publishPoster = function() {
      console.log($scope.imgF);
			var hasPic = [];
			$scope.recommendList.forEach(function(value) {
        console.log(value);
				if (value.groupName) {
					hasPic.push(value);
				}
			});
      for(var i=0;i<$scope.imgF.length;i++){
        for(var j=0;j<$scope.recommendList.length;j++){
          if($scope.imgF[i].remoteFileName==$scope.recommendList[j].remoteFileName){
            $scope.recommendList[j].maxWidth=$scope.imgF[i].width;
            $scope.recommendList[j].maxHeight=$scope.imgF[i].height;
            $scope.recommendList[j].maxSize=$scope.imgF[i].fileSize;
          }
        }
      }
			if (hasPic.length == 0) {
				$scope.modalNullPublish = true;
			} else {
				$scope.modalShow = true;
				$scope.modalPublish = true;
			}
		};


		$scope.closePoster = function() {
			$scope.modalShow = false;
			$scope.modalPublish = false;
			$scope.modalNullPublish = false;
		};

		$scope.closeError = function() {
			$scope.hasError = false;
		};


		//确认发布
		$scope.ensurePublish = function() {
      console.log($scope.recommendList);
			$http({
				method: 'post',
				data: {
					posterList: $scope.recommendList,
					ticket: $rootScope.ticket,
					domain: $rootScope.domain
				},
				url: serverUrl + '/systemManager/publishPosterOfRecommend'
			}).then(function successCallback(response) {
				console.log(response.data.errorCode);
				if (response.data.errorCode == 0) {
					$scope.modalShow = false;
					$scope.modalPublish = false;
					$scope.modalAlreadyPublish = true;
					$timeout(function() {
						$scope.modalAlreadyPublish = false;
					}, 2000);
					list();
				} else {
					userAuth.isLogin(response.data);
					$scope.modalShow = false;
					$scope.modalPublish = false;
					$scope.popShow = true;
					$scope.context = "发布失败!";
				}
			}, function errorCallback(response) {
				$scope.modalShow = false;
				$scope.modalPublish = false;
				$scope.popShow = true;
				$scope.context = "发布失败-网络连接失败!";
			});

		};

		//排序


		$scope.sortText = "编辑排序";
		$scope.canSort = true;
		$scope.sort = function() {
			$scope.canSort = false;
		};

		$scope.enterSortNumber = function() {
			$scope.sortNull = false;
			$scope.sortInt = true;
		};

		$scope.sortInt = true;
		$scope.saveSort = function() {
			var recommendSort = [];
			var readySort = true;
			$scope.posterList.forEach(function(value) {
				$scope.recommendID = value.recommendID;
				if (/^[\s]?$/.test(value.priority)) {
					readySort = false;
					$scope.sortNull = true;
				} else if (/^[1-9][0-9]{0,4}$/.test(value.priority)) {
					$scope.priority = value.priority;
					recommendSort.push({
						recommendID: $scope.recommendID,
						priority: $scope.priority
					});
				} else {
					readySort = false;
					$scope.sortInt = false;
				}
			});
			console.log(recommendSort);
			if (readySort) {
				$http({
					method: 'post',
					data: {
						recommendSort: recommendSort,
						ticket: $rootScope.ticket,
						domain: $rootScope.domain
					},
					url: serverUrl + '/systemManager/updatePriorityOfRecommend'
				}).then(function successCallback(response) {
					console.log('排序' + response.data.errorCode);
					if (response.data.errorCode == 0) {
						console.log(recommendSort);
						$scope.sortText = '编辑排序';
						$scope.canSort = true;
						//list();
					} else {
						userAuth.isLogin(response.data);
						showError.showErrorMsg('推荐区海报排序失败');
					}
				}, function errorCallback(response) {
					showError.showErrorMsg('推荐区海报排序失败--网络错误');
				});
			}
		};


		//删除推荐海报
		$scope.delRecommend = function(recommendID) {
			$scope.recommendIDs = recommendID;
			$scope.modalShow = true;
			$scope.modalDel = true;
		};
		$scope.closeModalDel = function() {
			$scope.modalShow = false;
			$scope.modalDel = false;
		};

		$scope.ensureModalDel = function() {
			$http({
				method: 'post',
				data: {
					recommendID: $scope.recommendIDs,
					ticket: $rootScope.ticket,
					domain: $rootScope.domain
				},
				url: serverUrl + '/systemManager/deleteRecommend'
			}).then(function successCallback(response) {
				console.log('删除推荐区海报' + response.data.errorCode);
				if (response.data.errorCode == 0) {
					$scope.modalShow = false;
					$scope.modalDel = false;
					$scope.modalAlreadyDel = true;
					$timeout(function() {
						$scope.modalAlreadyDel = false
					}, 2000);
					list();
				} else {
					userAuth.isLogin(response.data);
					showError.showErrorMsg('删除推荐区海报失败');
				}
			}, function errorCallback(response) {
				showError.showErrorMsg('删除推荐区海报失败--网络错误');
			});
		};
	});
