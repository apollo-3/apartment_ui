app.controller('project', function($scope, auth, project, $state, userData, $cookies, values, FileUploader, images) {
  auth.checkSession();  
  
  $scope.defaultToEdit = {phones:[{phone:''}], modified:'update', 
                          price: 0, owner: false, callHistory: 'toCall',
                          stars: 0, images: []};
  $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
  $scope.mode = 'create';
  $scope.isEditorOpen = false;
  $scope.tmpProject = {};
  $scope.currency = userData.getData()['currency'];
  $scope.callHistoryOptions = ['called', 'callBack', 'toCall'];
  $scope.stars = [0, 1, 2, 3, 4, 5];
  $scope.max_images = values.max_images;
  
  $scope.useConverter = false;
  $scope.exchangeRate = 1;
  $scope.inputCurrency = 0;
  
  $scope.uploader = new FileUploader({url: values.api_url + 'images/uploadImage',
                                      alias: 'image',
                                      removeAfterUpload: true,
                                      formData: [{mail:$cookies.get('mail'),token:$cookies.get('token'), defLang: values.def_lang}],
                                      queueLimit: 4});
  $scope.uploader.filters.push({name:'imageFilter', fn:function(item) {
      flag = false;
      allowedTypes = ['jpg','png','jpeg','bmp','gif'];
      
      type = item.type.slice(item.type.lastIndexOf('/') + 1);
      
      if ((allowedTypes.indexOf(type)!= -1) && ((item.size/1024/1024) < 5)) {
        flag = true;
      }
      
      return flag;
    }
  });
  $scope.uploader.onCompleteItem = function(item, res) {
    $scope.toEdit['images'].push(res['image']);
  };
  
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
       $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
      if (!$scope.isEditorOpen) {
        $scope.project.flats.unshift($scope.toEdit);
      } else {
        $scope.project.flats.splice(0,1);
        $scope.useConverter = false;        
      }
    } else {
      if ($scope.isEditorOpen) {
        $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
        $scope.project = jQuery.extend(true,{},$scope.tmpProject);
        $scope.mode = 'create';
        $scope.useConverter = false;
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
        $scope.useConverter = false;
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
    if ($scope.toEdit['phones'].length > 1) {
      $scope.toEdit['phones'].splice($scope.toEdit['phones'].indexOf(phone),1);
    }
  }  
  
  $scope.converterClick = function() {
    $scope.exchangeRate = $scope.project['rate'];
    if ($scope.useConverter)  {
      $scope.inputCurrency = Math.round($scope.toEdit['price'] * $scope.exchangeRate);
    }
  }
  $scope.convertPrice = function() {
    $scope.toEdit['price'] = Math.round($scope.exchangeRate * $scope.inputCurrency);
  }
  
  $scope.removeImage = function(image) {
    images.delImage(image['big']).then(function(res) {
      $scope.toEdit['images'].splice($scope.toEdit['images'].indexOf(image),1);
    });
  }
  
  
});