app.directive('minigallery', function() {
  return {
    restrict: 'E',
    scope: {
      'images': '=images'
    },
    template: '<div style="position:relative;">' +
                '<div class="big-photo" ng-show="big">' +
                  '<div style="position:absolute;right:40px;top:5px;">' +
                    '<span style="padding-right:10px;font-weight:bold;color:white;">{{current + 1}}/{{images.length}}</span>' + 
                    '<button class="btn btn-success" ng-click="prev()"><i class="fa fa-angle-left"></i></button>&nbsp;' +                  
                    '<button class="btn btn-success" ng-click="next()"><i class="fa fa-angle-right"></i></button>&nbsp;' +
                    '<button class="btn btn-warning" ng-click="close()"><i class="fa fa-times"></i></button>' +
                  '</div>' +
                  '<img ng-src="{{images[current].img}}" width="400px" height="400px"></img>' +
                '</div>' +
                '<img ng-src="{{images[0].img}}" style="cursor:pointer;" width="100px" height="100px" ng-mouseover="hover()" ng-mouseleave="leave()" ng-click="open()"></img>' +                                
                '<div style="position:absolute;left:-294px;top:0px;z-index:2;" ng-show="thumbs">' +
                  '<span ng-repeat="image in images" ng-if="$index>0"><img ng-src="{{image.img}}" width="100px" height="100px"></img></span>' +
                '</div>' +
              '</div>',
    link: function(scope, elem, attrs) {
      scope.thumbs = false;
      scope.big = false;
      scope.current = 0;
      
      scope.hover = function() {
        scope.thumbs = true;
      };
      scope.leave = function() {
        scope.thumbs = false;
      };
      scope.open = function() {
        scope.big = true;
      };
      scope.close = function() {
        scope.big = false;
      };
      scope.prev = function() {
        if ((scope.current - 1) >= 0) {
          scope.current = scope.current - 1;
        } else {
          scope.current = scope.images.length - 1;
        }
      };
      scope.next = function() {
        if ((scope.current + 1) < scope.images.length) {
          scope.current = scope.current + 1;
        } else {
          scope.current = 0;
        }
      };
    }
  }
});