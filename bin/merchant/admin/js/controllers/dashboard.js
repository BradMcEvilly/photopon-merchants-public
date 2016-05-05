'use strict';

angular.module('app')
.controller('DashboardCtrl', ['$scope', '$state', 'acsManager', function($scope, $state, acsManager) {
    $scope.user = acsManager.info();


   	$scope.coupons = [];
   	$scope.locations = [];

    if ($scope.user == null) {

    	$state.go('access.signin');
    	return;
    }

    acsManager.getCoupons(function(err, coupons) {
    	$scope.coupons = coupons;
        $scope.$apply();
    });
    acsManager.getLocations(function(err, locations) {
        $scope.locations = locations;
        $scope.$apply();
    });

    acsManager.getCompanyStats(function(err, stats) {
        $scope.stats = stats;
        $scope.$apply();
    });

}]);