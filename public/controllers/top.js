app.controller('top', function($scope, $state, auth, $cookies, languages) {
  $scope.routerState = $state;
  $scope.isLogged = auth.isLogged();
  
  $scope.LNG = languages[languages.availableLng()];

  $scope.logout = function() {
    auth.logout();
  };
  
  $scope.mail = $cookies.get('mail');
});