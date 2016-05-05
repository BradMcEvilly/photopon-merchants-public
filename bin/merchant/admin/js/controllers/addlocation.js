'use strict';

angular.module('app')
.controller('AddLoctionCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$modal', function($scope, $http, $state, acsManager, $sce, $modal) {
    $scope.user = acsManager.info();

    if ($scope.user == null) {
    	$state.go('access.signin');
    	return;
    }


	$scope.trustSrc = function(src) {
		return $sce.trustAsResourceUrl(src);
	};

    $scope.address = {};
    $scope.refreshAddresses = function(address) {
    	var params = {
    		address: address + ", United States", 
    		sensor: false
    	};
    	return $http.get('https://maps.googleapis.com/maps/api/geocode/json', {
    		params: params
    	}).then(function(response) {
      		$scope.addresses = response.data.results;

      		for (var i = 0; i < $scope.addresses.length; i++) {
      			$scope.addresses[i].mapurl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAz3McamUfvYCEn_KoLLtwrMUJAcI7nkr4&q=" + encodeURIComponent($scope.addresses[i].formatted_address);
      		};
      		
    	});
    };


    $scope.removeLocation = function() {
    	var locationInfo = this;
    	var modalInstance = null;

		modalInstance = $modal.open({
			templateUrl: 'removeLocationModal.html',
			controller: ['$scope', function($scope) {
				$scope.title = "Are you sure?";
				$scope.message = "Do you want to remove this location?"

				$scope.ok = function() {
					acsManager.removeLocation(locationInfo.l.id, function() {
						$state.go($state.current, {}, {
							reload: true
						});
						modalInstance.close();
					});
				};

				$scope.cancel = function() {
					modalInstance.close();
				};
			}]
		});

    };

    $scope.addLocation = function() {

    	acsManager.addLocation({
    		name: $scope.location_title,
			address: $scope.address.selected.formatted_address,
			latitude: $scope.address.selected.geometry.location.lat,
			longitude: $scope.address.selected.geometry.location.lng
		}, function() {
			$state.go($state.current, {}, {
				reload: true
			});
		});
    };


    $scope.locations = [];
	acsManager.getLocations(function(err, locations) {
    	$scope.locations = locations;
    });


}]);













angular.module('app')
.controller('EditLoctionCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$modal', '$stateParams', function($scope, $http, $state, acsManager, $sce, $modal, $stateParams) {
    var id = $stateParams.id;
    $scope.user = acsManager.info();

    $scope.isEditing = true;
    $scope.address = {};


    if ($scope.user == null) {
        $state.go('access.signin');
        return;
    }

    acsManager.getLocation(id, function(err, location) {
        $scope.location_title = location.get("name");
        $scope.address.selected = {
            geometry: {
                location: {}
            }
        };

        $scope.address.selected.formatted_address = location.get("address");

        $scope.address.selected.geometry.location.lat = location.get("location").lat;
        $scope.address.selected.geometry.location.lng = location.get("location").lng;

        $scope.address.selected.mapurl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAz3McamUfvYCEn_KoLLtwrMUJAcI7nkr4&q=" + encodeURIComponent($scope.address.selected.formatted_address);
            

        $scope.$apply();
    });


    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    };

    $scope.refreshAddresses = function(address) {
        var params = {
            address: address + ", United States", 
            sensor: false
        };
        return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {
            params: params
        }).then(function(response) {
            $scope.addresses = response.data.results;

            for (var i = 0; i < $scope.addresses.length; i++) {
                $scope.addresses[i].mapurl = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAz3McamUfvYCEn_KoLLtwrMUJAcI7nkr4&q=" + encodeURIComponent($scope.addresses[i].formatted_address);
            };
            
        });
    };

    $scope.addLocation = function() {

        acsManager.editLocation(id, {
            name: $scope.location_title,
            address: $scope.address.selected.formatted_address,
            latitude: $scope.address.selected.geometry.location.lat,
            longitude: $scope.address.selected.geometry.location.lng
        }, function() {
            $state.go("app.dashboard-merchant", {}, {
                reload: true
            });
        });
    };




}]);



