'use strict';

angular.module('app')
.controller('AsideCtrl', ['$scope', '$state', 'acsManager', '$timeout', function($scope, $state, acsManager, $timeout) {
    $scope.user = acsManager.info();
    if ($scope.user == null) {
        $state.go('access.signin');
        return;
    }



    acsManager.getCompanyStats(function(stats) {
    	$timeout(function() {
    		$scope.stats = stats;
    		console.log($scope.stats);
    	}, 0);
    });

}]);