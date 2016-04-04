app.factory('gMaps', function($window, $q) {
  gMaps = function(myCallBackName, myCallBack) {
    mapsDefer = $q.defer();
    asyncLoad = function() {
      var script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCeA-5Su__ofw2PqGG2pc4cpEwXsI_DfZE&callback=' + myCallBackName
      document.body.appendChild(script);      
    };
    $window.myCallBackName = myCallBack;
    getPromise = function() {
      return mapsDefer.resolve();
    }
    asyncLoad();
  };
  return gMaps
/*  
  mapsDefer = $q.defer();
  
  $window.initMap = function() {
    mapsDefer.resolve();
  };
  
  var asyncLoad = function() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCeA-5Su__ofw2PqGG2pc4cpEwXsI_DfZE&callback=initMap'
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