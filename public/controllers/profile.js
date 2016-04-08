app.controller('profile', function($scope, $cookies, auth, userData, $state) {
  auth.checkSession();
  
  if (jQuery.isEmptyObject(userData.getData())) {
    userData.reloadData().then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data.error);
      } else {
        userData.setData(res.data.user);
        $scope.user = {user: jQuery.extend(true, {}, res.data.user)};
      }
    });
  }
  
  tmp = jQuery.extend(true, {}, userData.getData());
  $scope.user = {user: tmp};
  $scope.user.user.password = '';
  $scope.wannaDelete = false;
  $scope.changePass = false;
  $scope.langs = ['en', 'ru'];
  
  $scope.isLogged = auth.isLogged();
  
  $scope.delUser = function(password) {
    user = {'user':{'mail':$cookies.get('mail'), 'password':password, 'token':$cookies.get('token')}};
    auth.delUser(user).then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data.error);
      } else {
        auth.cleanCookies();
        alert(res.data.success);
        $state.transitionTo('login');
      }
    });
  };
  
  $scope.updateUser = function(user) {    
    toSend = {};
    if ($scope.changePass) {
      toSend = {'user':{'mail':$cookies.get('mail'),'password':user.user.password,'newPassword':user.user.newPassword, 'token':$cookies.get('token')}};
    } else {
      user.user.token = $cookies.get('token');
      toSend = user;
    }
    
    auth.updateUser(toSend, $scope.changePass).then(function(res) {
      if (res.data.hasOwnProperty('success')) {
        alert(res.data.success);
        userData.setData(res.data.user);
        $state.transitionTo('workplace');
      } else {
        alert(res.data.error);
      }
    });
  };
  
  $scope.cancel = function() {
    tmp = userData.getData();
    $scope.user = {user: tmp};
    $state.transitionTo('project');
  };
});