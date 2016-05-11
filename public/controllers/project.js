app.controller('project', function($scope, auth, projects, $state, $cookies, values, FileUploader, images, gMaps, $window, languages, $filter, $http) {
  auth.checkSession();

  $scope.LNG = languages[languages.availableLng()]; 
  $scope.defaultToEdit = {address: '', phones:[], modified:'update',
                          price: '', owner: false, callHistory: 'toCall',
                          stars: 0, position: {}, images: [],
                          display: true, link:'', buildYear: '',
                          contact: '', address: '', floor: '',
                          owner: false, subway: false,
                          shop: false, park: false,
                          school: false, daycare: false,
                          furniture: false, electronics: false,
                          lastfloor: false, logs: []                       
                         };
  $scope.toEdit = jQuery.extend(true,{},$scope.defaultToEdit);
  $scope.tableHeads = {
    'address': {'name': 'address', 'value': $scope.LNG['address'], display: true, order: 'asc', type: 'string'},
    'phones': {'name': 'phones', 'value': $scope.LNG['phone'], display: true, order: 'asc', type: 'length'},
    'price': {'name': 'price', 'value': $scope.LNG['price'], display: true, order: 'asc', type: 'int'},
    'buildYear': {'name': 'buildYear', 'value': $scope.LNG['year'], display: true, order: 'asc', type: 'int'},
    'contact': {'name': 'contact', 'value': $scope.LNG['contact'], display: true, order: 'asc', type: 'string'},
    'floor': {'name': 'floor', 'value': $scope.LNG['floor'], display: true, order: 'asc', type: 'int'},
    'callHistory': {'name': 'callHistory', 'value': $scope.LNG['call'], display: true, order: 'asc', type: 'string'},
    'stars': {'name': 'stars', 'value': $scope.LNG['stars'], display: true, order: 'asc', type: 'int'},      
    'link': {'name': 'link', 'value': $scope.LNG['link'], display: true, order: 'asc', type: 'string'},
    'other': {'name': 'other', 'value': $scope.LNG['other'], display: true, order: 'asc', type: 'int'},
    'modified': {'name': 'modified', 'value': $scope.LNG['modified'], display: true, order: 'asc', type: 'date'},
    'display': {'name': 'display', 'value': $scope.LNG['display'], display: true, order: 'asc', type: 'bool'},
    'images': {'name': 'images', 'value': $scope.LNG['photos'], display: true, order: 'asc', type: 'length'},
    'actions': {'name': 'actions', 'value': $scope.LNG['actions'], display: true} 
  };
  $scope.userFilter = {
    'enabled': false,
    'filters': {     
      'address': {'value': '', type: 'string'},
      'link': {'value': '', type: 'string'},
      'contact': {'value': '', type: 'bool'},
      'callHistory': {'value': '', type: 'string'}, 
      'phones': {'value': '', type: 'phones'},
      'images': {'value': false, type: 'array'},    
      'price': {'min_value': '', 'max_value': '', type: 'int'},
      'buildYear': {'min_value': '', 'max_value': '', type: 'int'},
      'floor': {'min_value': '', 'max_value': '', type: 'int'},
      'stars': {'min_value': '', 'max_value': '', type: 'int'},      
      'modified': {'min_value': '', 'max_value': '', type: 'date'},
      'display': {'value': false, type: 'bool'},      
      'owner': {'value': false, type: 'bool'},
      'subway': {'value': false, type: 'bool'},
      'shop': {'value': false, type: 'bool'},
      'park': {'value': false, type: 'bool'},
      'school': {'value': false, type: 'bool'},
      'daycare': {'value': false, type: 'bool'},
      'furniture': {'value': false, type: 'bool'},
      'electronics': {'value': false, type: 'bool'},
      'lastfloor': {'value': false, type: 'bool'}
    }
  };
  $scope.mode = 'create';
  $scope.tmpProject = {};
  $scope.callHistoryOptions = [{'name': 'called', 'value': $scope.LNG.called}, 
                               {'name': 'callBack', 'value': $scope.LNG.call_back},
                               {'name': 'toCall', 'value': $scope.LNG.to_call}];
  $scope.filterHistoryOptions = $.extend(true,[],$scope.callHistoryOptions); $scope.filterHistoryOptions.push({'name':'', value: $scope.LNG.all});
  $scope.max_images = values.max_images;
  $scope.exchangeRate = 1;  
  $scope.showProjectDescription = false;
  $scope.showFilterPanel = false;
  $scope.showEditor = false;
  $scope.showLog = false;
  $scope.tmpPhone = '';
  $scope.error = '';
  $scope.scrollOnMap = false;
  $scope.converterUsage = false;
  $scope.commentFlat = {};

  // Uploader initialisation  
  $scope.uploader = new FileUploader({url: values.api_url + 'images/uploadImage',
                                      alias: 'image',
                                      removeAfterUpload: true,
                                      formData: [{mail:$cookies.get('mail'),token:$cookies.get('token'), defLang: values.def_lang}],
                                      queueLimit: values.max_images_allowed});
  // Upoader filter for image format, and size
  $scope.uploader.filters.push({name:'imageFilter', fn:function(item) {
      flag = false;
      allowedTypes = ['jpg','png','jpeg','bmp','gif'];
      type = item.type.slice(item.type.lastIndexOf('/') + 1);
      if ((allowedTypes.indexOf(type)!= -1) && ((item.size/1024/1024) < values.max_image_size)) {
        flag = true;
      }
      return flag;
    }
  });
  // Watching for limits of uploaded photos  
  $scope.uploader.onAfterAddingFile = function(item) {
    if ($scope.toEdit.images.length >= values.accounts[userData.getData().account].photos) {
      item.remove();
      swal($filter('capitalize')($scope.LNG.warning), $scope.LNG.account_limit + '\"' +userData.getData().account + '\".');
    }
  };  
  // Uploader callBack after image uploaded
  $scope.uploader.onCompleteItem = function(item, res) {
    $scope.toEdit.images.push(res.image);
  };
 
  // Show editor panel 
  $scope.editorOn = function(flat) {  
    // Check if editor is already open
    if ($scope.showEditor == true) {$scope.editorOff()};    
    // Check whether it's editing or creation mode
    if (typeof flat === 'object') {$scope.mode = 'edit'};
    
    $scope.exchangeRate = $scope.project.rate;  
    if ($scope.mode == 'create') {
      $scope.toEdit = $.extend(true,{}, $scope.defaultToEdit);
      $scope.project.flats.unshift($scope.toEdit);
    } else {
      $scope.toEdit = flat;      
      $scope.toEdit.modified = 'update';
    }    
    $scope.showEditor = true;
    $scope.initMapOneFlat();
    setTimeout(function() {
      $('html,body').animate({scrollTop: $('div#editor').offset().top});
    }, 100);
  };
  
  // Move to map
  $scope.moveToMap = function() {
    $('html,body').animate({scrollTop: $('html').offset().top});
  };  
  
  // Move to table
  $scope.moveToTable = function() {
    $('html,body').animate({scrollTop: $('div#flats-table').offset().top});
  };
  
  // Hide editor panel
  $scope.editorOff = function() {
    $scope.showEditor = false;    
    $scope.converterUsage = false;  
    $scope.tmpPhone = ''; 
    $scope.error = '';
    $scope.uploader.clearQueue();
    if ($scope.mode == 'create') {
      $scope.project.flats.splice(0,1);
    } else {
      tmpIdx = $scope.project.flats.indexOf($scope.toEdit);
      tmpImgs = jQuery.extend(true,{},$scope.toEdit.images);
      $scope.project = jQuery.extend(true,{},$scope.tmpProject);
      angular.forEach(tmpImgs, function(img) {
        flag = true;
        angular.forEach($scope.project.flats[tmpIdx].images, function(oldImg)  {
          if (oldImg.img == img.img) {
            flag = false;
          }
        });
        if (flag) {
          images.delImage(img.img);            
        }        
      });      
      $scope.mode = 'create';
    }
    $scope.toEdit = $.extend(true,{},$scope.defaultToEdit);     
    $scope.initMapAllFlats();    
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
    if ((flag) && ($filter('phone')($scope.tmpPhone)) && ($scope.tmpPhone != '')) {
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
  
  // Check if address already present in project  
  $scope.isAddressUnic = function() {
    count = 0;
    angular.forEach($scope.project.flats, function(flat) {
      if (flat.address === $scope.toEdit.address) {
        count = count + 1;
      }
    });
    return (count > 1 ? false: true);
  };
  
  // Save changes or new flat
  $scope.save = function() { 
    $scope.error = '';
    // Filter check
    if (($filter('address')($scope.toEdit.address)) &&
      ($filter('link')($scope.toEdit.link)) &&
      ($filter('price')($scope.toEdit.price))) {  
      // Check if location was set on map
      if (gMaps.getMarkers().length === 0) {
        $scope.error = $scope.LNG.no_location_set;
        return
      }
      // Check if address already present in project
      if (!$scope.isAddressUnic()) {
        $scope.error = $scope.LNG.address_repeat;
        return
      }      
      // Deleting images from server that no longer exist in a new version of flat  
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

      // Check user limits
      if ($scope.mode == 'create') {
        if ($scope.project.flats.length > values.accounts[userData.getData().account].flats) {
          swal($filter('capitalize')($scope.LNG.warning), $scope.LNG.account_limit + '\"' +userData.getData().account + '\".');
          return
        }
      }
      projects.saveProject($scope.project).then(function(res) {
        if (res.data.hasOwnProperty('error')) {
          swal($filter('capitalize')($scope.LNG.error), res.data.error);
        } else {
          $scope.project = res.data.project;
          $scope.project.was_shared = $scope.project.shared;
          $scope.tmpProject = jQuery.extend(true,{},$scope.project);
          $scope.preSortProject = jQuery.extend(true,{},$scope.project);          
          $scope.toEdit = $.extend(true,{}, $scope.defaultToEdit);
          projects.syncProject($scope.project);
          
          $scope.converterUsage = false;
          $scope.showEditor = false;
          $scope.tmpPhone = '';
          $scope.uploader.clearQueue();          
          $scope.mode = 'create';        
          $scope.initMapAllFlats();        
        }
      });
    } else {
      $scope.error = $scope.LNG.wrong_fields_value;
    }
  };
  
  // Converter price changed
  $scope.converterPriceChanged = function(price) {
    $scope.toEdit.price = price;
  };  
  
  // When callHistory changed change marker color on the map
  $scope.callHistoryChanged = function() {
    gMaps.changeMarkerColor($scope.toEdit.callHistory);
  };

  // Delete the flat
  $scope.del = function(flat) {
    swal({
      title: $filter('capitalize')($scope.LNG.warning),
      text: $scope.LNG.are_you_sure_delete + '?',
      showCancelButton: true,      
      type: "warning",
    }, function(){
      if ($scope.showEditor) {
        $scope.editorOff();
      }          
      // Saving images to delete after project removal
      imgsFromFlat = [];
      angular.forEach(flat.images, function(img) {
        imgsFromFlat.push(img.img);
      });
      $scope.project.flats.splice($scope.project.flats.indexOf(flat),1); 
      $scope.initMapAllFlatsHelper();
      projects.saveProject($scope.project).then(function(res) {
        if (res.data.hasOwnProperty('success')) {
          projects.syncProject($scope.project);
          // Getting rid of not used images
          images.groupDelImage(imgsFromFlat).then(function(res) {
          });
          $scope.tmpProject = jQuery.extend(true,{},$scope.project);
          $scope.tmpProject = jQuery.extend(true,{},$scope.project);
        } else {
          swal($filter('capitalize')($scope.LNG.error), res.data.error);
          $scope.project = jQuery.extend(true,{},$scope.tmpProject);
        }
      });          
    });
  };

  // Delete the image
  $scope.removeImage = function(image) {
    $scope.toEdit.images.splice($scope.toEdit.images.indexOf(image),1);
    if ($scope.mode == 'create') {
      images.delImage(image.img);
    }
  };

  // Make the image a cover (first in the array)
  $scope.makeCover = function(image) {
    if ($scope.toEdit.images.length > 1) {
      aIndx = $scope.toEdit.images.indexOf(image);
      aImg = $scope.toEdit.images[aIndx].img;
      $scope.toEdit.images[aIndx].img = $scope.toEdit.images[0].img;
      $scope.toEdit.images[0].img = aImg;
    }
  }; 
  
  // Attach buttons to map
  attachButtonsToMap = function() {    
    if (!gMaps.isBtnAttached()) {
      // Adding scroll button
      $('body').append('<div id="map-scroller" class="map-controls">' + $filter('capitalize')($scope.LNG.scrolling) + '</div>');
      // Attaching scroll button to map
      gMaps.attachButton(document.getElementById('map-scroller'), function() {
        $scope.scrollOnMap = !$scope.scrollOnMap;
        gMaps.setOptions({'scrollwheel': $scope.scrollOnMap});
      });     
    }
  };
  
  // Initialize the map with all flats on it
  $scope.initMapAllFlatsHelper = function() {    
    // Deleting all markers on the map
    gMaps.delAllMarkers();
    // Show only those flats that have display options equal to true
    angular.forEach($scope.project.flats, function(flat) {
      if (flat.display) {
        gMaps.addSimpleMarker(flat.position, flat.callHistory, flat);  
      }
    });      
    // Set the best view
    gMaps.bestView(); 
    fakeLoadOff();
  };
  $scope.initMapAllFlats = function() {
    if (!gMaps.getCalledPromise()) {
      gMaps.getPromise().then(function() {
        gMaps.setCalledPromise();       
        $scope.initMapAllFlatsHelper();
        attachButtonsToMap();         
      });      
    } else {
      $scope.initMapAllFlatsHelper();
    }
  };   

  // Initialize the map for editor
  $scope.initMapOneFlatHelper = function() {    
    // Callback for dragging marker
    dragCallBack = function(event) {
      $scope.toEdit.position.lat = event.latLng.lat();
      $scope.toEdit.position.lng = event.latLng.lng();
    };   
    map = gMaps.getMap();    
    var input = document.getElementById('address');
    var searchBox = new google.maps.places.SearchBox(input);
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });
    // Callback on place change
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      if (places.length === 0) {
        return;
      }
      // Setting selected place name in address box   
      $scope.toEdit.address = places[0].formatted_address;
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
    // Callback for on map click
    google.maps.event.addListener(map, 'click', function(event) {
      gMaps.addMarker(event.latLng, dragCallBack, 'toCall');
      $scope.toEdit.position.lat = event.latLng.lat();
      $scope.toEdit.position.lng = event.latLng.lng();
    });      
    // Add the marker for the flat in the editor form
    if ($scope.mode == 'edit') {
      gMaps.addMarker(new google.maps.LatLng($scope.toEdit.position), dragCallBack, $scope.toEdit.callHistory);
    }
    // Find the best view
    gMaps.bestView();
  };  
  $scope.initMapOneFlat = function() { 
    gMaps.delAllMarkers();
    if (!gMaps.getCalledPromise()) {
      gMaps.setCalledPromise();
      attachButtonsToMap();
      $scope.initMapOneFlatHelper();
    } else {
     $scope.initMapOneFlatHelper();
    }    
  };  
  
  // Sorting flats-table
  $scope.sortFlats = function(head) {
    if (head.order == 'asc') {
      angular.forEach($scope.tableHeads, function(v,k) {
        v.order = 'asc';
      });
      head.order = 'desc';
    } else {
      angular.forEach($scope.tableHeads, function(v,k) {
        v.order = 'desc';
      });      
      head.order = 'asc';
    }
    // Special case when sort field is OTHER
    if (head.name === 'other') {
      whistles = ['owner','school','park','subway','shop','daycare','furniture','electronics','lastfloor']
      angular.forEach($scope.project.flats, function(flat) {
        flat.other = 0;
        angular.forEach(whistles, function(whistle) {
          if ((flat[whistle] != undefined) && (flat[whistle])) {
            flat.other = parseInt(flat.other) + 1;
          }
        });
      });     
      $filter('sort')($scope.project.flats, head.name, head.type, head.order);        
      angular.forEach($scope.project.flats, function(flat) {
        delete flat.other
      });
    } else {
      // Normal case
      $filter('sort')($scope.project.flats, head.name, head.type, head.order);
    }   
  };
  
  // Setting warning classes using filters
  $scope.customFilter = function(name) {
    switch (name) {
      case 'address': $scope.warn_address = !$filter('address')($scope.toEdit.address);
        break;
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
  
  // Loading current project
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
        $scope.initMapAllFlats();        
      }
    });
    if (!ifActiveExist) {
      $state.transitionTo('projects');
    }
  }  
  
  // Show logs
  $scope.logsOn = function(flat) {
    $scope.commentFlat = flat;
    $scope.showLog = true;
  };
  
  // Remove From Logs
  $scope.delFromLog = function(comment) {
    $scope.commentFlat.logs.splice($scope.commentFlat.logs.indexOf(comment), 1);
    $scope.commentFlat.modified = 'update';
    projects.saveProject($scope.project).then(function(res) {
      if (res.data.hasOwnProperty('success')) {        
        flatIndex = $scope.project.flats.indexOf($scope.commentFlat);
        $scope.project = res.data.project;
        $scope.project.was_shared = $scope.project.shared;
        $scope.commentFlat = $scope.project.flats[flatIndex];
        $scope.tmpProject = jQuery.extend(true,{},$scope.project);
        $scope.preSortProject = jQuery.extend(true,{},$scope.project);
        projects.syncProject($scope.project);        
      }
    });
  };
  
  // Add To Log
  $scope.addToLog = function() {
    // User account level check    
    if ($scope.commentFlat.logs.length >= values.accounts[userData.getData().account].logs) {
        swal($filter('capitalize')($scope.LNG.warning), $scope.LNG.account_limit + '\"' +userData.getData().account + '\".');      
      return
    }
    swal({
      title: "",
      text: $scope.LNG.enter_comment + ':',
      type: "input",
      showCancelButton: true,
      closeOnConfirm: true,
      animation: "slide-from-top"
    },
    function(inputValue) {
      if ((inputValue === false) || (inputValue === "") || (inputValue.length > values.max_length_log)) { 
        return false;
      } else {
        $scope.commentFlat.logs.push({'creationDate': new moment().format('YYYY-MM-D HH:mm:ss'), 'author': $cookies.get('mail'), 'comment': inputValue});
        $scope.commentFlat.modified = 'update';        
        projects.saveProject($scope.project).then(function(res) {
          if (res.data.hasOwnProperty('success')) {
            flatIndex = $scope.project.flats.indexOf($scope.commentFlat);            
            $scope.project = res.data.project;
            $scope.project.was_shared = $scope.project.shared;            
            $scope.commentFlat = $scope.project.flats[flatIndex];            
            $scope.tmpProject = jQuery.extend(true,{},$scope.project);
            $scope.preSortProject = jQuery.extend(true,{},$scope.project);
            projects.syncProject($scope.project);  
          }
        });
      }
    });  
  };
  
  // Download report 
  $scope.downloadReport = function() {
    projects.downloadReport($scope.project.name, $scope.project.shared).then(function(res) {
      if (res.data.hasOwnProperty('success')) {
        $window.location.href = '/' + $cookies.get('mail') + '.csv';
      } else {
        swal($filter('capitalize')($scope.LNG.warning), res.data.error);
      }
    });
  };
 
  // Watching User Filter Change
  $scope.$watch('userFilter', function(n, o) {
    if ($scope.project != undefined) {
      // Check if editor is already open
      if ((n.enabled === true) && ($scope.showEditor == true)) {$scope.editorOff();} 
      
      if ($scope.preSortProject == undefined) {
        $scope.preSortProject = $.extend(true,{}, $scope.project);
      } else {
        $scope.project = $.extend(true,{},$scope.preSortProject); 
      }
      $filter('userArrayFilter')($scope.project.flats, n);
      $scope.initMapAllFlats();
    }    
  }, true);  
  
});