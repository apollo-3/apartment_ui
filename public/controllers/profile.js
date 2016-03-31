app.controller('profile', function($scope, $cookies, auth, userData, $state) {
  auth.checkSession();
  
  if (jQuery.isEmptyObject(userData.getData())) {
    userData.reloadData().then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data['errot']);
      } else {
        userData.setData(res.data['user']);
        $scope.user = {user: jQuery.extend(true, {}, res.data['user'])};
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
    auth.delUser(user);
  }
  
  $scope.updateUser = function(user) {    
    toSend = {};
    user.user.password = CryptoJS.MD5(user.user.password).toString();
    if ($scope.changePass) {
      user.user.newPassword = CryptoJS.MD5(user.user.newPassword).toString();
      toSend = {'user':{'mail':$cookies.get('mail'),'password':user.user['password'],'newPassword':user.user['newPassword'], 'token':$cookies.get('token')}};
    } else {
      user.user['token'] = $cookies.get('token');
      user.user['newPassword'] = '';
      delete user.user['newPassword'];
      toSend = user;
      ORIGINAL = userData.getData();
    }
    auth.updateUser(toSend);
  }
  
  $scope.cancel = function() {
    tmp = userData.getData();
    $scope.user = {user: tmp};
    $state.transitionTo('project');
  }
});