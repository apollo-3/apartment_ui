app.factory('auth', function($cookies, $http, $state, values, projects) {
  
  cleanCookies = function() {
    $cookies.remove('mail');
    $cookies.remove('token');     
    $cookies.remove('lang');          
  }

  var session = {
    // Log user in
    login: function(user) {
      tUser = jQuery.extend(true,{},user);
      tUser.user.password = CryptoJS.MD5(tUser.user.password).toString();
      tUser.user.defLang = values.def_lang;
      return $http({
        method: 'post',
        url: values.api_url + '/users/login',
        data: tUser,
        headers: {'Content-Type': 'application/json'}
      });
    },
    // Logout
    logout: function() {
      fakeLoadOn();
      $http({
        method: 'post',
        url: values.api_url +'users/logout',
        data: {'user':{'mail': $cookies.get('mail'), 'token': $cookies.get('token'), 'defLang' : values.def_lang}},
        headers: {'Content-Type': 'application/json'}
      }).then(function(res) { 
          cleanCookies();        
          projects.setProjects([]);
          projects.setAllUsers([]);
          $state.transitionTo('login');
          fakeLoadOff();
      });
    },
    // Session check, move to login page if not authenticated
    checkSession: function() {
      mail = $cookies.get('mail');
      token = $cookies.get('token');   
      if ((mail === undefined) || (token === undefined)) {
        exceptions = [];
        if (exceptions.indexOf($state.current.name)==-1) {
          $state.transitionTo('login');
        }
      } else if ((mail !== undefined) || (token !== undefined)) {
        redirectPages = ['login'];
        if ((redirectPages.indexOf($state.current.name)!=-1)) {
          // Change to workplace when it is implemented (another block is in "Login" and "Settings" controller)
          // $state.transitionTo('workplace');          
          $state.transitionTo('projects');
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
      tUser = jQuery.extend(true,{},user);
      tUser.user.defLang = values.def_lang;
      tUser.user.password = CryptoJS.MD5(tUser.user.password).toString();
      return $http({
        method: 'post',
        url: values.api_url + 'users/register',
        data: tUser,
        headers: {'Content-Type': 'application/json'}        
      });
    },
    // Reset user's password
    resetPass: function(mail) {      
      return $http({
        method: 'post',
        url: values.api_url + 'users/reqreset',
        data: 'mail=' + mail + '&defLang=' + values.def_lang,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    // Delete user
    delUser: function(user) {
      tUser = jQuery.extend(true,{},user);
      tUser.user.defLang = values.def_lang;
      tUser.user.password = CryptoJS.MD5(tUser.user.password).toString();
      return $http({
        url: values.api_url + 'users/delete',
        method: 'delete',
        headers: {'Content-Type':'application/json'},
        data: tUser
      });
    },
    // Update user
    updateUser: function(user) {
      tUser = jQuery.extend(true,{},user);
      tUser.user.password = CryptoJS.MD5(tUser.user.password).toString();
      if (tUser.user.hasOwnProperty('newPassword')) {
        tUser.user.newPassword = CryptoJS.MD5(tUser.user.newPassword).toString();
      }
      tUser.user.defLang = values.def_lang;
      return $http({
        url: values.api_url + 'users/update',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data: tUser
      });
    },
    // Set Cookies
    setCookies: function(remember, mail, token, lang) {
      var expires_in = new Date();
      expires_in.setDate(expires_in.getDate() + 365);
      if (remember === true) {
        $cookies.put('mail', mail, {'expires': expires_in});
        $cookies.put('token', token, {'expires': expires_in});  
        $cookies.put('lang', lang, {'expires': expires_in}); 
      } else {
        $cookies.put('mail', mail);
        $cookies.put('token', token);    
        $cookies.put('lang', lang);         
      }      
    },
    // Clean Cookies
    cleanCookies: cleanCookies
  };
  
  return session;
});