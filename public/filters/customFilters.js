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

app.filter('name', function(values) {
  return function(input) {
    result = false;
    if ((input.length >= values.min_name_length) && 
      (input.length <= values.max_name_length)) { result = true; }
    return result;
  };
});

app.filter('phone', function(values) {
  return function(input) {
    result = false;
    if ((input.length >= values.min_phone_length) && 
      (input.length <= values.max_phone_length) &&
      (input.match(/^\d+$/))) { result = true; }
    return result;
  };
});

app.filter('year', function() {
  return function(input) {
    result = false;
    if (typeof input === 'number') {
      input = input.toString();
    }
    if (input.match(/^\d{4}$/)) { result = true; }
    return result;
  };
});

app.filter('capitalize', function() {
  return function(input) {
    return input.replace(/(\s.{1})|(^.{1})/g, function(v) {
      return v.toUpperCase();
    });   
  }
});