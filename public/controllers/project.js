app.controller('project', function($scope, auth) {
  auth.checkSession();
  
  $scope.logout = function() {
    auth.logout();
  } 
});