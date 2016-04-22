app.directive('converter', function($filter) {
  return {
    restrict: 'E',
    scope: { 'lbl1': '=',
             'lbl2': '=',
             'oldrate': '=rate',
             'lbl1change': '&',
             'lbl2change': '&'
    },
    template: '<span class="control-label custom-label col-md-3">{{lbl1}}:</span>' +
              '<div class="input-group" style="margin-bottom:5px;">' +
                '<div class="input-group-btn">' +
                  '<button class="btn btn-default" ng-click="oldrate=\'\'">' +
                    '<span class="glyphicon glyphicon-erase"></span>' +
                  '</button>' +
                '</div>' +
                '<input type="text" ng-class="{\'warning\': warn_rate}" class="form-control" ng-model="oldrate">' +                
              '</div>' +
              '<span class="control-label custom-label col-md-3">{{lbl2}}:</span>' +
              '<div class="input-group">' +
                '<div class="input-group-btn">' +
                  '<button class="btn btn-default" ng-click="price=\'\'">' +
                    '<span class="glyphicon glyphicon-erase"></span>' +
                  '</button>' +
                '</div>' +
                '<input type="text" ng-class="{\'warning\': warn_price}" class="form-control" ng-model="price">' +                
              '</div>',            
    link: function(scope, elem, attrs) {
      scope.price = '';      
      
      scope.$watch('price', function(o,n) {        
        scope.warn_price = !$filter('int')(scope.price);
        if (!scope.warn_price) {
          scope.calc();
        }
      });
      
      scope.$watch('oldrate', function(o,n) {
        scope.warn_rate = !$filter('float')(scope.oldrate);
        if (!scope.warn_rate) {
          scope.calc();
        }
      });      
      
      scope.calc = function() {
        result = Math.round(parseFloat(scope.oldrate) * parseInt(scope.price));
        scope.lbl2change({'price': result});                
      };
    }
  }
});