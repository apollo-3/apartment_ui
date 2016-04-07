app.controller('top', function($scope, $state, auth, $cookies) {
  $scope.routerState = $state;
  $scope.isLogged = auth.isLogged();

  $scope.logout = function() {
    auth.logout();
  };
  
  $scope.mail = $cookies.get('mail');
});