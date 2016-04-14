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

app.filter('description', function(values) {
  return function(input) {
    result = false;
    if ((input.length >= values.min_description_length) && 
      (input.length <= values.max_description_length)) { result = true; }
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

app.filter('geoName', function(values) {
  return function(input) {
    result = false;
    if ((input.length >= values.min_geoname_length) &&
        (input.length <= values.max_geoname_length)) { result = true; }
    return result;
  };
});

app.filter('float', function(values) {
  return function(input) {    
    result = false;
    if ((input.length <= values.max_float_length) &&
        (input.match(/^(0|([1-9]{1}\d*))(\.\d+)?$/))) {
      result = true;
    }
    return result;
  };
});

app.filter('capitalize', function() {  
  return function(input) { 
    if ((input !== undefined) && (input !== '')) {
      input = input.replace(/(\s.{1})|(^.{1})/g, function(v) {
        return v.toUpperCase();
      });   
    } else {
      input = 'NA';
    }
    return input;
  }
});

app.filter('thru', function() {
  return function(input) {
    out = '';
    angular.forEach(input, function(val) {
      out = out + val + ', ';
    });    
    return out.replace(/, $/,'');
  }
});