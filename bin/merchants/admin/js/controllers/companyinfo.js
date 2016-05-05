'use strict';

angular.module('app')
.controller('CompanyInfoCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$modal', '$timeout', function($scope, $http, $state, acsManager, $sce, $modal, $timeout) {
    $scope.user = acsManager.info();

    if ($scope.user == null) {
    	$state.go('access.signin');
    	return;
    }

    $scope.companyInfo = {

    };

    acsManager.getCompany(function(err, company) {
      $timeout(function () {
        $scope.company = company;
        $scope.companyInfo.name = company.get("name");
        var file = company.get("image");
        if (file) {
          $scope.companyInfo.image = file.url();
        }
      }, 0);
    });




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



    $scope.saveInfo = function() {
      if ($scope.fileselected) {

        acsManager.saveCompanyInfo($scope.companyInfo.name, $scope.myCroppedImage, function() {
          $state.go($state.current, {}, {
            reload: true
          });
        });
      } else {

        acsManager.saveCompanyName($scope.companyInfo.name, function() {
          $state.go($state.current, {}, {
            reload: true
          });
        });
      }
    };


}]);




