var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
  res.send('hello');
});

app.listen(8080, function() {
  console.log('Server started on 8080 port...');
});

