app.directive('autocomplete', function($filter, project) {
  return {
    restrict: 'E',
    template: '<div class="input-group-btn"><button class="btn btn-default" ng-click="clean()"><span class="glyphicon glyphicon-erase"></span></button>' +
               '<button class="btn btn-default" ng-click="addPerson()"><span class="glyphicon glyphicon-plus"></span></button></div>' +
               '<input type="text" class="form-control" ng-model="inn" placeholder="{{placeholder}}">' +               
               '<ul class="list-group search-list"><li class="list-group-item point-hand" ng-repeat="opt in opts"' +
               'ng-click="selected(opt)">{{opt}}</li></ul>',
    scope: { action: '&action', placeholder: '=' },
    link: function(scope, elem, attrs) {      
      MAX_DISPLAY_LENGTH = 5;
      scope.inn = '';
      
      switch (attrs.option) {
        case 'users': project.reloadAllUsers().then(function(res) {scope.org = res.data.users});    
          break;
      }
      
      scope.opts = $.extend(true,[],$filter('limitTo')(scope.org, MAX_DISPLAY_LENGTH));
      
      scope.find = function() {
        out = [];
        if (scope.inn !== '') {
          angular.forEach(scope.org, function(i) {
            if ((i.match(scope.inn) || (scope.inn.length === 0)) && (out.length < MAX_DISPLAY_LENGTH)) {
              out.push(i);
            }          
          });
        }
        return out;
      };
      
      scope.selected = function(opt) {
        scope.inn = opt;
        scope.opts = [];
      };
      
      scope.clean = function() {
        scope.inn = '';
        scope.opts = [];
      };
      
      scope.addPerson = function() {
        if ((scope.inn) != '') {
          scope.action({arg: scope.inn});
          scope.inn = '';
        }
      };
      
      $(elem).bind('keyup', function(event) {
        scope.opts = scope.find()
        scope.$apply();
      });
    }
  };
});