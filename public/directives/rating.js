app.directive('rating', function() {
  return {
    restrict: 'E',
    scope: {
      'original': '=rate'
    },    
    template: '<div>' +
                '<span ng-repeat="star in stars">' +
                  '<i class="fa rate-star" ng-class="{\'fa-star-half-o\': star.hover, \'fa-star\': star.active, \'fa-star-o\': !star.active}" ng-click="clicked(star)" ng-mouseover="star.hover=true" ng-mouseleave="star.hover=false"></i>' + 
                '</span>' +
              '</div>',
    link: function(scope, elem, attrs) {
      scope.stars = [];
      scope.count = 10;
      for (i=0;i<scope.count;i++) {
        scope.stars.push({'active': false, 'num': i});
      }
      
      scope.clicked = function(star) {
        scope.original = star.num + 1;
      };
      
      scope.$watch('original', function() {
        for (i=0;i<scope.count;i++) {
          if (i < scope.original) {
            scope.stars[i].active = true;
          } else {
            scope.stars[i].active = false;            
          }
        }
      });
      
    }
  }
});