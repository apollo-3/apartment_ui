app.controller('project', function($scope, auth, project, $state) {
  auth.checkSession();
  $scope.projects = [];
  
  project.reloadProjects().then(function(res) {
    if (res.data.hasOwnProperty('error')) {
      alert(res.data['error']);
    } else {
      project.setProjects(res.data);
      tmp = jQuery.extend(true, {}, project.getProjects());
      angular.forEach(tmp, function(item) {
        item['was_shared'] = item['shared'];
      });
      $scope.projects = tmp;
    }
  });
  
  $scope.saveProject = function(prj) {
    project.saveProject(prj).then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data['error']);
      } else {
        angular.forEach(tmp, function(item) {
          if (item['name'] == prj['name']) {
            item['was_shared'] = item['shared'];
            item['name'] = res.data['project']['name'];
            item['owners'] = res.data['project']['owners']
            delete item.defLang;
            delete item.token;
            delete item.mail;
          }
        });
        project.setProjects(tmp);
        
        alert(res.data['success']);
      }
    });
  }
  
  $scope.delProject = function(prj) {
    project.delProject(prj.name, prj.shared).then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data['error']);
      } else {
        newTmp = [];
        angular.forEach(tmp, function(item) {
          if (item['name'] != prj['name']) {
            newTmp.push(item);
          }
        });
        tmp = newTmp;
        project.setProjects(tmp);    
        $scope.projects = tmp;
        alert(res.data['success']);
      }      
    });  
  }
  
  $scope.cancel = function() {
    tmp = project.getProjects();    
    $state.transitionTo('workplace');
  }
  
});