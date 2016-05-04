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
      (input.match(/^\+?\d[\d\.-\s]+$/))) { result = true; }
    return result;
  };
});

app.filter('year', function() {
  return function(input) {
    result = false;
    if (typeof input === 'number') {
      input = input.toString();
    }
    if ((input != undefined) && (input.match(/^(0|\d{4})?$/))) { result = true; }
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

app.filter('int', function(values) {
  return function(input) {    
    result = false;
    if (typeof input == 'number') {
      input = input.toString();
    }
    if (input.match(/^\d+$/)) {
      result = true;
    }
    return result;
  };
});

app.filter('price', function(values) {
  return function(input) {    
    result = false;
    if (typeof input === 'number') {
      input = input.toString();
    }
    if ((input.length <= values.max_price_length) &&
        (input.match(/^(\d+)?$/))) {
      result = true;
    }
    return result;
  };
});

app.filter('address', function(values) {
  return function(input) {
    result = false;
    if ((input.length >= values.min_address_length) && (input.length <= values.max_address_length)) {
      result = true;
    }
    return result;
  };
});

app.filter('link', function(values) {
  return function(input) {
    result = false;
    if ((input.length <= values.max_link_length) &&
      (input.match(/^(http:\/\/.+)?$/))) {
      result = true;
    }
    return result;
  };
});

app.filter('floor', function(values) {
  return function(input) {
    result = false;
    if (typeof input === 'number') {
      input = input.toString();
    }
    if ((input.length <= values.max_floor_length) &&
        (input.match(/^(\d+)?$/))) {
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

app.filter('phones', function() {
  return function(input) {
    out = '';
    angular.forEach(input, function(phone) {
      out = out + phone.phone + ', ';
    });
    return out.replace(/, $/,'');
  }
});

app.filter('call', function() {
  out = '';
  return function(input, options) {
    angular.forEach(options, function(opt) {
      if (opt.name === input) {
        out = opt.value;
      }
    });
    return out;
  }
});

app.filter('shortText', function() {
  return function(input, len) {
    out = input;
    if ((input != '') && (input != undefined) && (input.length>len)) {
      out = input.substr(0, len) + '...';
    }
    return out;
  }
});

app.filter('userArrayFilter', function() {
  return function(flats, userFilter) {
    if ((userFilter.enabled) && (flats != undefined)) {
      angular.forEach(userFilter.filters, function(val, key) {
        // Run thru all flats
        i = 0;
        flats_count = flats.length;
        while (i<flats_count) {
          switch (val.type) {
            case 'string':
              if ((!flats[i][key].match(val.value)) && (val.value != '')) {
                flats.splice(flats.indexOf(flats[i]), 1);
                i = i - 1;
              }
              break;
            case 'int':
              if ((val.min_value != '') && (val.max_value != '') && 
                ((parseInt(flats[i][key]) < parseInt(val.min_value)) || 
                (parseInt(flats[i][key]) > parseInt(val.max_value)))) {
                  flats.splice(flats.indexOf(flats[i]), 1);
                  i = i - 1;
              }
              break;
            case 'bool':
              if ((flats[i][key] != true) && (val.value == true)) {
                flats.splice(flats.indexOf(flats[i]), 1);
                i = i - 1;
              }
              break;
            case 'array':
              if ((flats[i][key].length === 0) && (val.value == true)) {
                flats.splice(flats.indexOf(flats[i], 1));
                i = i - 1;
              }
              break;
            case 'phones':
              flag = true;
              angular.forEach(flats[i].phones, function(phone) {
                if (phone.phone.match(val.value)) {
                  flag = false;
                }
              });
              if ((flag) && (val.value != '')) {
                flats.splice(flats.indexOf(flats[i], 1));
                i = i - 1;
              }
              break;
            case 'date':
              if ((val.min_value != '') && (val.max_value != '') && (
                (moment(flats[i][key].replace(' UTC',''),'YYYY-MM-DD HH:mm:ss') < moment(val.min_value,'YYYY-MM-DD HH:mm:ss')) || 
                (moment(flats[i][key].replace(' UTC',''),'YYYY-MM-DD HH:mm:ss') > moment(val.max_value,'YYYY-MM-DD HH:mm:ss')))) {
                  flats.splice(flats.indexOf(flats[i]), 1);
                  i = i - 1;
              }
              break;
          }
          i = i + 1;
          flats_count = flats.length;
        }
      });
    }
    return flats;
  };
});

app.filter('sort', function() {
  return function(input, sortBy, type, order) {
    if ((input !== undefined) && (input.length > 0)) {
      ord = (order == 'asc' ? 1 : -1);
      input.sort(function(a,b) {
        switch (type) {
          case 'string': return ((a[sortBy].toLowerCase()>b[sortBy].toLowerCase())? ord : -ord);
            break;
          case 'int': return (a[sortBy]>b[sortBy] ? ord : -ord);
            break;
          case 'date': return (moment(a[sortBy].replace(' UTC',''),'YYYY-MM-DD HH:mm:ss')>moment(b[sortBy].replace(' UTC',''),'YYYY-MM-DD HH:mm:ss') ? ord : -ord);            
            break;
          case 'bool': return (a[sortBy]===b[sortBy] ? 0 : a[sortBy]? ord : -ord);
            break;
          case 'length': return (a[sortBy].length>b[sortBy].length ? ord : -ord);
            break;
        }
      });
    }
    return input;
  };
});