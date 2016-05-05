'use strict';

angular.module('app')
.controller('AllLoctionsCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$timeout', function($scope, $http, $state, acsManager, $sce, $timeout) {
    $scope.user = acsManager.info();

    if ($scope.user == null) {
    	$state.go('access.signin');
    	return;
    }


    $scope.locations = [];
	acsManager.getLocations(function(err, locations) {
		$timeout(function () {
    		$scope.locations = locations;
    	}, 0);

    });


}]);

