app.factory('userData', function($http, values, $cookies) {
  data = {};
  
  getData = function() {
    return data;
  };
  setData = function(user) {
    data = user;
  };
  
  reloadData = function() {
    return $http({
     url: values.api_url + 'users/getData',
     method: 'post',
     headers: {'Content-Type':'application/x-www-form-urlencoded'},
     data: 'mail=' + $cookies.get('mail') + '&token=' + $cookies.get('token') + '&defLang=' + values.def_lang
   });
  };
  
  if (jQuery.isEmptyObject(data) && $cookies.get('token')!==undefined && $cookies.get('mail')!==undefined && $cookies.get('token')!=='' && $cookies.get('mail')!=='') {
    reloadData().then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        // Ignore annoying error about expired token for production
        // swal('Error', res.data.error);
      } else {
        setData(res.data.user);
      }
    });
  }
  
  userData = {
    getData: getData,
    setData: setData,
    reloadData: reloadData
  };
  
  return userData;
});