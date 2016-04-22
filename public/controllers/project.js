app.controller('project', function($scope, auth, projects, $state, userData, $cookies, values, FileUploader, images, gMaps, $window, languages, $filter) {
  auth.checkSession();

  $scope.LNG = languages[languages.availableLng()]; 
  $scope.defaultToEdit = {phones:[{phone:''}], modified:'update',
                          price: '', owner: false, callHistory: 'toCall',
                          stars: 0, position: {}, images: [],
                          display: true, link:'', buildYear: '',
                          contact: '', address: '', floor: ''};
  $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
  $scope.mode = 'create';
  $scope.isEditorOpen = false;
  $scope.tmpProject = {};
  $scope.currency = userData.getData().currency;
  $scope.callHistoryOptions = [{'name': 'called', 'value': $scope.LNG.called}, 
                               {'name': 'callBack', 'value': $scope.LNG.call_back},
                               {'name': 'toCall', 'value': $scope.LNG.to_call}];
  $scope.stars = [0, 1, 2, 3, 4, 5];
  $scope.max_images = values.max_images;

  $scope.useConverter = false;
  $scope.exchangeRate = 1;
  $scope.inputCurrency = 0;  
  
  $scope.showProjectDescription = true;
  $scope.showFilterPanel = false;
  $scope.showEditor = false;
  $scope.tmpPhone = '';
  $scope.error = '';
  $scope.scrollOnMap = false;
  $scope.converterUsage = false;

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
    $scope.toEdit.images.push(res.image);
  };
 
  // Show editor panel 
  $scope.editorOn = function() {
    $scope.showEditor = true;    
    setTimeout(function() {
      $('html,body').animate({scrollTop: $('div#editor').offset().top});
    }, 100);
  };
  
  // Move to map
  $scope.moveToMap = function() {
    $('html,body').animate({scrollTop: $('html').offset().top});
  };  
  
  // Hide editor panel
  $scope.editorOff = function() {
    $scope.showEditor = false;
  };
  
  // Delete phone from phones
  $scope.removePhone = function(phone) {
    $scope.toEdit.phones.splice($scope.toEdit.phones.indexOf(phone), 1)
  };

  // Add phone to phones 
  $scope.pushPhone = function() {
    flag = true;
    angular.forEach($scope.toEdit.phones, function(phone) {
      if (phone.phone == $scope.tmpPhone) {
        flag = false;
      }
    });
    if ((flag) && ($filter('phone')($scope.tmpPhone))) {
      $scope.toEdit.phones.push({'phone': $scope.tmpPhone});
      $scope.tmpPhone = '';
    }
  };

  // Checking if the project is empty
  $scope.checkIfEmpty = function() {
    if ($scope.project.flats.length === 0) {
      swal($filter('capitalize')($scope.LNG.info), $scope.LNG.empty_project);
    }
  };
  
  // Setting warning classes using filters
  $scope.customFilter = function(name) {
    switch (name) {
      case 'phone': $scope.warn_phone = !$filter('phone')($scope.tmpPhone);
        break;
      case 'link': $scope.warn_link = !$filter('link')($scope.toEdit.link);
        break;   
      case 'contact': $scope.warn_contact = !$filter('name')($scope.toEdit.contact);
        break;    
      case 'floor': $scope.warn_floor = !$filter('floor')($scope.toEdit.floor);
        break;   
      case 'buildYear': $scope.warn_year = !$filter('year')($scope.toEdit.buildYear);
        break; 
      case 'price': $scope.warn_price = !$filter('price')($scope.toEdit.price);
        break;         
    }
  };
  
  // Converter price changed
  $scope.converterPriceChanged = function(price) {
    $scope.toEdit.price = price;
  };
  
  // Rating changed
  $scope.rateChangeAction = function(rate) {
  };
    
  messWithMapAllHelper = function() {
    
    // Toggle scrolling on map
    gMaps.attachButton(document.getElementById('map-scroller'), function() {
      $scope.scrollOnMap = !$scope.scrollOnMap;
      gMaps.setOptions({'scrollwheel': $scope.scrollOnMap});
    });
    
    gMaps.delAllMarkers();
    angular.forEach($scope.project.flats, function(flat) {
      if (flat.display) {
        gMaps.addSimpleMarker(flat.position, flat.callHistory, flat);  
      }
    });      
    gMaps.bestView();    
  };
  messWithMapAll = function() {
    if (!gMaps.getCalledPromise()) {
      gMaps.getPromise().then(function() {
        gMaps.setCalledPromise();
        messWithMapAllHelper();
      });      
    } else {
      messWithMapAllHelper();
    }
  }; 

  if (projects.getProjects().length === 0) {
    $state.transitionTo('projects');
  } else {
    ifActiveExist = false;
    angular.forEach(projects.getProjects(), function(item) {
      if (item.active === true) {
        ifActiveExist = true;
        $scope.project = jQuery.extend(true,{},item);
        $scope.tmpProject = jQuery.extend(true,{},item);
        $scope.checkIfEmpty();
        showMap();
        messWithMapAll();        
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
        angular.forEach($scope.toEdit.images, function(img) {
          images.delImage(img.img);
        });
        $scope.project.flats.splice(0,1);
        $scope.useConverter = false;
        $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
        messWithMapAll();
      }
    } else {
      if ($scope.isEditorOpen) {
        messWithMapAll();
        tmpIdx = $scope.project.flats.indexOf($scope.toEdit);
        tmpImgs = jQuery.extend(true,{},$scope.toEdit.images);

        $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
        $scope.project = jQuery.extend(true,{},$scope.tmpProject);
        $scope.mode = 'create';
        $scope.useConverter = false;

        angular.forEach(tmpImgs, function(img) {
          angular.forEach($scope.project.flats[tmpIdx].images, function(oldImg)  {
            if (oldImg.img != img.img) {
                images.delImage(img.img);
            }
          });
        });
      }
    }
    $scope.isEditorOpen = !$scope.isEditorOpen;
  };

  $scope.confirm = function() {
    newPhones = [];
    angular.forEach($scope.toEdit.phones, function(phone) {
      flag = true;
      angular.forEach(newPhones, function(phone2) {
        if (phone2.phone == phone.phone) {
          flag = false;
        }
      });
      if (flag) {
        newPhones.push(phone);
      }
    });
    $scope.toEdit.phones = newPhones;

    if ($scope.mode == 'edit') {
      tmpIdx = $scope.project.flats.indexOf($scope.toEdit);
      angular.forEach($scope.tmpProject.flats[tmpIdx].images, function(oldImg) {
        flag = true;
        angular.forEach($scope.toEdit.images, function(img)  {
          if (img.img == oldImg.img) {
              flag = false;
          }
        });
        if (flag) {
          images.delImage(oldImg.img);
        }
      });
    }

    projects.saveProject($scope.project).then(function(res) {
      if (res.data.hasOwnProperty('error')) {
        alert(res.data.error);
      } else {
        $scope.project = res.data.project;
        $scope.project.was_shared = $scope.project.shared;
        $scope.tmpProject = jQuery.extend(true,{},$scope.project);
        $scope.toEdit = {phones: [{phone:''}], modified: 'update'};
        $scope.project = jQuery.extend(true,{},$scope.tmpProject);
        projects.syncProject($scope.project);
        $scope.isEditorOpen = !$scope.isEditorOpen;
        $scope.useConverter = false;
        $scope.mode = 'create';
        messWithMapAll();
      }
    });
  };
  
  $scope.callHistoryChanged = function() {
    gMaps.changeMarkerColor($scope.toEdit.callHistory);
  };

  $scope.edit = function(flat) {
    if ($scope.isEditorOpen) {
      $scope.toggleEditor();
    } else {
      $scope.mode = 'edit';
      flat.modified = 'update';
      $scope.toEdit = flat;
      messWithMap();
      $scope.isEditorOpen = true;
    }
  };

  $scope.del = function(flat) {
    if ($scope.isEditorOpen) {
      $scope.toggleEditor();
    }
    $scope.project.flats.splice($scope.project.flats.indexOf(flat),1);
    projects.saveProject($scope.project).then(function(res) {
      if (res.data.hasOwnProperty('success')) {
        projects.syncProject($scope.project);
        $scope.tmpProject = jQuery.extend(true,{},$scope.project);
      } else {
        alert(res.data.error);
        $scope.project = jQuery.extend(true,{},$scope.tmpProject);
      }
    });
  };

  $scope.addPhone = function(phone) {
    flag = true;
    angular.forEach($scope.toEdit.phones, function(phone) {
      if (phone.phone === '') {
        flag = false;
      }
    });
    if (flag) {
      $scope.toEdit.phones.push({phone:''});
    }
  };

  $scope.delPhone = function(phone) {
    if ($scope.toEdit.phones.length > 1) {
      $scope.toEdit.phones.splice($scope.toEdit.phones.indexOf(phone),1);
    }
  };

  $scope.converterClick = function() {
    $scope.exchangeRate = $scope.project.rate;
    if ($scope.useConverter)  {
      $scope.inputCurrency = Math.round($scope.toEdit.price * $scope.exchangeRate);
    }
  };
  $scope.convertPrice = function() {
    $scope.toEdit.price = Math.round($scope.exchangeRate * $scope.inputCurrency);
  };

  $scope.removeImage = function(image) {
    $scope.toEdit.images.splice($scope.toEdit.images.indexOf(image),1);
    if ($scope.mode == 'create') {
      images.delImage(image.img);
    }
  };

  $scope.makeCover = function(image) {
    if ($scope.toEdit.images.length > 1) {
      aIndx = $scope.toEdit.images.indexOf(image);
      aImg = $scope.toEdit.images[aIndx].img;
      $scope.toEdit.images[aIndx].img = $scope.toEdit.images[0].img;
      $scope.toEdit.images[0].img = aImg;
      console.log($scope.toEdit.images);
    }
  }; 
    
  messWithMapHelper = function() {    
    dragCallBack = function(event) {
      $scope.toEdit.position.lat = event.latLng.lat();
      $scope.toEdit.position.lng = event.latLng.lng();
    };
    
    map = gMaps.getMap();    
    var input = document.getElementById('address');
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }
      // Clear out the old markers.
      gMaps.delAllMarkers();
      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        // Create a marker for each place.
        gMaps.addMarker(place.geometry.location, dragCallBack, 'toCall');
        $scope.toEdit.position.lat = place.geometry.location.lat();
        $scope.toEdit.position.lng = place.geometry.location.lng();
        bounds.extend(place.geometry.location);
      });
      map.fitBounds(bounds);
      var restoreZoom = google.maps.event.addListener(map, "idle", function() { 
        if (map.getZoom() > values.map_zoom) map.setZoom(values.map_zoom); 
        google.maps.event.removeListener(restoreZoom); 
      });        
    });

    google.maps.event.addListener(map, 'click', function(event) {
      gMaps.addMarker(event.latLng, dragCallBack, 'toCall');
      $scope.toEdit.position.lat = event.latLng.lat();
      $scope.toEdit.position.lng = event.latLng.lng();
    });      
    
    if ($scope.mode == 'edit') {
      gMaps.addMarker(new google.maps.LatLng($scope.toEdit.position), dragCallBack, $scope.toEdit.callHistory);
    }
    gMaps.bestView();
  };  
  messWithMap = function() { 
    gMaps.delAllMarkers();
    if (!gMaps.getCalledPromise()) {
      gMaps.setCalledPromise();
      messWithMapHelper();
    } else {
      messWithMapHelper();
    }    
  };
  
});