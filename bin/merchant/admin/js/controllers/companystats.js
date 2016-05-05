'use strict';

angular.module('app')
.controller('CompanyStatsCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$modal', '$filter', function($scope, $http, $state, acsManager, $sce, $modal, $filter) {
    $scope.user = acsManager.info();

    $scope.coupons = [];

    if ($scope.user == null) {
      $state.go('access.signin');
      return;
    }

    acsManager.getCoupons(function(err, coupons) {
      $scope.coupons = coupons;
      $scope.$apply();
    });

    $scope.stats = {
      numShares: 0,
      numRedeems: 0
    };
    
    acsManager.getCompanyStats(function(err, stats) {
        $scope.stats = stats;
        $scope.$apply();
    });

}]);




