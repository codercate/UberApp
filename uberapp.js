angular.module('uberapp.map', ['ui.bootstrap']);
angular.module('uberapp.map').controller('MapCtrl', function($scope, $location) {
    
    var jsonData;
    var meanLat = 0;
    var meanLong = 0;
    var sumLat = 0;
    var sumLong = 0;
    var result = [];
    var map;
    var rectangle;
    var showRectangle = true;
    var dataArray = [];
    var jArray = {};
    $scope.showTable = true;
    var markers = [];
    var first = true;
    
    
    $scope.toJson = function(file) {
        var rows = file.split("\n");
        
        var length = rows.length;
        var count = length/2;
        var headerArray = ["DateTime", "Lat", "Long",  "Base", "DropoffLat", "DropoffLon"];
        var headerCount = 0;
        var ptArray = [];
        var ptArrayIndex = 0;
        var ptCount = [];

        for(var i = 1; i < count; i++){
            var line = rows[i].split(",");
            var extra = rows[(count - 1) + i].split(",");
            line.push(extra[1]);
            line.push(extra[2]);
            dataArray[i] = line;
        }
        
        $scope.getLatLong();
        
    }
    
    $scope.getLatLong = function() {
        for(var i = 1; i < dataArray.length; i++)
        {
            sumLat += parseFloat(dataArray[i][1]);
            sumLong += parseFloat(dataArray[i][2]);
        }
        meanLat = sumLat/(dataArray.length);
        meanLong = sumLong/(dataArray.length);
        map.setCenter({lat: meanLat, lng: meanLong});
    }
    
    document.getElementById('rectShow').onclick = function() {
        if ( this.checked ) {
            rectangle.setBounds({
                north: map.getCenter().lat() + .01,
                south: map.getCenter().lat() - .01,
                east: map.getCenter().lng() + .01,
                west: map.getCenter().lng() - .01
            });
            rectangle.setMap(map);
        } else {
            rectangle.setMap(null);
            //showTable = false;
        }
    };
    
    function getBoundsChange(event) {
        var tR = rectangle.getBounds().getNorthEast();
        var bL = rectangle.getBounds().getSouthWest();
        var newTopLat = tR.lat();
        var newRightLon = tR.lng();
        var newBottomLat = bL.lat();
        var newLeftLon = bL.lng();
        var ptArray = [];
        var ptArrayIndex = 0;
        var count = 0;
        
        for(var i = 1; i < dataArray.length; i++) {
            var lat = parseFloat(dataArray[i][1]);
            var long = parseFloat(dataArray[i][2]);
            if(( lat <= newTopLat && lat >= newBottomLat) && (long <= newRightLon && long >= newLeftLon)) {
                if(!$scope.contains(ptArray, lat, long)) {
                    ptArray[ptArrayIndex] = {lat, long, count};
                    ptArrayIndex++;
                }
            }
        }
        var maxCount = 0;
        for (var i = 1; i < ptArray.length; i++) {
            if(ptArray[i].count > maxCount)
                maxCount = ptArray[i].count;
        }
        for (var i = 1; i < ptArray.length; i++) {
            if(ptArray[i].count > (maxCount/2)) {
                markers.push(new google.maps.Marker({
                    map: map,
                    position: {lat: ptArray[i].lat, lng: ptArray[i].long},
                    title: "PickUp Location"
                }));
            }
        }
    }
    
    $scope.contains = function(ptArray, lat, long) {
        for (var i = 1; i < ptArray.length; i++) {
            if(ptArray[i].lat == lat && ptArray[i].long == long) {
                ptArray[i].count++;
                return true;
            }
        }
        return false;
    }
    
    $scope.createHTMLTable = function() {
        
        console.log('JARRAY', jArray[1].DateTime);
    }

    
    window.initMap = function() {
        $.ajax({
            type: "GET",
            url: "uber-trip-data\\uber-raw-data-apr14.csv",
            dataType: "text",
            success: function(data) {$scope.toJson(data);}
        });
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            mapTypeId: 'terrain'
        });
        

         //Define a rectangle and set its editable property to true.
        rectangle = new google.maps.Rectangle({
            editable: true,
            draggable: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        rectangle.addListener('bounds_changed', getBoundsChange);

    }
});