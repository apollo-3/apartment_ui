app.controller('projects', function($scope, auth, project, $state, $cookies) {
  auth.checkSession();
  $scope.newProject = {flats:[], shared: false, currency: '$', rate: 1, owners:[$cookies.get('mail')]};
  $scope.newFormVisibility = false;
  $scope.mode = 'create';  
  $scope.currencies = ['$','€','₽','Br','£','₣','¥','₴'];
  
  $scope.checkIfEmpty = function() {
    if ($scope.projects.length == 0) {
      alert('You have no any prjects yet. Create one!');
    }
  }
  
  if (project.getAllUsers().length == 0) {
    project.reloadAllUsers().then(function(res) {
        $scope.allUsers = res.data['users'];
        $scope.userToAdd = $scope.allUsers[0];
        project.setAllUsers(jQuery.extend(true,{},$scope.allUsers));
    });  
  } else {
    $scope.allUsers = project.getAllUsers();
  }
  $scope.addUser = function() {
    if ($scope.newProject.owners.indexOf($scope.userToAdd) == -1) {
      $scope.newProject.owners.push($scope.userToAdd);
    }
  }  
  $scope.sharingChanged = function() {
    if (!$scope.newProject.shared) {
      $scope.newProject.owners = [$cookies.get('mail')];
    }
  }  
  $scope.delUser = function(user) {
    if (user != $cookies.get('mail')) {
      $scope.newProject.owners.splice($scope.newProject.owners.indexOf(user), 1);
    }
  }
  // $scope.saveNewProject = function() {
    // $scope.newProject = {flats:[], shared: false, currency: '$', owners:[$cookies.get('mail')]};
    // $scope.newFormVisibility = false;
  // }
  $scope.cancel = function() {
    $scope.newProject = {flats:[], shared: false, currency: '$',  rate: 1, owners:[$cookies.get('mail')]};
    $scope.projects = jQuery.extend(true,{}, project.getProjects());
    $scope.newFormVisibility = !$scope.newFormVisibility;
    $scope.mode = 'create';
  }
  
  if (project.getProjects().length == 0) {
    project.reloadProjects().then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data['error']);
      } else {
        $scope.projects = res.data;
        angular.forEach($scope.projects, function(item) {
          item['was_shared'] = item['shared'];
          item['active'] = false;
        });
        project.setProjects(jQuery.extend(true, {}, $scope.projects));
        $scope.checkIfEmpty();
      }
    });
  } else {
    $scope.projects = jQuery.extend(true, {}, project.getProjects());
  }
  
  $scope.saveProject = function() {
    if ($scope.mode == 'edit') {
      project.saveProject($scope.newProject).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          alert(res.data['error']);
        } else {
          angular.forEach($scope.projects, function(item) {
            if (item['name'] == $scope.newProject['name']) {
              item['was_shared'] = res.data['project']['shared'];
              item['name'] = res.data['project']['name'];
              item['owners'] = res.data['project']['owners']
            }
          });
          project.setProjects(jQuery.extend(true,{},$scope.projects));
          
          alert(res.data['success']);
          $scope.cancel();
        }
      });
    } else {
      project.createProject($scope.newProject).then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data['error']);
      } else {
        $scope.newProject = res.data['project'];
        $scope.newProject['was_shared'] = $scope.newProject['shared'];
        $scope.newProject['active'] = false;
        newTmp = []
        angular.forEach($scope.projects, function(item) {
          newTmp.push(item);
        });
        newTmp.push($scope.newProject);
        $scope.projects = newTmp;
        project.setProjects(jQuery.extend(true,{},$scope.projects));
        $scope.cancel();
        alert(res.data['success']);
      }
      });
    }
  }
  
  $scope.delProject = function(prj) {
    project.delProject(prj.name, prj.shared).then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data['error']);
      } else {
        newTmp = [];
        angular.forEach($scope.projects, function(item) {
          if (item['name'] != prj['name']) {
            newTmp.push(item);
          }
        });
        $scope.projects = newTmp;
        project.setProjects(jQuery.extend(true,{},$scope.projects));
        alert(res.data['success']);
        $scope.checkIfEmpty();
        if ($scope.newFormVisibility) {
          $scope.cancel();
        }
      }      
    });  
  }
  
  $scope.editProject = function(prj) {
    $scope.newFormVisibility = true;    
    $scope.mode = 'edit';
    $scope.newProject = prj;
  }
  
  $scope.goToProject = function(prj) {
    angular.forEach($scope.projects, function(item) {
      item.active = false;
    });
    prj.active = true;
    project.setProjects(jQuery.extend(true,{},$scope.projects));
    $state.transitionTo('project');
  }
  
});