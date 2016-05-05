'use strict';

angular.module('app')
.controller('AcceptRequestCtrl', ['$scope', '$http', '$state', 'acsManager', '$stateParams', function($scope, $http, $state, acsManager, $stateParams) {
    $scope.user = acsManager.info();

    if ($scope.user == null) {
      $state.go('access.signin');
      return;
    }

    $scope.provided = $stateParams.obj;




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





    $scope.acceptRequest = function() {
      
      //acsManager.newCompany($scope.provided.get("name"), $scope.myCroppedImage, $scope.provided.get("user").id, function(c) {
      acsManager.newCompany($scope.provided.get("businessName"), $scope.provided.get("logo"), $scope.provided.get("user").id, function(c) {
        acsManager.acceptMerchantRequest($scope.provided.id, function() {
          $state.go("app.dashboard-super", {}, {
            reload: true
          });
        });
      }, true);

    };

     $scope.denyRequest = function() {
        acsManager.denyMerchantRequest($scope.provided.id, function() {
          $state.go("app.dashboard-super");


        });
    };

    $scope.removeImage = function() {
      acsManager.removeCompanyLogo(function() {
        $state.go($state.current, {}, {
          reload: true
        });
      });
      $scope.provided.image = null;
    }



}]);




