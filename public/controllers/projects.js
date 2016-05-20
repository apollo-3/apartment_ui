app.controller('projects', function($scope, auth, projects, $state, $cookies, languages, $filter, images, userData, values) {
  auth.checkSession();
  hideMap();
  
  $scope.newProjectOrg = {flats:[], shared: false, currency: '$', rate: '1', owners:[$cookies.get('mail')], description: '', name: ''};
  $scope.newProject = $.extend(true,{},$scope.newProjectOrg);
  
  $scope.currencies = ['$','€','₽','Br','£','₣','¥','₴'];    
  $scope.LNG = languages[languages.availableLng()];  
  $scope.mode = 'off';
  $scope.error = '';
  $scope.sortOptions = [{'type': 'date', 'value': $scope.LNG.created, 'field': 'creation_date', order: 'desc'},
                        {'type': 'string', 'value': $scope.LNG.project_name, 'field': 'name', order: 'asc'},
                        {'type': 'bool', 'value': $scope.LNG.shared, 'field': 'shared', order: 'asc'},
                        {'type': 'length', 'value': $scope.LNG.added, 'field': 'flats', order: 'asc'}];
  $scope.currentSort = {};  
                            
  // Loading the list of projects
  if (projects.getProjects().length === 0) {
    projects.reloadProjects().then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        // Worth keeping commented for production 
        // to prevent annoying messageing about expired token
        // swal($filter('capitalize')($scope.LNG.error), res.data.error);
        auth.logout();
      } else {
        $scope.projects = res.data;
        angular.forEach($scope.projects, function(item) {
          item.was_shared = item.shared;
          item.active = false;
        });
        projects.setProjects(jQuery.extend(true, {}, $scope.projects));
        $scope.checkIfEmpty();
      }
      fakeLoadOff();
    });
  } else {
    $scope.projects = jQuery.extend(true, [], projects.getProjects());
    fakeLoadOff();
  };   
  
  // Add a user to owners list
  $scope.addUser = function(owner) {
    if (($scope.newProject.owners.indexOf(owner) == -1) &&
       ((projects.getAllUsers()).indexOf(owner) != -1)) {    
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
      projects.saveProject($scope.newProject).then(function(res) {
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
          projects.setProjects(jQuery.extend(true,{},$scope.projects));          
          $scope.editorOff();
        }
      });
    } else {
      // Check user limits
      if ($scope.projects.length >= values.accounts[userData.getData().account].projects) {
        swal($filter('capitalize')($scope.LNG.warning), $scope.LNG.account_limit + '\"' + userData.getData().account + '\".');
        return
      }      
      projects.createProject($scope.newProject).then(function(res) {
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
          projects.setProjects(jQuery.extend(true,{},$scope.projects));
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
        // Saving images to delete after project removal
        imgsFromProject = [];
        angular.forEach(prj.flats, function(flat) {
          angular.forEach(flat.images, function(img) {
            imgsFromProject.push(img.img);
          });
        });            
        projects.delProject(prj.name, prj.shared).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          swal($filter('capitalize')($scope.LNG.error), res.data.error);
        } else {
          // Getting rid of unused photos from project
          images.groupDelImage(imgsFromProject).then(function(res) {            
          });
          newTmp = [];
          angular.forEach($scope.projects, function(item) {
            if (item.name != prj.name) {
              newTmp.push(item);
            }
          });
          $scope.projects = newTmp;
          projects.setProjects(jQuery.extend(true,{},$scope.projects));
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
    projects.setProjects(jQuery.extend(true,{},$scope.projects));
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
      $scope.projects = jQuery.extend(true,[], projects.getProjects());
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
  $scope.changeSort = function() {
    $filter('sort')($scope.projects, $scope.currentSort.field, $scope.currentSort.type, $scope.currentSort.order);
  };   
  
  // Watch for projects change and apply sort
  $scope.$watch('projects', function(o,n) {
    $scope.changeSort($scope.currentSort);
  });
});