'use strict';

app.controller('DashboardSuperCtrl', ['$scope', '$state', 'acsManager', '$timeout', function($scope, $state, acsManager, $timeout) {
    $scope.user = acsManager.info();


   	$scope.coupons = [];
   	$scope.locations = [];

    if ($scope.user == null) {

    	$state.go('access.signin');
    	return;
    }

    if (!$scope.user.get("isSuperUser")) {
        $state.go('app.dashboard-merchant');
        return;
    }


   

    $scope.reviewRequest = function() {
        $state.go("app.acceptrequest", { obj: this.r });
    };



    acsManager.getCompanies(function(err, companies) {
        $timeout(function() {
            $scope.companies = companies;
        }, 0);
    }, function() {
        $scope.$apply();
    });

    acsManager.numAllCoupons(function(err, num) {
         $timeout(function() {
            $scope.numCoupons = num;
        }, 0);
    });



    acsManager.getTotalStats(function(err, stats) {
         $timeout(function() {
            $scope.stats = stats;
        }, 0);
    });


    acsManager.getMerchantRequests(function(err, requests) {
         $timeout(function() {
            $scope.requests = requests;
        }, 0);
    });

}]);





