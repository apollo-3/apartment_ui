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
  
  saveProject = function(prj) {
    prj['mail'] = $cookies.get('mail');
    prj['token'] = $cookies.get('token');
    prj['defLang'] = values.def_lang;
    prj = {project: prj};
    return $http({
      url: values.api_url + 'projects/saveProject',
      headers: {'Content-Type':'application/json'},
      method: 'post',
      data: prj
    })
  }
  
  delProject = function(name, shared) {
    return $http({
      url: values.api_url + 'projects/delProject',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      method: 'post',
      data: 'mail=' + $cookies.get('mail') + '&token=' + $cookies.get('token') + '&defLang=' + values.def_lang + '&shared=' + shared + '&name=' + name
    })    
  }
  
  return {
    getProjects: getProjects,
    setProjects: setProjects,
    addProject: addProject,
    delProject: delProject,
    reloadProjects: reloadProjects,
    saveProject: saveProject
  }
});