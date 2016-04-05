app.factory('gMaps', function($window, $q) {
  gMaps = function(myCallBackName, myCallBack) {
    mapsDefer = $q.defer();
    map = {};
    markers = [];
    
    asyncLoad = function() {
      var script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCeA-5Su__ofw2PqGG2pc4cpEwXsI_DfZE&libraries=places&callback=' + myCallBackName
      if ($("body script[src='" + script.src + "']").length == 0) {
        document.body.appendChild(script);      
      }
    };
    $window[myCallBackName] = function() {
      map = myCallBack();
      mapsDefer.resolve();
    }    
    
    getPromise = function() {
      return mapsDefer.promise;
    }
    getMap = function() {
      return map;
    }
    delAllMarkers = function() {
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];   
    }
    addMarker = function(location, dragCallBack) {
      if (markers.length < 1) {
        marker = new google.maps.Marker({
          position: location,
          map: map,
          draggable: true
        });
        markers.push(marker);
        google.maps.event.addListener(marker, 'drag', dragCallBack);
      } else {
        markers[0].setPosition(location);
      }      
      return marker;
    }

    asyncLoad();
    
    return {
      getPromise: getPromise,
      getMap: getMap,
      delAllMarkers: delAllMarkers,
      addMarker: addMarker,
      markers: markers
    }
  };
  return gMaps;
/*  
  mapsDefer = $q.defer();
  
  $window.initMap = function() {
    mapsDefer.resolve();
  };
  
  var asyncLoad = function() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCeA-5Su__ofw2PqGG2pc4cpEwXsI_DfZE&libraries=places&callback=initMap'
    document.body.appendChild(script);
  };      
    
  mapsDefer.promise.then(function() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    });
  });
  
  asyncLoad();
  
  return {
    mapsDefer: mapsDefer.promise
  }
*/
});