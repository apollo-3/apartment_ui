app.controller('register', function($scope, auth) {
  auth.checkSession();
  
  $scope.user = {user:{name:'dasha', mail:'dostojna9@mail.ru', password:'dasha'}}    
  
  $scope.register = function(user) {
    auth.register(user);
  }
});