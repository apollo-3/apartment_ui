app.factory('values', function() {
  var values = {
    api_url: 'http://192.168.33.11:3000/api/',
    def_lang : (navigator.language || navigator.userLanguage).split('-')[0],
    max_images: 4,
    map_zoom: 11,
    map_center: {lat: 53.904, lng: 27.561}
  };
  return values;
});