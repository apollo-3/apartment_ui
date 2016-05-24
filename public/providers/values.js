app.factory('values', function() {
  var values = {
    api_url: 'https://192.168.33.123/api/',
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
    max_floor_length: 3,
    max_price_length: 16,
    max_image_size: 5,
    max_images_allowed: 4,
    max_length_log: 256,
    accounts: {
      standard: {
        projects: 2,
        flats: 10,
        photos: 4,
        logs: 2
      },
      advanced: {
        projects: 5,
        flats: 20,
        photos: 5,
        logs: 10        
      },
      premium: {
        projects: 30,
        flats: 30,
        photos: 8,
        logs: 20   
      },
      promo: {
        projects: 3,
        flats: 15,
        photos: 5,
        logs: 5
      }      
    }
  };
  return values;
});
