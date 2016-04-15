app.directive('sortField', function() {
  return {
    restrict: 'E',
    scope: {
      'options': '=',
      'action': '&action',
      'lang': '='
    },
    template: '<div class="input-group-btn">' +
                '<button class="btn btn-default" ng-click="changeSort()">' +
                  '<i class="glyphicon glyphicon-sort"></i>' +
                '</button>' +
              '</div>' +
              '<span class="input-group-addon">{{lang}}: </span>' +
              '<select class="form-control" ng-options="option.value for option in options" ng-model="option"></select>',
    link: function(scope, elem, attrs) {
      scope.option = scope.options[0];
      
      scope.changeSort = function() {
        scope.option.order = (scope.option.order == 'asc' ? 'desc':'asc');
        scope.action({arg: scope.option});
      };
      
      scope.$watch('option', function(oV, nV) {
        scope.action({arg: scope.option});
      });
    }    
  };
});