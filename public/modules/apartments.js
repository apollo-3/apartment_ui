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
    .state('about', {
      url: "/about",
      views: {
        "main": {
          templateUrl: "views/about.html",
          controller: "about"
        },
        
        "top": {
          templateUrl: "views/top.html",
          controller: "top"
        }
      }
    })
    .state('contacts', {
      url: "/contacts",
      views: {
        "main": {
          templateUrl: "views/contacts.html",
          controller: "contacts"
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
    .state('settings', {
      url: "/settings",
      views: {
        "main": {
          templateUrl: "views/settings.html",
          controller: "settings"
        },
        "top": {
          templateUrl: "views/top.html",
          controller: "top"
        }
      }
    })
    .state('utils', {
      url: "/utils",
      views: {
        "main": {
          controller: "utils"
        }
      }
    });
});

// Open up loading screen on state change
app.run(function($rootScope) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    $("#loading").css('display','block');
  });  
});