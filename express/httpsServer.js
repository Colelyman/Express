var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());
var basicAuth = require('basic-auth-connect');
var auth = basicAuth(function(user, pass) {
  return((user ==='cs201r') && (pass === 'test'));
});

var options = {
	host: '127.0.0.1',
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.crt')
};

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
app.use('/', express.static('/home/bitnami/htdocs', {maxAge: 60*60*1000}));

app.get('/getcity', function(req, res) {
  console.log("In getcity route");
  var urlObj = url.parse(req.url, true, false);
  var regEx = new RegExp("^" + urlObj.query["q"]);
    fs.readFile('cities.dat.txt', function (err, data) {
      if (err) throw err;
      cities = data.toString().split("\n");
      var results = [];
      for(var i = 0; i < cities.length; i++) {
        var result = cities[i].search(regEx);
        if(result != -1) {
          console.log(cities[i]);
          results.push({city:cities[i]});
        }
      }
      res.writeHead(200);
      res.end(JSON.stringify(results));
  
});
});

app.get('/comment', function(req, res) {
  console.log("In comment route");
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost/weather", function(err, db) {
    if(err) throw err;
    db.collection("comments", function(err, comments){
      if(err) throw err;
      comments.find(function(err, items){
        items.toArray(function(err, itemArr){
          console.log("Document Array: ");
          console.log(itemArr);
          res.writeHead(200);
          res.end(JSON.stringify(itemArr));
        });
      });
    });
  });
});

app.post('/comment', auth, function(req, res) {
  console.log("In POST comment route");
  console.log(req.body);
  //var reqObj = JSON.parse(jsonData);
  console.log(req);
  console.log("Name: " + req.body.Name);
  console.log("Comment: " + req.body.Comment);
  var MongoClient = require('mongodb').MongoClient;
  MongoClient.connect("mongodb://localhost/weather", function(err, db) {
    if(err) {
      throw err;
    }
    db.collection('comments').insert(req.body, function(err, records) {
      console.log("Record added as " + records[0]._id);
    });
  });
  res.status(200);
  res.end();
});
