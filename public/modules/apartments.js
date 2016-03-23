var app = angular.module('apartments',['ui.router','ngCookies']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/login");
  $stateProvider
    .state('login', {
      url: "/login",
      views: {
        "main": {
          templateUrl: "views/login.html",
          controller: 'login'          
        },
        "top": {
          templateUrl: "views/top.html",
          controller: "top"
        }
      },
    })
    .state('register', {
      url: "/register",
      views: {
        "main": {
          templateUrl: "views/register.html",
          controller: "register"          
        },
        "top": {
          templateUrl: "views/top.html",
          controller: "top"          
        }
      }

    })
    .state('project', {
      url: "/project",
      views: {
        "main": {
          templateUrl: "views/project.html",
          controller: 'project'            
        },
        "top": {
          templateUrl: "views/top.html",
          controller: "top"          
        }
      }    
    });
});