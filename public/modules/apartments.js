var app = angular.module('apartments',['ui.router','ngCookies','angularFileUpload']);

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
    .state('workplace', {
      url: "/workplace",
      views: {
        "main": {
          templateUrl: "views/workplace.html",
          controller: 'workplace'            
        },
        "top": {
          templateUrl: "views/top.html",
          controller: "top"          
        }
      }    
    })    
    .state('projects', {
      url: "/projects",
      views: {
        "main": {
          templateUrl: "views/projects.html",
          controller: 'projects'          
        },
        "top": {
          templateUrl: "views/top.html",
          controller: "top"          
        }
      }    
    })
    .state('reset', {
      url: "/reset",
      views: {
        "main": {
          templateUrl: "views/reset.html",
          controller: 'reset'
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
          controller: "project"
        },
        "top": {
          templateUrl: "views/top.html",
          controller: "top"
        }
      }
    })    
    .state('profile', {
      url: "/profile",
      views: {
        "main": {
          templateUrl: "views/profile.html",
          controller: "profile"
        },
        "top": {
          templateUrl: "views/top.html",
          controller: "top"
        }
      }
    });
});