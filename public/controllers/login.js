app.controller('login', function($scope, auth, userData, $state, $filter, values, languages) {
  auth.checkSession();
  hideMap();
  fakeLoadOff();
  
  $scope.mode = 'login';
  $scope.remember = true;
  $scope.error = '';
  $scope.user = {'user':{'mail':'','password':''}};
  
  $scope.LNG = languages[languages.availableLng()];
  
  $scope.login = function() {
    if (($filter('email')($scope.user.user.mail)) && ($filter('password')($scope.user.user.password))) {    
      fakeLoadOn();
      $scope.error = '';
      auth.login($scope.user).then(function(res) {
        if (res.data.hasOwnProperty('success')) {   
          userData.setData(res.data.user);
          auth.setCookies($scope.remember, $scope.user.user.mail, res.data.token, res.data.user.lang);
          $state.transitionTo('workplace');
        } else {
          $scope.error = res.data.error;
        }
        fakeLoadOff();      
      });
    }
  };
  
  $scope.register = function() { 
    if (($filter('email')($scope.user.user.mail)) && ($filter('password')($scope.user.user.password))) {  
      $scope.error = '';
      auth.register($scope.user).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          $scope.error = res.data.error;
        } else {
          alert(res.data.success + '\n' + res.data.verifing_url);
          $state.transitionTo('workplace');
        }      
      });
    }
  };  

  $scope.resetPass = function() {
    if ($filter('email')($scope.user.user.mail)) {
      $scope.error = '';
      auth.resetPass($scope.user.user.mail).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          $scope.error = res.data.error;
        } else {
          window.prompt(res.data.success, res.data.reset_url);
          $state.transitionTo('login');
        }        
      });
    }
  };
  
  $scope.customFilters = function(name) {
    switch (name) {
      case 'email':     
        $scope.warn_mail = !$filter('email')($scope.user.user.mail);
        break;
      case 'password':
        $scope.warn_password = !$filter('password')($scope.user.user.password);
        break;        
    }        
  };
  
});