var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Session = require('./Routes/Session.js');
var Validator = require('./Routes/Validator.js');
var CnnPool = require('./Routes/CnnPool.js');
var async = require('async');
var fs = require('fs');

const directory = './uploads';

var app = express();
//app.use(function(req, res, next) {console.log("Hello"); next();});
// Static paths to be served like index.html and all client side js
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads',express.static('uploads'));

var portt = 4000;

if (process.argv[3]) {
   portt = process.argv[3];
}

app.use(function (req, res, next) {
   console.log("Handling " + req.path + '/' + req.method);
   res.header("Access-Control-Allow-Origin", "http://localhost:3000");
   res.header("Access-Control-Allow-Credentials", true);
   res.header("Access-Control-Allow-Headers", ["Content-Type", "Location", "multipart/form-data"]);
   res.header("Access-Control-Expose-Headers", ["Location"]);
   res.header("Access-Control-Allow-Methods", ["DELETE", "PUT"]);
   next();
});

// No further processing needed for options calls.
app.options("/*", function (req, res) {
   res.status(200).end();
});

app.post('', function(req, res) {
   res.status(404).end();
   req.cnn.release();
});

// Static path to index.html and all clientside js
// Parse all request bodies using JSON
app.use(bodyParser.json());

// Attach cookies to req as req.cookies.<cookieName>
app.use(cookieParser());

// Set up Session on req if available
app.use(Session.router);

// otherwise respond immediately with 401 and noLogin error tag.
app.use(function (req, res, next) {
   console.log(req.path);
   if (req.session || (req.method === 'POST' &&
      (req.path === '/Prss' || req.path === '/Ssns'
         || req.path === '/Listing' || req.path === '/Imgs'))) {
      req.validator = new Validator(req, res);
      next();
   } else
      res.status(401).end();
});

// Add DB connection, with smart chkQry method, to |req|
app.use(CnnPool.router);

// Load all subroutes
app.use('/Prss', require('./Routes/Account/Prss.js'));
app.use('/Ssns', require('./Routes/Account/Ssns.js'));
app.use('/Listing', require('./Routes/House/Listing.js'));
app.use('/Imgs', require('./Routes/House/Imgs.js'));

app.delete('/DB', function (req, res) {
   // Callbacks to clear tables
   if (req.validator.checkAdmin()) {
      var cbs = ["Listing", "Image", "Person"]
         .map(function (tblName) {
         return function (cb) {
            req.cnn.query("delete from " + tblName, cb);
         };
      });

      fs.readdir(directory, (err,files) => {
         if (err ) throw err;

         for (const file of files) {
            fs.unlink(path.join(directory, file), err => {
               if (err) throw err;
            });
         }
      })

      // Callbacks to reset increment bases
      cbs = cbs.concat(["Listing", "Image", "Person"]
         .map(function (tblName) {
         return function (cb) {
            req.cnn.query("alter table " + tblName + " auto_increment = 1",
               cb);
         };
      }));
      // Callback to reinsert admin user
      cbs.push(function (cb) {
         req.cnn.query('INSERT INTO Person (firstName, lastName, email,'+
            ' password, whenRegistered, role) VALUES ' +
            '("Joe", "Admin", "adm@11.com","password", NOW(), 1);', cb);
      });

      // Callback to clear sessions, release connection and return result
      cbs.push(function (callback) {
         for (var session in Session.sessions)
            delete Session.sessions[session];
         callback();
      });

      async.series(cbs, function (err) {
         req.cnn.release();
         if (err)
            res.status(400).json(err);
         else
            res.status(200).end();
      });
   }
   else {
      req.cnn.release();
   }
});

app.use(function (req, res) {
   res.status(404).end();
   res.cnn.release();
});

app.use(function (err, req, res, next) {
   res.status(500).end();
   req.cnn && req.cnn.release();
});

app.listen(portt, function () {
   console.log('App Listening on port', portt);
});
