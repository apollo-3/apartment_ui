app.factory('auth', function($cookies, $http, $state, values) {
  var session = {
    login: function(user, remember) {
      $http({
        method: 'post',
        url: values.api_url + '/users/login',
        data: JSON.stringify(user),
        headers: {'Content-Type': 'application/json'}
      }).then(function(res) { 
        if (res.data.hasOwnProperty('success')) {
          var expires_in = new Date();
          expires_in.setDate(expires_in.getDate() + 30);
          if (remember == true) {
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
    },
    logout: function() {
      $http({
        method: 'post',
        url: values.api_url +'users/logout',
        data: JSON.stringify({'user':{'mail': $cookies.get('mail'), 'token': $cookies.get('token')}}),
        headers: {'Content-Type': 'application/json'}
      }).then(function(res) { 
          $cookies.remove('mail');
          $cookies.remove('token');
          $state.transitionTo('login');
      })
    },
    checkSession: function() {
      mail = $cookies.get('mail');
      token = $cookies.get('token');   
      if ((mail == undefined) || (token == undefined)) {
        if ($state.current.name != 'register') {
          $state.transitionTo('login');
        }
      } else if ((mail != undefined) || (token != undefined)) {
        $state.transitionTo('project');
      }
    },
    isLogged: function() {
      ifLogged = false;
      if (($cookies.get('mail') != undefined) && ($cookies.get('token') != undefined)) {
        ifLogged = true;
      }
      return ifLogged;
    },
    register: function(user) {
      $http({
        method: 'post',
        url: values.api_url + 'users/register',
        data: user,
        headers: {'Content-Type': 'application/json'}        
      }).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          alert(res.data['error']);
        } else {
          alert(res.data['success'] + '\n' + res.data['verifing_url']);
          $state.transitionTo('project');
        }
      });
    }
  }
  return session;
});