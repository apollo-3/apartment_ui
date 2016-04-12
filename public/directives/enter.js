app.directive('ngEnter', function() {
  return function(scope,element,attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        $(element).blur();
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });    
  };
});