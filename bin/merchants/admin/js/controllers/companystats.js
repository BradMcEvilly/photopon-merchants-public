'use strict';

angular.module('app')
.controller('CompanyStatsCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$modal', '$timeout', function($scope, $http, $state, acsManager, $sce, $modal, $timeout) {
    $scope.user = acsManager.info();

    $scope.coupons = [];

    if ($scope.user == null) {
      $state.go('access.signin');
      return;
    }

    acsManager.getCoupons(function(err, coupons) {
      for (var i = 0; i < coupons.length; i++) {
          coupons[i].isActive = coupons[i].get("isActive");
            coupons[i].fetchNumRedeems(function() {
                $scope.$apply();
            });
        }

        $timeout(function () {
            $scope.coupons = coupons;
        });
    });

    $scope.stats = {
      numShares: 0,
      numRedeems: 0
    };
    
    acsManager.getCompanyStats(function(stats) {
        $timeout(function() {
          $scope.stats = stats;
        }, 0);
      });

}]);




