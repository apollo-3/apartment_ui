app.controller('profile', function($scope, $cookies, auth, userData) {
  auth.checkSession();
  $scope.user = {user: userData.getData()};
  $scope.wannaDelete = false;
  $scope.langs = ['en', 'ru']
  
  $scope.isLogged = auth.isLogged();
  
  $scope.delUser = function(password) {
    user = {'user':{'mail':$cookies.get('mail'), 'password':password, 'token':$cookies.get('token')}};
    auth.delUser(user);
  }
});