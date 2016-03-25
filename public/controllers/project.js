app.controller('project', function($scope, auth, project) {
  auth.checkSession();
  
  $scope.projects = project.getProjects();
  
  project.reloadProjects().then(function(res) {
    if (res.data.hasOwnProperty('error')) {
      alert(res.data['error']);
    } else {
      project.setProjects(res.data);
      $scope.projects = project.getProjects();      
    }
  });
  
});