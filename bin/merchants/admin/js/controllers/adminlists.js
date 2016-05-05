'use strict';

angular.module('app')
.controller('AllCouponsCtrl', ['$scope', '$http', '$state', 'acsManager', function($scope, $http, $state, acsManager) {
    $scope.user = acsManager.info();

    if ($scope.user == null) {
      $state.go('access.signin');
      return;
    }

    $scope.pageTitle = "All Coupons";
    
    acsManager.getAllCoupons(function(err, coupons) {
      $scope.coupons = coupons;
      console.log(coupons);

      $scope.$apply();
    });


}]);







angular.module('app')
.controller('AllLocationsCtrl', ['$scope', '$http', '$state', 'acsManager', function($scope, $http, $state, acsManager) {
    $scope.user = acsManager.info();

    if ($scope.user == null) {
      $state.go('access.signin');
      return;
    }

    $scope.pageTitle = "All Locations";

    acsManager.getAllLocations(function(err, locations) {
      $scope.locations = locations;
      $scope.$apply();
    }, function() {
      $scope.$apply();
    });


}]);






angular.module('app')
.controller('AllPhotoponsCtrl', ['$scope', '$http', '$state', 'acsManager', function($scope, $http, $state, acsManager) {
    $scope.user = acsManager.info();

    if ($scope.user == null) {
      $state.go('access.signin');
      return;
    }

    $scope.pageTitle = "All Photopons";

    acsManager.getAllPhotopons(function(err, photopons) {
      $scope.photopons = photopons;
      $scope.$apply();
    }, function() {
      $scope.$apply();
    });


}]);




