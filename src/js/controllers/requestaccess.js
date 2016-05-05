'use strict';

/* Controllers */
  // signin controller
app.controller('RequestFormController', ['$scope', '$http', '$state', 'acsManager', '$timeout', function($scope, $http, $state, acsManager, $timeout) {
	$scope.user = {};

  $scope.currentUser = acsManager.info();
  console.log($scope.currentUser);


//$scope.myCroppedImage
  $scope.signout = function() {
    acsManager.logout();
    $state.go($state.current, {}, {
      reload: true
    });
  };

  $scope.request = function() {
    $scope.authError = null;
    acsManager.login($scope.user.username, $scope.user.password, function(err, user) {
      if (err) {
          $timeout(function () {
            $scope.authError = err.message;
          }, 0);
          return;
      }


      if ($scope.fileselected) {
        $scope.user.file = $scope.myCroppedImage;
      }

      acsManager.createMerchantRequest($scope.user, function(err) {
        $timeout(function () {
          if (err) {
            $scope.authError = err;
            return;
          }

          $scope.requestSent = true;
          
          $timeout(acsManager.logout, 100);
        }, 0);
      });
    });



  };

// Image cropping
    $scope.myImage = '';
    $scope.myCroppedImage = '';
    $scope.cropType = "square";

    var handleFileSelect = function(evt) {
      var file = evt.currentTarget.files[0];
      var reader = new FileReader();
      reader.onload = function (evt) {
        $scope.$apply(function($scope){
          $scope.myImage=evt.target.result;
          $scope.fileselected = true;
        });
      };
      reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);



}]);