app
	.controller('EditSupplierCtrl', function($scope, $routeParams, $rootScope, $http, $timeout, $location, serverUrl, showError,userAuth) {
		this.awesomeThings = [
			'HTML5 Boilerplate',
			'AngularJS',
			'Karma'
		];

		$scope.hasError = false;
		$scope.closeError = function() {
			$scope.hasError = false;
		};

    $scope.goTo=function(add){
      $location.path(add);
    };

		$scope.supplierID = $routeParams.id;
    $scope.ticket=$rootScope.ticket;
    $scope.domain=$rootScope.domain;
		//		$scope.supplierID = supplierID;
		//		var supplierName = $routeParams.name;
		//		$scope.supplierName = supplierName;
		//		var shortName = $routeParams.shortName;
		//		$scope.shortName = shortName;
		//		var contactPhone = $routeParams.contactPhone;
		//		$scope.contactPhone = contactPhone;
		//		var claimPhone = $routeParams.claimPhone;
		//		$scope.claimPhone = claimPhone;
		//		var cooperationStartTime ;
		//		var cooperationEndTime;
		//		console.info(typeof ($routeParams.startTime));
		//		if($routeParams.startTime!=' '){
		//				cooperationStartTime = $routeParams.startTime;
		//				console.info(1111);
		//		}else{
		//				cooperationStartTime="";
		//		}
		//
		//		if($routeParams.endTime){
		//				cooperationEndTime = $routeParams.endTime;
		//		}else{
		//				cooperationEndTime="";
		//		}
		//

    $scope.dates = {
      today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
      minDate: moment("2015-12-06 12:13:24")
    };

    $scope.$watch('dates.cooperationStartTime', function() {
      $scope.dates.minDate = $scope.dates.cooperationStartTime || moment("");
      $scope.$broadcast('pickerUpdate', ['cooperationEndTime'], {
        minDate: $scope.dates.minDate,
      });

    });
    $scope.$watch('dates.cooperationEndTime', function() {
      $scope.dates.maxDate = $scope.dates.cooperationEndTime || moment("");


      $scope.$broadcast('pickerUpdate', ['cooperationStartTime'], {
        maxDate: $scope.dates.maxDate,
      });
    });


		function list() {
			$http({
				method: 'post',
				data: {
					supplierID: $scope.supplierID,
					status: 'N',ticket:$scope.ticket,domain:$scope.domain
				},
				url: serverUrl + '/supplierManager/querySupplierList'
			}).then(function successCallback(response) {
				if (response.data.errorCode == 0) {
					$scope.suppliers = response.data.data[0];
					setInfo(); //初始化参数信息
					var cooperationStartTime = $scope.cooperationStartTime;
					var cooperationEndTime = $scope.cooperationEndTime;
					$scope.dates = {
						today: moment.tz('UTC').hour(0).startOf('h'), //12:00 UTC, today.
						minDate: moment("2015-12-06 12:13:24"),
						cooperationStartTime: cooperationStartTime ? moment(cooperationStartTime) : "",
						cooperationEndTime: cooperationEndTime ? moment(cooperationEndTime) : ""
					};
				} else {
          userAuth.isLogin(response.data);
					showError.showErrorMsg('获取城市列表失败');
				}
			}, function errorCallback(response) {
				showError.showErrorMsg('获取城市列表失败');
			});
		}
		list();

		//设置页面参数信息
		function setInfo() {
      $scope.supplierNumber = $scope.suppliers.supplierNumber;
			$scope.supplierName = $scope.suppliers.supplierName;
			$scope.shortName = $scope.suppliers.shortName;
			$scope.supplierName = $scope.suppliers.supplierName;
			$scope.contactPhone = $scope.suppliers.contactPhone;
			$scope.claimPhone = $scope.suppliers.claimPhone;
			$scope.cooperationStartTime = $scope.suppliers.cooperationStartTime || "";
			$scope.cooperationEndTime = $scope.suppliers.cooperationEndTime || "";
		}

		//判断必填项是否已经填写
		function canAddSupplier() {
			$scope.canAdd = true;
			$scope.nameNull = false;
			$scope.cnameNull = false;
			$scope.telNull = false;
			$scope.ctelNull = false;
      $scope.numberNull = false;
      if ($scope.supplierNumber == undefined || $scope.supplierNumber == "") {
        $scope.numberNull = true;
        $scope.canAdd = false;
      }
      else if ($scope.supplierName == undefined || $scope.supplierName == "") {
				$scope.nameNull = true;
				$scope.canAdd = false;
			} else if ($scope.shortName == undefined || $scope.shortName == "") {
				$scope.cnameNull = true;
				$scope.canAdd = false;
			} else if ($scope.contactPhone == undefined || $scope.contactPhone == "") {
				$scope.telNull = true;
				$scope.canAdd = false;
			} else if ($scope.claimPhone == undefined || $scope.claimPhone == "") {
				$scope.ctelNull = true;
				$scope.canAdd = false;
			}
		}
		//获取焦点事件
		$scope.change = function() {
				$scope.nameNull = false;
				$scope.cnameNull = false;
				$scope.telNull = false;
				$scope.ctelNull = false;
			$scope.isContactTelNumber=true;
			$scope.isClaimTelNumber=true;
      $scope.numberNull = false;
		};

		$scope.editSupplier = function() {
			canAddSupplier();
			$scope.judge();
			if (($scope.canAdd == true)&&$scope.isContactTelNumber&&$scope.isClaimTelNumber) {
				console.log(($scope.dates.cooperationEndTime && String($scope.dates.cooperationEndTime) != 'Invalid date') ? $scope.dates.cooperationEndTime.format('YYYY-MM-DD') : null);
				$http({
					method: 'post',
					data: {
            supplierNumber:$scope.supplierNumber,
						supplierID: $scope.supplierID,
						supplierName: $scope.supplierName,
						shortName: $scope.shortName,
						contactPhone: $scope.contactPhone,
						claimPhone: $scope.claimPhone,
						cooperationStartTime: ($scope.dates.cooperationStartTime && String($scope.dates.cooperationStartTime) != 'Invalid date') ? $scope.dates.cooperationStartTime.format('YYYY-MM-DD') : '',
						cooperationEndTime: ($scope.dates.cooperationEndTime && String($scope.dates.cooperationEndTime) != 'Invalid date') ? $scope.dates.cooperationEndTime.format('YYYY-MM-DD') : '',
            ticket:$scope.ticket,domain:$scope.domain
					},
					url: serverUrl + '/supplierManager/updateSupplier'
				}).then(function successCallback(response) {
					$scope.showTip = false;
					$scope.nameRepeat = false;
					$scope.shortNameRepeat = false;
					$scope.saveSupplier = false;
					console.log(response.data.errorCode);
					if (response.data.errorCode == 0) {
						$scope.saveSupplier = true;
						$timeout(function() {
							$scope.saveSupplier = false;
						}, 2000);
						$location.path('/supplier');
					} else if (response.data.errorCode == 7003) {
						$scope.showTip = true;
						$scope.nameRepeat = true;
					} else if (response.data.errorCode == 7004) {
						$scope.showTip = true;
						$scope.shortNameRepeat = true;
					} else if (response.data.errorCode == 7021) {
            $scope.showTip = true;
            $scope.numberRepeat = true;
          } else {
            userAuth.isLogin(response.data);
						showError.showErrorMsg('编辑供应商信息失败');
					}
				}, function errorCallback(response) {
					showError.showErrorMsg('编辑供应商信息失败--网络错误');
				})
			}
		};
		$scope.closePop = function() {
			$scope.showTip = false;
			$scope.nameRepeat = false;
			$scope.nameRepeat = false;
			$scope.numberRepeat = false;
		};

		//新增电话输入验证
		$scope.isContactTelNumber=true;
		$scope.isClaimTelNumber=true;
		$scope.judge=function(){
			$scope.isContactTelNumber=true;
			$scope.isClaimTelNumber=true;
			var reg=/[0-9]{5,}/;
			if(($scope.contactPhone!=undefined)&&($scope.contactPhone!="")){
				$scope.isContactTelNumber=reg.test($scope.contactPhone);
			}
			if(($scope.claimPhone!=undefined)&&($scope.claimPhone!="")){
				$scope.isClaimTelNumber=reg.test($scope.claimPhone);
			}
		}

	});
