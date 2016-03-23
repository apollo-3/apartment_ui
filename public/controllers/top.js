app.controller('top', function($scope, $state, auth) {
  $scope.routerState = $state;
  $scope.isLogged = auth.isLogged();

  $scope.logout = function() {
    auth.logout();
  }   
});