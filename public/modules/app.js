var app = angular.module('apartments',['ui.router','ngCookies']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html",
      controller: 'login'
    })
    .state('register', {
      url: "/register",
      templateUrl: "views/register.html",
      controller: 'register'         
    })
    .state('project', {
      url: "/project",
      templateUrl: "views/project.html",
      controller: 'project'      
    });
});