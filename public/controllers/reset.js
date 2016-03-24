app.controller('reset', function($scope, auth) {
  $scope.mail = 'dostojna9@mail.ru';
  
  $scope.resetPass = function(mail) {
    auth.resetPass(mail);
  }
});