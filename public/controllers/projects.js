app.controller('projects', function($scope, auth, project, $state, $cookies, languages, $filter) {
  auth.checkSession();
  
  $scope.newProjectOrg = {flats:[], shared: false, currency: '$', rate: '1', owners:[$cookies.get('mail')], description: '', name: ''};
  $scope.newProject = $.extend(true,{},$scope.newProjectOrg);
  
  $scope.currencies = ['$','€','₽','Br','£','₣','¥','₴'];    
  $scope.LNG = languages[languages.availableLng()];  
  $scope.mode = 'off';
  $scope.error = '';
  $scope.sortOptions = [{'type': 'string', 'value': $scope.LNG.project_name, 'field': 'name', order: 'asc'},
                        {'type': 'date', 'value': $scope.LNG.created, 'field': 'creation_date', order: 'asc'},
                        {'type': 'bool', 'value': $scope.LNG.shared, 'field': 'shared', order: 'asc'}];
    
  // Loading the list of projects
  if (project.getProjects().length === 0) {
    project.reloadProjects().then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        swal($filter('capitalize')($scope.LNG.error), res.data.error);
      } else {
        $scope.projects = res.data;
        angular.forEach($scope.projects, function(item) {
          item.was_shared = item.shared;
          item.active = false;
        });
        project.setProjects(jQuery.extend(true, {}, $scope.projects));
        $scope.checkIfEmpty();
      }
    });
  } else {
    $scope.projects = jQuery.extend(true, [], project.getProjects());
  }    

  // Get the list of all users
  if (project.getAllUsers().length === 0) {
    project.reloadAllUsers().then(function(res) {      
        $scope.allUsers = res.data.users;
        project.setAllUsers(jQuery.extend(true,{},$scope.allUsers));
    });  
  } else {
    $scope.allUsers = project.getAllUsers();
  }    
  
  // Add a user to owners list
  $scope.addUser = function(owner) {
    if (($scope.newProject.owners.indexOf(owner) == -1) &&
       ((project.getAllUsersArray()).indexOf(owner) != -1)) {    
      $scope.newProject.owners.push(owner);
    }
  };
  
  // Delete the user from list
  $scope.delUser = function(user) {
    if (user !== $cookies.get('mail')) {
      $scope.newProject.owners.splice($scope.newProject.owners.indexOf(user), 1);
    }
  };
  
  // Warn user if he doesn't have any projects
  $scope.checkIfEmpty = function() {
    if ($scope.projects.length === 0) {
      swal($filter('capitalize')($scope.LNG.welcome), $scope.LNG.no_projects);
    }
  };    
  
  // Saving a new or existing project
  $scope.saveProject = function() {
    if ($scope.mode == 'edit') {
      project.saveProject($scope.newProject).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          $scope.error = res.data.error;
        } else {
          angular.forEach($scope.projects, function(item) {
            if (item.name == $scope.newProject.name) {
              item.was_shared = res.data.project.shared;
              item.name = res.data.project.name;
              item.owners = res.data.project.owners;
            }
          });
          project.setProjects(jQuery.extend(true,{},$scope.projects));          
          $scope.editorOff();
        }
      });
    } else {
      project.createProject($scope.newProject).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          $scope.error = res.data.error;
        } else {
          $scope.newProject = res.data.project;
          $scope.newProject.was_shared = $scope.newProject.shared;
          $scope.newProject.active = false;
          newTmp = [];
          angular.forEach($scope.projects, function(item) {
            newTmp.push(item);
          });
          newTmp.push($scope.newProject);
          $scope.projects = newTmp;
          project.setProjects(jQuery.extend(true,{},$scope.projects));
          $scope.editorOff();        
        }    
      });
    }
  };
  
  // Project deletion
  $scope.delProject = function(prj) {
    swal({title: $filter('capitalize')($scope.LNG.warning), 
          text: $scope.LNG.are_you_sure_delete + '?',
          type: "warning", showCancelButton: true}, function() {
          project.delProject(prj.name, prj.shared).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          swal($filter('capitalize')($scope.LNG.error), res.data.error);
        } else {
          newTmp = [];
          angular.forEach($scope.projects, function(item) {
            if (item.name != prj.name) {
              newTmp.push(item);
            }
          });
          $scope.projects = newTmp;
          project.setProjects(jQuery.extend(true,{},$scope.projects));
          $scope.checkIfEmpty();
          $scope.editorOff();
        }      
      });
    });
  };

  // Open project
  $scope.goToProject = function(prj) {
    angular.forEach($scope.projects, function(item) {
      item.active = false;
    });
    prj.active = true;
    project.setProjects(jQuery.extend(true,{},$scope.projects));
    $state.transitionTo('project');
  };
  
  // Edit Project
  $scope.editProject = function(project) {
    if ($scope.mode == 'edit') {
      $scope.editorOff();
    }
    $scope.newProject = project;
    $scope.mode = 'edit';
  }  
  
  // Close editor (for a new or existing project)
  $scope.editorOff = function() {
    if ($scope.mode == 'edit') {      
      $scope.projects = jQuery.extend(true,{}, project.getProjects());
    }
    $scope.newProject = $.extend(true,{}, $scope.newProjectOrg);     
    $scope.mode = 'off';   
    $scope.error = '';
  };  
  
  // Setting warning classes using filters
  $scope.customFilter = function(name) {
    switch (name) {
      case 'exchange-rate': $scope.warn_exchange_rate = !$filter('float')($scope.newProject.rate);
        break
      case 'project-name': $scope.warn_name = !$filter('name')($scope.newProject.name);
        break   
      case 'description': $scope.warn_description = !$filter('description')($scope.newProject.description);
        break         
    }
  }
  // Check if all fields are correct
  $scope.filterCheck = function() {
    result = false;
    if (($filter('name')($scope.newProject.name)) &&
       ($filter('float')($scope.newProject.rate)) &&
       ($filter('description')($scope.newProject.description))) {
      result = true;
    }
    return result;
  };    
  
  // Change sort type on projects list
  $scope.changeSort = function(op) {
    console.log($scope.projects);
    $filter('sort')($scope.projects, op.field, op.type, op.order);
  };  
  
});