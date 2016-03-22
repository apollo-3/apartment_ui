app.controller('login', function($scope, $http, $cookies, $state) {
  if (($cookies.get('mail') != null) && ($cookies.get('token') != null)) {
      $state.transitionTo('project');
  }
  
  $scope.remember = true;
  $scope.user = {'user':{'mail':'apollo-3@mail.ru','password':'apollo'}};
  
  $scope.login = function(user) {
    $http({
      method: 'post',
      url: 'http://192.168.33.11:3000/api/users/login',
      data: JSON.stringify($scope.user),
      headers: {'Content-Type': 'application/json'}
    }).then(function(res) { 
      if (res.data.hasOwnProperty('success')) {
        var expires_in = new Date();
        expires_in.setDate(expires_in.getDate() + 30);
        if ($scope.remember == true) {
          $cookies.put('mail', user.user['mail'], {'expires': expires_in});
          $cookies.put('token', res.data['token'], {'expires': expires_in});
        } else {
          $cookies.put('mail', user.user['mail']);
          $cookies.put('token', res.data['token']);
        }
        $state.transitionTo('project');
      } else {
        alert(res.data['error']);
      }
    })
  }  
});