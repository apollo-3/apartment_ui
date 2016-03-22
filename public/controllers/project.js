app.controller('project', function($scope, $http, $cookies, $state) {
  if (($cookies.get('mail') == undefined) || ($cookies.get('token') == undefined)) {
      $state.transitionTo('login');
  }
  
  $scope.logout = function(user) {
    $http({
      method: 'post',
      url: 'http://192.168.33.11:3000/api/users/logout',
      data: JSON.stringify({'user':{'mail': $cookies.get('mail'), 'token': $cookies.get('token')}}),
      headers: {'Content-Type': 'application/json'}
    }).then(function(res) { 
        $cookies.remove('mail');
        $cookies.remove('token');
        $state.transitionTo('login');
    })
  }
});