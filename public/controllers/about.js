app.controller('about', function($scope, auth, languages, $http, values) {
  auth.checkSession();
  
  fakeLoadOff();
  hideMap();

  $scope.LNG = languages[languages.availableLng()];
  $scope.usersNum = '1000';  
  
  $http({url: values.api_url + '/users/getUsersNum',
    method: 'get', headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function(res) {
        if (res.data.hasOwnProperty('success')) {
          $scope.usersNum = res.data.size;
          $scope.we_have_users = $scope.usersNum + ' ' + $scope.LNG.we_have_users;
        }
    });
});