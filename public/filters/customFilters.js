app.filter('email', function(values) {
  return function(input) {
    result = false;
    reg = /^.+?@.+?\..{2,3}$/;
    if ((input.match(reg) !== null) && (input.length <= values.max_mail_length)) { result = true; }
    return result;
  };
});

app.filter('password', function(values) {
  return function(input) {
    result = false;
    if ((input.length >= values.min_password_length) && 
      (input.length <= values.max_password_length)) { result = true; }
    return result;
  };
});

app.filter('capitalize', function() {
  return function(input) {
    input = input.toLowerCase();
    return input.substring(0,1).toUpperCase() + input.substring(1);
  }
});