'use strict';

var ControllerFunction = function($scope, $http, $state, acsManager, $sce, $timeout, $stateParams) {
    $scope.user = acsManager.info();
    
    var id;
    if ($stateParams) {
        id = $stateParams.id;
    }


    if ($scope.user == null) {
        $state.go('access.signin');
        return;
    }




    $scope.mapOptions = {
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.myMarkers = [];
    $scope.redeems = [];



    $scope.showUserInfo = function (user) {
        user.fetch({
            success: function(obj) {
                $timeout(function() {

                    obj.getUserPhone = function() {
                        var phone = this.get("phone");
                        if (!phone) {
                            return "No phone";
                        } else {
                            return phone;
                        }
                    };
                    obj.getCreatedAt = function() {
                        return moment(this.createdAt).format('MM/DD/YYYY h:mm:ss a');
                    };

                    obj.numRedeems = 0;
                    for (var i = 0; i < $scope.redeems.length; i++) {
                        if ($scope.redeems[i].get("to").id == obj.id) {
                            ++obj.numRedeems;
                        }
                    }

                    $scope.userInfo = obj;
                    FillMarkers();
                }, 0);

            },
            error: function(obj, err) {
                
            }
        });
    };

    $scope.openMarkerInfo = function (marker) {
      $scope.currentMarker = marker;
      $scope.currentMarkerLat = marker.getPosition().lat();
      $scope.currentMarkerLng = marker.getPosition().lng();
      $scope.myInfoWindow.open($scope.myMap, marker);
      console.log(marker.redeem);
    };


    var latlngbounds;
            

    var FillMarkers = function() {
        latlngbounds = new google.maps.LatLngBounds();
        $scope.myMarkers = [];

        for (var i = 0; i < $scope.redeems.length; i++) {
            
            var ll = new google.maps.LatLng ($scope.redeems[i].get("location").latitude, $scope.redeems[i].get("location").longitude);


            var pinColor = "FE7569";

            if ($scope.userInfo && ($scope.redeems[i].get('to').id == $scope.userInfo.id)) {
                pinColor = "00A533";
            }


            var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
                new google.maps.Size(21, 34),
                new google.maps.Point(0,0),
                new google.maps.Point(10, 34));
            var pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
                new google.maps.Size(40, 37),
                new google.maps.Point(0, 0),
                new google.maps.Point(12, 35));

            latlngbounds.extend(ll);
            var markerObj = new google.maps.Marker({
                map: $scope.myMap,
                position: ll,
                icon: pinImage,
                shadow: pinShadow
            });

            $scope.redeems[i].marker = markerObj;
            markerObj.redeem = $scope.redeems[i];

            $scope.myMarkers.push(markerObj);
             
        }
    };



    $scope.isCouponDetail = true;
    $scope.redeems = [];
    acsManager.getRedeems(function(redeems) {
         $timeout(function () {
            $scope.redeems = redeems;

            FillMarkers();

            $scope.myMap.setCenter(latlngbounds.getCenter());
            $scope.myMap.fitBounds(latlngbounds);
        }, 0);

    }, id);


};



angular.module('app')
.controller('AllRedeemsCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$timeout', ControllerFunction]);



angular.module('app')
.controller('CouponRedeemCtrl', ['$scope', '$http', '$state', 'acsManager', '$sce', '$timeout', '$stateParams', ControllerFunction]);

