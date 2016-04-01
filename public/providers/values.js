app.factory('values', function() {
  var values = {
    api_url: 'http://192.168.33.11:3000/api/',
    def_lang : (navigator.language || navigator.userLanguage).split('-')[0],
    max_images: 4
  }
  return values;
});