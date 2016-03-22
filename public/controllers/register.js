app.controller('register', function($scope, $http, $cookies, $state) {
  alert('sss');fg
  if (($cookies.get('mail') == undefined) || ($cookies.get('token') == undefined)) {
      $state.transitionTo('login');
  } 
  if (($cookies.get('mail') != undefined) && ($cookies.get('token') != undefined)) {
      $state.transitionTo('project');
  }
});