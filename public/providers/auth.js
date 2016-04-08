app.factory('auth', function($cookies, $http, $state, values, project) {

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
      $http({
        method: 'post',
        url: values.api_url +'users/logout',
        data: {'user':{'mail': $cookies.get('mail'), 'token': $cookies.get('token'), 'defLang' : values.def_lang}},
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
        exceptions = [];
        if (exceptions.indexOf($state.current.name)==-1) {
          $state.transitionTo('login');
        }
      } else if ((mail !== undefined) || (token !== undefined)) {
        redirectPages = ['login'];
        if ((redirectPages.indexOf($state.current.name)!=-1)) {
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
    updateUser: function(user, changePass) {
      tUser = jQuery.extend(true,{},user);
      tUser.user.password = CryptoJS.MD5(tUser.user.password).toString();
      if (changePass) {
        tUser.user.newPassword = CryptoJS.MD5(tUser.user.newPassword).toString();
      } else {
        delete tUser.newPassword;
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
    setCookies: function(remember, mail, token) {
      var expires_in = new Date();
      expires_in.setDate(expires_in.getDate() + 365);
      if (remember === true) {
        $cookies.put('mail', mail, {'expires': expires_in});
        $cookies.put('token', token, {'expires': expires_in});          
      } else {
        $cookies.put('mail', mail);
        $cookies.put('token', token);           
      }      
    },
    // Clean Cookies
    cleanCookies: function() {
      $cookies.remove('mail');
      $cookies.remove('token');      
    }
  };
  return session;
});