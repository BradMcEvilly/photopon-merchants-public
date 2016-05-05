'use strict';

angular.module('app')
.controller('CompanyInfoCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$modal', '$filter', function($scope, $http, $state, acsManager, $sce, $modal, $filter) {
    $scope.user = acsManager.info();

    if ($scope.user == null) {
    	$state.go('access.signin');
    	return;
    }

    $scope.companyInfo = {

    };

    acsManager.getCompany(function(err, company) {
        $scope.company = company;
        $scope.companyInfo.name = company.get("name");
        var file = company.get("image");
        if (file) {
          $scope.companyInfo.image = file.url();
        }
        $scope.$apply();
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
      acsManager.saveCompanyInfo($scope.companyInfo.name, $scope.myCroppedImage, function() {
        $state.go($state.current, {}, {
          reload: true
        });
      });
    };

    $scope.removeImage = function() {
      acsManager.removeCompanyLogo(function() {
        $state.go($state.current, {}, {
          reload: true
        });
      });
      $scope.companyInfo.image = null;
    }
}]);




