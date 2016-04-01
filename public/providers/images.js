app.factory('images', function($http, $cookies, values) {
  delImage = function(image) {
    return $http({
      url: values.api_url + 'images/delImage',
      method: 'post',
      data: 'mail=' + $cookies.get('mail') + '&token=' + $cookies.get('token') + '&defLang=' + values.def_lang + '&image=' + image,
      headers: {'Content-Type':'application/x-www-form-urlencoded'}
    });
  }
  
  return {
    delImage : delImage    
  }
});