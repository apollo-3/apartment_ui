app.controller('settings', function($scope, $cookies, auth, userData, $state, languages, $filter) {
  auth.checkSession();  
  
  if (jQuery.isEmptyObject(userData.getData())) {
    fakeLoadOn();
    userData.reloadData().then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data.error);
      } else {
        userData.setData(res.data.user);
        $scope.user = {user: jQuery.extend(true, {}, res.data.user)};
        $scope.user.user.password = '';
        $scope.LNG = languages[languages.availableLng()];
      }
      fakeLoadOff();      
    });
  }
  
  $scope.user = {user: jQuery.extend(true, {}, userData.getData())};
  $scope.user.user.password = '';
  $scope.LNG = languages[languages.availableLng()];
    
  $scope.langs = ['en', 'ru'];  
  $scope.mode = 'change';   
  $scope.isLogged = auth.isLogged();    
  
  $scope.error = '';
  
  $scope.confirm = function() {
    $scope.error = '';    
    fakeLoadOn();
    if ($scope.mode === 'change') {
      if (($filter('password')($scope.user.user.password)) &&
          ($filter('year')($scope.user.user.birthYear)) &&
          ($filter('name')($scope.user.user.name)) &&
          ($filter('phone')($scope.user.user.phone)) &&
          ($filter('geoName')($scope.user.user.country)) &&
          ($filter('geoName')($scope.user.user.state)) &&
          ($filter('geoName')($scope.user.user.city))) {      
        delete $scope.user.newPassword
        user = jQuery.extend(true,{}, $scope.user);
        user.user.token = $cookies.get('token');
        user.user.birthYear = parseInt(user.user.birthYear);
        updateUser(user);
      } else {
        $scope.error = $scope.LNG.wrong_fields_value;
        fakeLoadOff();
      }
    } else if ($scope.mode === 'delete') {
      if ($filter('password')($scope.user.user.password)) {
        user = {'user':{'mail': $cookies.get('mail'), 
                        'password': $scope.user.user.password, 
                        'token': $cookies.get('token')}}; 
        auth.delUser(user).then(function(res) {
          fakeLoadOff();
          if (res.data.hasOwnProperty('error')) {
            $scope.error = res.data.error;
          } else {
            auth.cleanCookies();
            $state.transitionTo('login');
          }
        });
      } else {
        $scope.error = $scope.LNG.wrong_fields_value;
        fakeLoadOff();
      }
    } else if ($scope.mode === 'password') {
      if (($filter('password')($scope.user.user.password)) &&
          ($filter('password')($scope.user.user.newPassword))) {
        user = {'user':{'mail': $cookies.get('mail'),
                        'password': $scope.user.user.password,
                        'newPassword': $scope.user.user.newPassword,
                        'token': $cookies.get('token')}};                
        updateUser(user);
      } else {
        $scope.error = $scope.LNG.wrong_fields_value;
        fakeLoadOff();
      }
    }
  };
  
  updateUser = function(user) {
    auth.updateUser(user).then(function(res) {
      fakeLoadOff();
      if (res.data.hasOwnProperty('success')) {       
        var expires_in = new Date();
        expires_in.setDate(expires_in.getDate() + 365);
        $cookies.put('lang', res.data.user.lang, {'expires': expires_in});
        
        userData.setData(res.data.user);
        $state.transitionTo('workplace');
      } else {
        $scope.error = res.data.error;
      }
    });    
  };  
  
  $scope.cancel = function() {
    $scope.user = {user: jQuery.extend(true,{},userData.getData())};
    $state.transitionTo('workplace');
  };
  
  $scope.customFilter = function(name) {
    switch (name) {
      case 'password':
        $scope.warn_password = !$filter('password')($scope.user.user.password);
        break;
      case 'new_password':
        $scope.warn_new_password = !$filter('password')($scope.user.user.newPassword);      
        break;
      case 'birth_year':
        $scope.warn_birth_year = !$filter('year')($scope.user.user.birthYear);            
        break;
      case 'name':
        $scope.warn_name = !$filter('name')($scope.user.user.name);      
        break;
      case 'phone':
        $scope.warn_phone = !$filter('phone')($scope.user.user.phone);      
        break;    
      case 'country':
        $scope.warn_country = !$filter('geoName')($scope.user.user.country);
        break;       
      case 'state':
        $scope.warn_state = !$filter('geoName')($scope.user.user.state);
        break;      
      case 'city':
        $scope.warn_city = !$filter('geoName')($scope.user.user.city);
        break;         
    }
  }
});