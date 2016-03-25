app.factory('project', function($http, $cookies, values) {
  projects = [];
  
  getProjects = function() {
    return projects;
  }
  
  setProjects = function(newProjects) {
    projects = newProjects;
  }
  
  addProject = function(project) {
    projects.push(project);
  }
  
  delProject = function(project) {
    projects.splice(projects.indexOf(project));
  }
  
  reloadProjects = function() {
    return $http({
      url: values.api_url + 'projects/getProject',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      method: 'post',
      data: 'mail=' + $cookies.get('mail') + '&token=' + $cookies.get('token') + '&defLang=' + values.def_lang
    })
  }
  
  return {
    getProjects: getProjects,
    setProjects: setProjects,
    addProject: addProject,
    delProject: delProject,
    reloadProjects: reloadProjects
  }
});