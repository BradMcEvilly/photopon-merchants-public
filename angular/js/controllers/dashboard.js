'use strict';

angular.module('app')
.controller('DashboardCtrl', ['$scope', '$state', 'acsManager', '$timeout', function($scope, $state, acsManager, $timeout) {
    $scope.user = acsManager.info();


   	$scope.coupons = [];
   	$scope.locations = [];

    if ($scope.user == null) {

    	$state.go('access.signin');
    	return;
    }

    acsManager.getCoupons(function(err, coupons) {
        $timeout(function() {
           $scope.coupons = coupons;
        }, 0);
    });
    acsManager.getLocations(function(err, locations) {
        $timeout(function() {
            $scope.locations = locations;
        });
    });

    acsManager.getCompanyStats(function(stats) {
        $timeout(function() {
            $scope.stats = stats;
        });
    });

}]);