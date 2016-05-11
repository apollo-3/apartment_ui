app.controller('contacts', function($scope, auth, languages) {
  auth.checkSession();
  
  fakeLoadOff();
  hideMap();

  $scope.LNG = languages[languages.availableLng()]; 
});