var fallback = require('express-history-api-fallback');
var express = require('express');

var app = express();
var root = __dirname;

app.use(express.static(root));
app.use(fallback('index.html', { root: root }));


var server = require('http').createServer(app);
server.listen(8080, function () {
  console.log('Listening on 8080');
});
