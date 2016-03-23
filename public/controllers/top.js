app.controller('top', function($scope, $state, auth) {
  $scope.routerState = $state;
  $scope.isLogged = auth.isLogged();
});