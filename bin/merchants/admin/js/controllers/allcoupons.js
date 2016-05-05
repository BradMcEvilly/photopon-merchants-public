'use strict';

angular.module('app')
.controller('AllCouponsCtrl', ['$scope', 'toaster', '$http', '$state', 'acsManager', '$sce', '$modal', '$filter', '$timeout', function($scope, toaster, $http, $state, acsManager, $sce, $modal, $filter, $timeout) {
    $scope.user = acsManager.info();

    if ($scope.user == null) {
    	$state.go('access.signin');
    	return;
    }

    $scope.onCouponStatusChange = function() {
    	this.c.set("isActive", this.c.isActive);
    	this.c.save(null, {
			success: function(coupon) {
				$timeout(function () {
		        	toaster.pop("success", "Coupons saved!", "Coupons status has been changed");
    			}, 0);
			},
			error: function(coupon, error) {
				$timeout(function () {
		        	toaster.pop("error", "Error!", "Failed to save coupon status");
			        $state.go($state.current, {}, {
			          reload: true
			        });
    			}, 0);
			}
		});
    };


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


}]);






