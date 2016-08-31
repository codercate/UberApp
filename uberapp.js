angular.module('uberapp.map', ['ui.bootstrap']);
angular.module('uberapp.map').controller('MapCtrl', function($scope, $location) {

    var map;
    var rectangle;
    var dataArray = [];
    
    
    //Parses CSV file and puts data in an array
    $scope.getData = function(file) {
        
        var rows = file.split("\n");
        
        var length = rows.length;
        var count = length/2;

        for(var i = 1; i < count; i++){
            //Date/Time, Lat, Lon, Base for pickup points
            var line = rows[i].split(",");
            //Date/Time, Lat, Lon, Base for dropoff points
            var extra = rows[(count - 1) + i].split(",");
            
            //Add lat and long of dropoff points to data array
            line.push(extra[1]);
            line.push(extra[2]);
            
            /*Final array contains Date/Time, Lat, Long, 
            Base, Dropoff Lat, Dropoff Long*/
            dataArray[i] = line;
        }
        
        $scope.getLatLong();
        
    }
    
    
    //Find the average lat and long to set the map
    $scope.getLatLong = function() {
        
        var sumLat = 0;
        var sumLong = 0;
        
        for(var i = 1; i < dataArray.length; i++)
        {
            sumLat += parseFloat(dataArray[i][1]);
            sumLong += parseFloat(dataArray[i][2]);
        }
        
        var meanLat = sumLat/(dataArray.length);
        var meanLong = sumLong/(dataArray.length);
        
        /*Set the center of the map to the average position of all 
        the points in the data*/
        map.setCenter({lat: meanLat, lng: meanLong});
    }
    
    //Called when the checkbox to show the area is clicked
    document.getElementById('rectShow').onclick = function() {
        if ( this.checked ) {
            
            //Set the bounds of the rectangle to be around the center of the map
            rectangle.setBounds({
                north: map.getCenter().lat() + .01,
                south: map.getCenter().lat() - .01,
                east: map.getCenter().lng() + .01,
                west: map.getCenter().lng() - .01
            });
            
            //Show the rectangle on the map
            rectangle.setMap(map);
        } else {
            //Don't show the rectangle
            rectangle.setMap(null);
        }
    };
    
    //Called when the user changes the size of the rectangle
    function getBoundsChange(event) {
        
        //Positions of top right and bottom left corners of the rectangle
        var tR = rectangle.getBounds().getNorthEast();
        var bL = rectangle.getBounds().getSouthWest();
        
        //and their corresponding latitidudes and longitudes
        var newTopLat = tR.lat();
        var newRightLon = tR.lng();
        var newBottomLat = bL.lat();
        var newLeftLon = bL.lng();
        
        var ptArray = [];
        var ptArrayIndex = 0;
        
        var count = 0;
        var markers = [];
        
        for(var i = 1; i < dataArray.length; i++) {
            
            var lat = parseFloat(dataArray[i][1]);
            var long = parseFloat(dataArray[i][2]);
            
            //check if the point is within the counds of the rectangle
            if(( lat <= newTopLat && lat >= newBottomLat) && (long <= newRightLon && long >= newLeftLon)) {
                
                //add point to the ptArray if it is not already there
                if(!$scope.contains(ptArray, lat, long)) {
                    ptArray[ptArrayIndex] = {lat, long, count};
                    ptArrayIndex++;
                }
                
            }
        }
        
        var maxCount = 0;
        
        //Find the highest number of point repeats
        for (var i = 1; i < ptArray.length; i++) {
            if(ptArray[i].count > maxCount)
                maxCount = ptArray[i].count;
        }
        
        
        for (var i = 1; i < ptArray.length; i++) {
            if(ptArray[i].count > (maxCount/2)) {
                /*If the point's count is > maxCount/2, it is a top pickup
                location, so add a pin to the map*/
                markers.push(new google.maps.Marker({
                    map: map,
                    position: {lat: ptArray[i].lat, lng: ptArray[i].long},
                    title: "PickUp Location"
                }));
            }
        }
    }
    
    /*Checks if point is in ptArray or not by comparing lat and long with those
    in the array*/
    $scope.contains = function(ptArray, lat, long) {
        
        for (var i = 1; i < ptArray.length; i++) {
            if(ptArray[i].lat == lat && ptArray[i].long == long) {
                //Keep track of how many times this point is in original dataset
                ptArray[i].count++;
                return true;
            }
        }
        return false;
    }

    //Initialization method
    window.initMap = function() {
        //AJAX call to grab the data file
        $.ajax({
            type: "GET",
            url: "uber-trip-data\\uber-raw-data-apr14.csv",
            dataType: "text",
            success: function(data) {$scope.getData(data);}
        });
        
        //Initialize the map
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            mapTypeId: 'terrain'
        });
        

         //Initializes an editable and draggable rectangle
        rectangle = new google.maps.Rectangle({
            editable: true,
            draggable: true,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35
        });
        //Adds a listener for when the rectangle's bounds change
        rectangle.addListener('bounds_changed', getBoundsChange);

    }
});