app.controller('utils', function($scope, $http, values, languages, $filter, $state, $stateParams) {
  $scope.def_lang = (navigator.language || navigator.userLanguage).split('-')[0];
  $scope.LNG = languages[$scope.def_lang];
  $scope.toSend = '';  
  
  $.params = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) { results = [0,0]; }
    return results[1] || 0;
  };  
  
  $scope.doRequest = function() {  
    $http({    
      url: values.api_url + 'users/verify?' + $scope.toSend,
      method: 'get',    
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      if (res.data.hasOwnProperty('success')) {
        swal({'title':$filter('capitalize')($scope.LNG.info),
              'text': res.data.success, type: 'info', showCancelButton: false,
              'closeOnConfirm': true}, function() {
          window.location.href = '/';
        });      
      } else {
        swal({'title':$filter('capitalize')($scope.LNG.warning),
              'text': res.data.error, type: 'warning', showCancelButton: false,
              'closeOnConfirm': true}, function() {
          window.location.href = '/';
        });
      }
    });
  }; 
    
  switch ($.params('action')) {
    case 'levelup':
      $scope.toSend = 'mail=' + $.params('mail') + '&token=' + $.params('token') +
          '&action=' + $.params('action') + '&defLang=' + $scope.def_lang +
          '&account=' + $.params('account') + '&secret=' + $.params('secret');    
      $scope.doRequest();
      break;
    case 'reset':   
    case 'verify':
      $scope.toSend = 'mail=' + $.params('mail') + '&token=' + $.params('token') +
          '&action=' + $.params('action') + '&defLang=' + $scope.def_lang;
      $scope.doRequest();
      break;
  }  
    
});