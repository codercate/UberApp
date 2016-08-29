angular.module('uberapp.map', ['ui.bootstrap']);
angular.module('uberapp.map').controller('MapCtrl', function($scope, $location) {
    
    var data, jsonData;
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
    
    
    $scope.toJson = function(file) {
        var rows = file.split("\n");

        var headerRow = [];
        
        var length = rows.length;
        var count = length/2;

        for(var i = 1; i < count; i++){
            var line = rows[i].split(",");
            var extra = rows[(count - 1) + i].split(",");
            line.push(extra[1]);
            line.push(extra[2]);
            dataArray[i] = line;
        }
        
        console.log(dataArray);
        
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
        console.log(meanLat);
        console.log(meanLong);
    }
    
    document.getElementById('rectShow').onclick = function() {
        // access properties using this keyword
        if ( this.checked ) {
            rectangle.setMap(map);
            $scope.createHTMLTable();
            $scope.showTable = true;
            console.log($scope.showTable);
        } else {
            rectangle.setMap(null);
            //showTable = false;
        }
    };
    
    function getBoundsChange(event) {
        var tR = rectangle.getBounds().getNorthEast();
        var bL = rectangle.getBounds().getSouthWest();
    }
    
    $scope.createHTMLTable = function() {
        var headerArray = ["DateTime", "Lat", "Long",  "Base", "DropoffLat", "DropoffLon"];
        var headerCount = 0;
        for(var i = 1; i < dataArray.length; i++) {
            if(headerCount == 6)
                headerCount = 0;
            var json = {};
            json[headerArray[headerCount]] = dataArray[i][headerCount];
            headerCount++;
            temp = JSON.stringify(json);
            jArray[i] = JSON.parse(temp);
        }
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
            center: {lat: 40.74030578548673, lng: -73.97712350049062},
            zoom: 12,
            mapTypeId: 'terrain'
        });
        
        var bounds = {
            north: 40.750,
            south: 40.730,
            east: -73.967,
            west: -73.987
        };

        // Define a rectangle and set its editable property to true.
        rectangle = new google.maps.Rectangle({
            bounds: bounds,
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