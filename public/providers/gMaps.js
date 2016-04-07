app.factory('gMaps', function($window, $q, values) {
  mapsDefer = $q.defer();
  map = {};
  markers = [];
  enabled = false;
  calledPromise = false;
  
  aSyncLoad = function(myCallBack) {      
    $window.editorMap = function() {
      map = myCallBack();
      mapsDefer.resolve();
      enabled = true;
    };      
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCeA-5Su__ofw2PqGG2pc4cpEwXsI_DfZE&libraries=places&callback=' + 'editorMap';
    if ($("body script[src='" + script.src + "']").length === 0) {
      document.body.appendChild(script);      
    }
  };
     
  isEnabled = function() {
    return enabled;
  };
  setDisabled = function() {
    enabled = false;
  };
  getPromise = function() {
    return mapsDefer.promise;
  };
  getMap = function() {
    return map;
  };
  getCalledPromise = function() {
    return calledPromise;
  };
  setCalledPromise = function() {
    calledPromise = true;
  };
  delAllMarkers = function() {
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];   
  };
  addMarker = function(location, dragCallBack, phoneHistory) {
    if (markers.length < 1) {
      marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: getIcon(phoneHistory),
        draggable: true
      });
      markers.push(marker);
      google.maps.event.addListener(marker, 'drag', dragCallBack);
    } else {
      markers[0].setPosition(location);
    }      
    return marker;
  };
  addSimpleMarker = function(location, phoneHistory, flat)   {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(location),
      map: map,
      icon: getIcon(phoneHistory)
    });
    attachSecretMessage(marker, flat);
    markers.push(marker);
  };
  bestView = function() {
    var bounds = new google.maps.LatLngBounds();
    angular.forEach(markers, function(marker) {
      bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);
    map.setCenter(bounds.getCenter());
    if (markers.length === 0) {
      map.setCenter(values.map_center);
      map.setZoom(values.map_zoom);      
    } else if (markers.length == 1) {
      map.setZoom(values.map_zoom);      
    }
    // map.setZoom(map.getZoom()-1);    
  };

  aSyncLoad(function() {
      map = new google.maps.Map(document.getElementById('draw_area'), {
        center: values.map_center,
        zoom: values.map_zoom
      });             
      return map;
    }
  );
  
  changeMarkerColor = function(phoneHistory) {
    markers[0].setIcon(getIcon(phoneHistory));
  };
  
  attachSecretMessage = function(marker, flat) {
    phones = '';
    angular.forEach(flat.phones, function(ph) {
      phones = phones + ph.phone + ', ';
    });
    phones = phones.replace(/, $/,'');
    msg = flat.address + '<br>' +
          flat.contact + '<br>' +
          phones;
    var infowindow = new google.maps.InfoWindow({content: msg});
    marker.addListener('click', function() {
      infowindow.open(marker.get('map'), marker);
    });    
  };
  
  
  getIcon = function(phoneHistory) {
    icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    switch (phoneHistory) {
      case 'called':
        icon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
        break;
      case 'callBack':
        icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';      
        break;
      case 'toCall':
        icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';      
        break;
    }  
    return icon;
  };
  
  return {
    getPromise: getPromise,
    getMap: getMap,
    delAllMarkers: delAllMarkers,
    addMarker: addMarker,
    markers: markers,
    aSyncLoad: aSyncLoad,
    isEnabled: isEnabled,
    setDisabled: setDisabled,
    addSimpleMarker: addSimpleMarker,
    bestView: bestView,
    getCalledPromise: getCalledPromise,
    setCalledPromise: setCalledPromise,
    changeMarkerColor: changeMarkerColor
  };
});