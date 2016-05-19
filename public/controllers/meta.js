app.controller('meta', function($scope, languages) {
  $scope.LNG = languages[languages.availableLng()];
});