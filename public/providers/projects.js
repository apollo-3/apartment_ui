app.factory('projects', function($http, $cookies, values) {
  allUsers = [];
  projects = [];
  
  getProjects = function() {
    return projects;
  };
  
  setProjects = function(newProjects) {
    projects = newProjects;
  }; 
  
  reloadProjects = function() {
    return $http({
      url: values.api_url + 'projects/getProject',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      method: 'post',
      data: 'mail=' + $cookies.get('mail') + '&token=' + $cookies.get('token') + '&defLang=' + values.def_lang
    });
  }; 
  
  saveProject = function(prj) {
    prj.mail = $cookies.get('mail');
    prj.token = $cookies.get('token');
    prj.defLang = values.def_lang; 
    prj.flats = flatChecker(prj.flats);
    delete prj.active;    
    prj = {project: prj};
    return $http({
      url: values.api_url + 'projects/saveProject',
      headers: {'Content-Type':'application/json'},
      method: 'post',
      data: prj
    });
  };
  
  createProject = function(prj) {
    prj.mail = $cookies.get('mail');
    prj.token = $cookies.get('token');
    prj.defLang = values.def_lang;
    prj.flats = flatChecker(prj.flats);   
    prj = {project: prj};
    return $http({
      url: values.api_url + 'projects/createProject',
      headers: {'Content-Type':'application/json'},
      method: 'post',
      data: prj
    });   
  };
  
  delProject = function(name, shared) {
    return $http({
      url: values.api_url + 'projects/delProject',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      method: 'post',
      data: 'mail=' + $cookies.get('mail') + '&token=' + $cookies.get('token') + '&defLang=' + values.def_lang + '&shared=' + shared + '&name=' + name
    });    
  };
  
  syncProject = function(prj) {
    angular.forEach(projects, function(item) {
      if (item.name == prj.name) {
        item.flats = jQuery.extend(true,[], prj.flats);
      }
    });
  };
  
  getAllUsers = function() {
    return allUsers;
  };
  
  setAllUsers = function(users) {
    allUsers = users;
  };
  
  reloadAllUsers = function() {
    return $http({
      url: values.api_url + 'users/allUsers',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      method: 'post',
      data: 'mail=' + $cookies.get('mail') + '&token=' + $cookies.get('token') + '&defLang=' + values.def_lang
    });
  };
  
  getAllUsersArray = function() {
    out = [];
    angular.forEach(allUsers, function(val, key) {
      out.push(val);
    });
    return out;
  };
  
  flatChecker = function(flats) {
    angular.forEach(flats, function(flat) {
      if (flat.price != '') {
        flat.price = parseInt(flat.price); 
      } else {
        flat.price = 0;
      }
      if (flat.buildYear != '') {
        flat.buildYear = parseInt(flat.buildYear); 
      } else {
        flat.buildYear = 0;
      }
      if (flat.floor != '') {      
        flat.floor = parseInt(flat.floor);
      } else {
        flat.floor = 0;
      }
    });     
    return flats;
  };
  
  return {
    getProjects: getProjects,
    setProjects: setProjects,
    delProject: delProject,
    reloadProjects: reloadProjects,
    saveProject: saveProject,
    createProject: createProject,
    syncProject: syncProject,
    getAllUsers: getAllUsers,
    setAllUsers: setAllUsers,
    reloadAllUsers: reloadAllUsers,
    getAllUsersArray: getAllUsersArray
  };
});