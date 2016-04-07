app.factory('auth', function($cookies, $http, $state, values, userData, project) {
  // Get default language
  var def_lang = (navigator.language || navigator.userLanguage).split('-')[0];
  
  var session = {
    // Set default language
    def_lang: def_lang,
    // Log user in
    login: function(user, remember) {
      user.user.password = CryptoJS.MD5(user.user.password).toString();
      user.user.defLang = def_lang;
      $http({
        method: 'post',
        url: values.api_url + '/users/login',
        data: user,
        headers: {'Content-Type': 'application/json'}
      }).then(function(res) { 
        if (res.data.hasOwnProperty('success')) {   
          userData.setData(res.data.user);
          var expires_in = new Date();
          expires_in.setDate(expires_in.getDate() + 365);
          if (remember === true) {
            $cookies.put('mail', user.user.mail, {'expires': expires_in});
            $cookies.put('token', res.data.token, {'expires': expires_in});          
          } else {
            $cookies.put('mail', user.user.mail);
            $cookies.put('token', res.data.token);           
          }
          $state.transitionTo('workplace');
          return res.data.user;
        } else {
          alert(res.data.error);
        }
      });   
    },
    // Logout
    logout: function() {
      $http({
        method: 'post',
        url: values.api_url +'users/logout',
        data: {'user':{'mail': $cookies.get('mail'), 'token': $cookies.get('token'), 'defLang' : def_lang}},
        headers: {'Content-Type': 'application/json'}
      }).then(function(res) { 
          $cookies.remove('mail');
          $cookies.remove('token');    
          project.setProjects([]);
          project.setAllUsers([]);
          $state.transitionTo('login');
      });
    },
    // Session check, move to login page if not authenticated
    checkSession: function() {
      mail = $cookies.get('mail');
      token = $cookies.get('token');   
      if ((mail === undefined) || (token === undefined)) {
        exceptions = ['register'];
        if (exceptions.indexOf($state.current.name)==-1) {
          $state.transitionTo('login');
        }
      } else if ((mail !== undefined) || (token !== undefined)) {
        exceptions = ['profile', 'projects', 'project'];
        if (exceptions.indexOf($state.current.name)==-1) {
          $state.transitionTo('workplace');
        }
      }
    },
    // If user is logged in check
    isLogged: function() {
      ifLogged = false;
      if (($cookies.get('mail') !== undefined) && ($cookies.get('token') !== undefined)) {
        ifLogged = true;
      }
      return ifLogged;
    },
    // User registration
    register: function(user) {
      user.user.defLang = def_lang;
      user.user.password = CryptoJS.MD5(user.user.password).toString();
      $http({
        method: 'post',
        url: values.api_url + 'users/register',
        data: user,
        headers: {'Content-Type': 'application/json'}        
      }).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          alert(res.data.error);
        } else {
          alert(res.data.success + '\n' + res.data.verifing_url);
          $state.transitionTo('workplace');
        }
      });
    },
    // Reset user's password
    resetPass: function(mail) {      
      $http({
        method: 'post',
        url: values.api_url + 'users/reqreset',
        data: 'mail=' + mail + '&defLang=' + def_lang,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          alert(res.data.error);
        } else {
          alert(res.data.success + '\n' + res.data.reset_url);
          $state.transitionTo('login');
        }        
      });
    },
    // Delete user
    delUser: function(user) {
      user.user.defLang = def_lang;
      user.user.password = CryptoJS.MD5(user.user.password).toString();
      $http({
        url: values.api_url + 'users/delete',
        method: 'delete',
        headers: {'Content-Type':'application/json'},
        data: user
      }).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          alert(res.data.error);
        } else {
          $cookies.remove('mail');
          $cookies.remove('token'); 
          alert(res.data.success);
          $state.transitionTo('login');
        }
      });
    },
    // Update user
    updateUser: function(user) {
      user.user.defLang = def_lang;
      $http({
        url: values.api_url + 'users/update',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data: user
      }).then(function(res) {
        if (res.data.hasOwnProperty('success')) {
          alert(res.data.success);
          userData.setData(res.data.user);
          $state.transitionTo('workplace');
        } else {
          alert(res.data.error);
        }
      });
    }
  };
  return session;
});