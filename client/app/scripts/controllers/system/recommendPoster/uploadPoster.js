'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
app
	.controller('uploadPosterCtrl', function($scope, $http, $routeParams, $rootScope, $location, $timeout, imgUrl, serverUrl, showError, userAuth) {

		$scope.id = $routeParams.id; //活动ID
		$scope.name = $routeParams.name; //活动名称
		var details = [];
		var goodsImg = {};
    $scope.ticket = $routeParams.ticket || $rootScope.ticket;
    $scope.domain = $routeParams.domain || $rootScope.domain;

    $scope.goTo=function(add){
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
			$location.path("/setactivity/"+$scope.ticket+'/'+$scope.domain);
		};

		$scope.finish = function() {
			if (!$scope.details || $scope.details.length < 1) {
				$scope.showPop = true;
			} else {
				$location.path("/setactivity/"+$scope.ticket+'/'+$scope.domain);
			}
		};

		function list() {
			$http({
				method: 'post',
				data: {
					activityID: $scope.id,
					ticket: $scope.ticket,
					domain: $scope.domain
				},
				url: serverUrl + 'systemManager/getResourceOfActivity'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					var tem = response.data.data;
					if (tem.length > 0) {
						tem.forEach(function(value) {
							value.httpUrl = imgUrl + value.httpUrl;
							value.priority = parseInt(value.priority);
							$scope.details.push(value);
							console.info(value.httpUrl);
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
			$http({
				method: 'post',
				data: {
					activityID: $scope.id,
					activityImagesRelID: $scope.details[index].activityImagesRelID,
					ticket: $scope.ticket,
					domain: $scope.domain
				},
				url: serverUrl + 'systemManager/deleteResourceOfActivity'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.disabled = false;
					$scope.sortText = "保存";
					$scope.popShow = true;
					$scope.context = "删除成功";
					$scope.details.splice(index, 1);
					if ($scope.details.length == 0) {
						$scope.disabled = true;
					}
					console.info($scope.details);
				} else {
					userAuth.isLogin(response.data);
					$scope.popShow = true;
					$scope.context = "删除失败";
				}
			})
		};

		$scope.sort = function() {
			var imagesSort = new Array();
			$scope.details.forEach(function(value) {
				var tmp = {};
				tmp.activityImagesRelID = value.activityImagesRelID;
				tmp.priority = value.priority;
				if (!tmp.priority) {
					tmp.priority = '';
				}
				imagesSort.push(tmp);
			});
			if ($scope.details.length < 1) {
				$scope.popShow = true;
				$scope.context = "请上传图片";
			} else {
				if ($scope.sortText == "删除和排序") {
					$scope.disabled = false;
					$scope.sortText = "保存";
				} else {
					$http({
						method: 'post',
						data: {
							imagesSort: imagesSort,
							ticket: $scope.ticket,
							domain:$scope.domain
						},
						url: serverUrl + 'systemManager/updateImagePriorityForActivity'
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
			console.info(1);
			var activityImagesRelID = files.dataset.cid;
			var nth = files.dataset.nth;
			var file = files.files[0];
			var reader = new FileReader();
			reader.readAsDataURL(file);
			var img = new Image();
			reader.onloadend = function() {
				img.src = reader.result;
				img.onload = function() {
          console.info(file.size/1000);
					//if ((file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") && file.size <= 500 * 1024 && img.width == 750) {
					if ((file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") && file.size <= 500 * 1024) {
						var form = new FormData();
						form.append("fileName", file.name); // 可以增加表单数据
						form.append("fileSize", file.size); // 可以增加表单数据
						form.append("file", file);
						var req = new XMLHttpRequest();
						req.open("post", imgUrl + 'upload');
						req.send(form);
						req.onreadystatechange = function() {
							if (req.readyState == 4 && req.status == 200) {
								var data = JSON.parse(req.responseText);
								var groupName = data.data.goupName;
								var remoteFileName = data.data.remoteFileName;
								var saveUrl = "/" + groupName + "/" + remoteFileName;
								var httpUrl = imgUrl + groupName + "/" + remoteFileName;
								if (data.errorCode == 0) {
									$http({
										method: 'post',
										data: {
											activityImagesRelID: activityImagesRelID,
											groupName: groupName,
											remoteFileName: remoteFileName,
											activityID: $scope.id,
											ticket: $scope.ticket,
                      maxWidth:img.width,
                      maxHeight:img.height,
                      maxSize:file.size/1000,
											domain: $scope.domain
										},
										url: serverUrl + 'systemManager/editImageForActivity'
									}).then(function successCallback(response) {
										if (response.data.errorCode == 0) {
											var activityImagesRelID = response.data.data.activityImagesRelID;
											if (nth == -1) {
												var obj = {
													"activityImagesRelID": activityImagesRelID,
													"httpUrl": httpUrl,
													"priority": ''
												};
												$scope.details.push(obj)
											} else {
												$scope.details[nth].activityImagesRelID = activityImagesRelID;
												$scope.details[nth].httpUrl = httpUrl;
											}
											console.info($scope.details);

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
									userAuth.isLogin(response.data);
									$scope.popShow = true;
									$scope.context = "上传失败图片失败";
								}

							}
						};
					} else {
						$scope.popShow = true;
						$scope.context = "图片尺寸要求：≤500K。请按照此规则上传图片!";
						$scope.$apply();
					}
					files.value = null;
				}
			}
		};




		list();
		$scope.goodsImg = goodsImg;
		$scope.details = details;

	});
