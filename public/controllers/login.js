app.controller('login', function($scope, auth) {
  auth.checkSession();

  $scope.remember = true;
  $scope.user = {'user':{'mail':'apollo-3@mail.ru','password':'apollo'}};
  $scope.login = function(user, remember) {
    auth.login(user, remember);
  };
});