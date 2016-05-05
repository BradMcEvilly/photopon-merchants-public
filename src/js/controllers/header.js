'use strict';

angular.module('app')
.controller('HeaderBarCtrl', ['$scope', '$state', 'acsManager', function($scope, $state, acsManager) {
    var user = acsManager.info();
    if (user == null) {
        $state.go('access.signin');
        return;
    }

    var file = user.get("image");

    $scope.user = user;

    $scope.logoutUser = function(){
        acsManager.logout();
    	$state.go('access.signin');
    };



}]);