app.directive('inputCleaner', function() {
  return {
    restrict: 'E',
    template: '<span class="glyphicon glyphicon-remove" style="font-size:1.4em">',
    link: function(scope, elem, attrs) {
      elem.on('click', function() {
        scope.$apply(attrs.action);
      });
      elem.on('mouseenter', function() {
        elem.addClass('hover-cleaner-remove');
      });
      elem.on('mouseleave', function() {
        elem.removeClass('hover-cleaner-remove');
      });
      
      elem.addClass('cleaner');
    }
  };
});