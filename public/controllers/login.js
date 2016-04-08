app.controller('login', function($scope, auth, userData, $state) {
  auth.checkSession();
  
  $scope.mode = 'login';
  $scope.remember = true;
  $scope.error = '';
  // $scope.user = {'user':{'mail':'apollo-3@mail.ru','password':'apollo'}};
  $scope.user = {'user':{'mail':'','password':''}};
  $scope.login = function() {
    fakeLoadOn();
    $scope.error = '';
    auth.login($scope.user).then(function(res) {
      if (res.data.hasOwnProperty('success')) {   
        userData.setData(res.data.user);
        auth.setCookies($scope.remember, $scope.user.user.mail, res.data.token);
        $state.transitionTo('workplace');
      } else {
        $scope.error = res.data.error;
      }
      fakeLoadOff();      
    });
  };
  
  $scope.register = function() {  
    $scope.error = '';
    auth.register($scope.user).then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        $scope.error = res.data.error;
      } else {
        alert(res.data.success + '\n' + res.data.verifing_url);
        $state.transitionTo('workplace');
      }      
    });
  };  

  $scope.resetPass = function() {
    $scope.error = '';
    auth.resetPass($scope.user.user.mail).then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        $scope.error = res.data.error;
      } else {
        window.prompt(res.data.success, res.data.reset_url);
        $state.transitionTo('login');
      }        
    });
  };
  
});