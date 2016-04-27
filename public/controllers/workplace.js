app.controller('workplace', function($scope, auth) {
  auth.checkSession();  
  hideMap();
  fakeLoadOff();
});