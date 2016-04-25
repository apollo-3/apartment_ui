app.factory('values', function() {
  var values = {
    api_url: 'http://192.168.33.123:3000/api/',
    def_lang : (navigator.language || navigator.userLanguage).split('-')[0],
    max_images: 4,
    map_zoom: 11,
    map_center: {lat: 53.904, lng: 27.561},
    min_password_length: 4,
    max_password_length: 16,
    max_mail_length: 32,
    min_name_length: 2,
    max_name_length: 32,
    min_phone_length: 6,
    max_phone_length: 24,
    min_geoname_length: 2,
    max_geoname_length: 32,
    max_float_length: 10,
    min_description_length: 5,
    max_description_length: 256,
    min_address_length: 2,
    max_address_length: 64,
    max_link_length: 256,
    min_floor_length: 1,
    max_floor_length: 3,
    max_price_length: 16
  };
  return values;
});