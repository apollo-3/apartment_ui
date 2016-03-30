app.controller('project', function($scope, auth, project, $state, userData) {
  auth.checkSession();  
  
  $scope.toEdit = {phones:[{phone:''}], modified:'update'};
  $scope.mode = 'create';
  $scope.isEditorOpen = false;
  $scope.tmpProject = {};
  $scope.currency = userData.getData()['currency'];
  
  $scope.checkIfEmpty = function() {
    if ($scope.project.flats.length == 0) {
      alert('Current project is empty. Add some items into it.');
    }
  }   
  
  if (project.getProjects().length == 0) {
    $state.transitionTo('projects');
  } else {
    ifActiveExist = false;
    angular.forEach(project.getProjects(), function(item) {
      if (item.active == true) {
        ifActiveExist = true;
        $scope.project = jQuery.extend(true,{},item);
        $scope.tmpProject = jQuery.extend(true,{},item);
        $scope.checkIfEmpty();
      }
    });
    if (!ifActiveExist) {
      $state.transitionTo('projects');
    }
  } 
  
  $scope.toggleEditor = function() {
    if ($scope.mode == 'create') {
      if (!$scope.isEditorOpen) {
        $scope.toEdit = {phones: [{phone:''}], modified: 'update'};
        $scope.project.flats.unshift($scope.toEdit);
      } else {
        $scope.toEdit = {phones: [{phone:''}], modified: 'update'};
        $scope.project.flats.splice(0,1);
      }
    } else {
      if ($scope.isEditorOpen) {
        $scope.toEdit = {phones: [{phone:''}], modified: 'update'};
        $scope.project = jQuery.extend(true,{},$scope.tmpProject);
        $scope.mode = 'create';
      }
    }
    $scope.isEditorOpen = !$scope.isEditorOpen;
  }
  
  $scope.confirm = function() {
    newPhones = [];
    angular.forEach($scope.toEdit['phones'], function(phone) {
      flag = true;
      angular.forEach(newPhones, function(phone2) {
        if (phone2['phone'] == phone['phone']) {
          flag = false;
        }        
      });
      if (flag) {
        newPhones.push(phone);
      }
    });
    $scope.toEdit['phones'] = newPhones;
    
    project.saveProject($scope.project).then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data['error']);
      } else {
        $scope.project = res.data['project'];
        $scope.project['was_shared'] = $scope.project['shared'];
        $scope.tmpProject = jQuery.extend(true,{},$scope.project);
        $scope.toEdit = {phones: [{phone:''}], modified: 'update'};
        $scope.project = jQuery.extend(true,{},$scope.tmpProject);
        project.syncProject($scope.project);
        $scope.isEditorOpen = !$scope.isEditorOpen;
        $scope.mode = 'create';
      }
    });
  }  
  
  $scope.edit = function(flat) {
    if ($scope.isEditorOpen) {
      $scope.toggleEditor();
    }
    $scope.mode = 'edit';
    flat['modified'] = 'update';
    $scope.toEdit = flat;
    $scope.isEditorOpen = true;
  }
  
  $scope.del = function(flat) {
    if ($scope.isEditorOpen) {
      $scope.toggleEditor();
    }
    $scope.project['flats'].splice($scope.project['flats'].indexOf(flat),1);
    project.saveProject($scope.project).then(function(res) {
      if (res.data.hasOwnProperty('success')) {
        project.syncProject($scope.project);
        $scope.tmpProject = jQuery.extend(true,{},$scope.project);
      } else {
        alert(res.data['error']);
        $scope.project = jQuery.extend(true,{},$scope.tmpProject);
      }
    });
  }
  
  $scope.addPhone = function(phone) {    
    flag = true;
    angular.forEach($scope.toEdit['phones'], function(phone) {
      if (phone['phone'] == '') {
        flag = false;
      }
    });
    if (flag) {
      $scope.toEdit['phones'].push({phone:''});
    }
  }  
  
  $scope.delPhone = function(phone) {
    $scope.toEdit['phones'].splice($scope.toEdit['phones'].indexOf(phone),1);
  }
  
});