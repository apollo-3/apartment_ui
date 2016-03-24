app.controller('register', function($scope, auth) {
  auth.checkSession();
  
  $scope.user = {user:{mail:'dostojna9@mail.ru', password:'dasha', lang: auth.def_lang}}
  
  $scope.register = function(user) {
    auth.register(user);
  }
});