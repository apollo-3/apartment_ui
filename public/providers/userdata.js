app.factory('userData', function($http, values, $cookies) {
  data = {};
  
  getData = function() {
    return data;
  };
  setData = function(user) {
    data = user;
  };
  
  userData = {
    getData: getData,
    setData: setData,
    reloadData: function() {
      def_lang = (navigator.language || navigator.userLanguage).split('-')[0];
      return $http({
               url: values.api_url + 'users/getData',
               method: 'post',
               headers: {'Content-Type':'application/x-www-form-urlencoded'},
               data: 'mail=' + $cookies.get('mail') + '&token=' + $cookies.get('token') + '&defLang=' + def_lang
             });
    }
  }
  
  return userData;
});