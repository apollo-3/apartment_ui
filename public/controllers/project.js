app.controller('project', function($scope, auth, project, $state, userData, $cookies, values, FileUploader, images, gMaps) {
  auth.checkSession();

  $scope.defaultToEdit = {phones:[{phone:''}], modified:'update',
                          price: 0, owner: false, callHistory: 'toCall',
                          stars: 0, position: {}, images: []};
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
  
  $scope.trickyInitMapFlag = false;

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
      if (!$scope.isEditorOpen) {
        $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
        $scope.project.flats.unshift($scope.toEdit);
        messWithMap();
      } else {
        angular.forEach($scope.toEdit['images'], function(img) {
          images.delImage(img['img']);
        });
        $scope.project.flats.splice(0,1);
        $scope.useConverter = false;
        $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
      }
    } else {
      if ($scope.isEditorOpen) {
        tmpIdx = $scope.project['flats'].indexOf($scope.toEdit);
        tmpImgs = jQuery.extend(true,{},$scope.toEdit['images']);

        $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
        $scope.project = jQuery.extend(true,{},$scope.tmpProject);
        $scope.mode = 'create';
        $scope.useConverter = false;

        angular.forEach(tmpImgs, function(img) {
          angular.forEach($scope.project['flats'][tmpIdx]['images'], function(oldImg)  {
            if (oldImg['img'] != img['img']) {
                images.delImage(img['img']);
            }
          });
        });

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

    if ($scope.mode == 'edit') {
      tmpIdx = $scope.project['flats'].indexOf($scope.toEdit);
      angular.forEach($scope.tmpProject['flats'][tmpIdx]['images'], function(oldImg) {
        flag = true;
        angular.forEach($scope.toEdit['images'], function(img)  {
          if (img['img'] == oldImg['img']) {
              flag = false;
          }
        });
        if (flag) {
          images.delImage(oldImg['img']);
        }
      });
    }

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
    } else {
      $scope.mode = 'edit';
      flat['modified'] = 'update';
      $scope.toEdit = flat;
      messWithMap();
      $scope.isEditorOpen = true;
    }
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
    // images.delImage(image['img']).then(function(res) {
      $scope.toEdit['images'].splice($scope.toEdit['images'].indexOf(image),1);
      if ($scope.mode == 'create') {
        images.delImage(image['img']);
      }
    // });
  }

  $scope.makeCover = function(image) {
    if ($scope.toEdit['images'].length > 1) {
      aIndx = $scope.toEdit['images'].indexOf(image);
      aImg = $scope.toEdit['images'][aIndx]['img'];
      $scope.toEdit['images'][aIndx]['img'] = $scope.toEdit['images'][0]['img'];
      $scope.toEdit['images'][0]['img'] = aImg;
      console.log($scope.toEdit['images']);
    }
  }  
    
  messWithMap = function() {
    
    dragCallBack = function(event) {
      $scope.toEdit['position']['lat'] = event.latLng.lat();
      $scope.toEdit['position']['lng'] = event.latLng.lng();
    }
    // m = gMaps('editorMap', function() {
      // default_flat = {lat: 53.904, lng: 27.561};

      // map = new google.maps.Map(document.getElementById('map'), {
        // center: default_flat,
        // zoom: 11
      // });     
      
      // return map;
    // });  

    if ($scope.editorMap == undefined) {
        $scope.editorMap = gMaps('editorMap', function() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: values.map_center,
          zoom: values.map_zoom
        });             
        return map;
      }); 
    }    
    
    if ($scope.trickyInitMapFlag) {
      if ($scope.mode == 'edit') {
        addMarker(new google.maps.LatLng($scope.toEdit['position']), dragCallBack);
        $scope.editorMap.getMap().setCenter($scope.toEdit['position']);
      } else {
        $scope.editorMap.delAllMarkers();
        $scope.editorMap.getMap().setCenter(values.map_center);
      }     
      $scope.editorMap.getMap().setZoom(values.map_zoom);      
    }
    
    $scope.editorMap.getPromise().then(function() {
      $scope.trickyInitMapFlag = true;
      map = $scope.editorMap.getMap();
      
      // $scope.editorMap.markers = [];
      // Create the search box and link it to the UI element.
      var input = document.getElementById('address');
      var searchBox = new google.maps.places.SearchBox(input);
      // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)
      // Bias the SearchBox results towards current map's viewport.
      map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
      });
      searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        // Clear out the old markers.
        $scope.editorMap.delAllMarkers();
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
          // Create a marker for each place.
          $scope.editorMap.addMarker(place.geometry.location, dragCallBack);
          $scope.toEdit['position']['lat'] = place.geometry.location.lat();
          $scope.toEdit['position']['lng'] = place.geometry.location.lng();
          bounds.extend(place.geometry.location);
        });
        map.fitBounds(bounds);
        var restoreZoom = google.maps.event.addListener(map, "idle", function() { 
          if (map.getZoom() > values.map_zoom) map.setZoom(values.map_zoom); 
          google.maps.event.removeListener(restoreZoom); 
        });        
      });

      google.maps.event.addListener(map, 'click', function(event) {
        $scope.editorMap.addMarker(event.latLng, dragCallBack);
        $scope.toEdit['position']['lat'] = event.latLng.lat();
        $scope.toEdit['position']['lng'] = event.latLng.lng();
      });      
      
      // addMarker = function(location, map) {
        // if ($scope.editorMap.markers.length < 1) {
          // marker = new google.maps.Marker({
            // position: location,
            // map: map,
            // draggable: true
          // });
          // $scope.editorMap.markers.push(marker);
          // $scope.toEdit['position']['lat'] = location.lat();
          // $scope.toEdit['position']['lng'] = location.lng();
          // google.maps.event.addListener(marker, 'drag', function(event) {
            // $scope.toEdit['position']['lat'] = event.latLng.lat();
            // $scope.toEdit['position']['lng'] = event.latLng.lng();
          // });
        // } else {
          // $scope.editorMap.markers[0].setPosition(location);
        // }
      // }      
      
      if ($scope.mode == 'edit') {
        $scope.editorMap.addMarker(new google.maps.LatLng($scope.toEdit['position']), dragCallBack);
        $scope.editorMap.getMap().setCenter($scope.toEdit['position']);        
      }     
    });
    
  }
});