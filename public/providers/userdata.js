app.factory('userData', function($http) {
  data = {};
  
  getData = function(name, token) {
    return data;
  };
  setData = function(user) {
    data = user;
  }
  
  userData = {
    getData: getData,
    setData: setData
  }
  
  return userData;
});