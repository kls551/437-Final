var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({ caseSensitive: true });
var async = require('async');

router.baseURL = '/Listing';

router.get('/', function (req, res) {
   var owner = req.query.owner;
   var numbed = req.query.numbed;
   async.waterfall([
      function (cb) {  // Check for existence of Listing
         if (req.validator.check(req.session, Tags.noLogin, null, cb)) {
            if (owner)
               req.cnn.chkQry('select * from Listing where ownerid = ?'+
                  'order by postedDate asc',
                  [owner], cb);
            else if (numbed)
               req.cnn.chkQry('select * from Listing where numBed = ?'+
                  'order by postedDate asc',
                  [numbed], cb);
            else if (numbed && owner)
               req.cnn.chkQry('select * from Listing where numBed = ?'+
                  'order by postedDate asc'+
                  'ownerid = ?',
                  [numbed, owner], cb);
            else
               req.cnn.chkQry('select * from Listing order by postedDate asc', cb);
         }
      },
      function (Listings, fields, cb) { // Return retrieved messages
         res.status(200).json(Listings);
         cb();
      }],
      function (err) {
         req.cnn.release();
      });
});

router.get('/:ListingId', function (req, res) {
   var handler = function (err, prsArr) {
      res.json(prsArr[0]);
      req.cnn.release();
   };
   if (!req.session) {
      req.status(401).end();
      req.cnn.release();
   }
   req.cnn.chkQry('select * from Listing where id = ?',
      [req.params.ListingId], handler);
});

router.post('/', function (req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;

   async.waterfall([
      function (cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb))
            if (vld.hasFields(body, 
                  ["title", "price", "numBed", "location",
                  "contactInfo", "description"], cb)) {
               body.ownerId = req.session.id;
               cnn.chkQry('select * from Listing where title = ?',
                  body.title, cb);
            }
      },
      function (existingLst, fields, cb) {
         if (vld.check(!existingLst.length, Tags.dupTitle, null, cb))
            cnn.chkQry("insert into Listing set ?", body, cb);
      },
      function (insRes, fields, cb) {
         res.location(router.baseURL + '/' + insRes.insertId).end();
         cb();
      }],
      function () {
         cnn.release();
      });
});

router.put('/:ListingId', function (req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   var ListingId = req.params.ListingId;
   var owner = req.session.id;

   async.waterfall([
      function (cb) {
         if(req.validator.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('select * from Listing where id = ?', [ListingId], 
               cb);
      },
      function (Listing, fields, cb) {
         if (vld.check(Listing.length, Tags.notFound, null, cb) &&
            vld.checkPrsOK(Listing[0].ownerId, cb))
            cnn.chkQry('select * from Listing where id <> ?'+
               ' && title = ?',[ListingId, body.title], cb);
      },
      function (sameTtl, fields, cb) {
         if (vld.check(!sameTtl.length, Tags.dupTitle, null, cb))
            cnn.chkQry("update Listing set ? where id = ?",
               [body, ListingId], cb);
      }],
      function (err) {
         if (!err)
            res.status(200).end();
         req.cnn.release();
      });
});

router.delete('/:ListingId', function (req, res) {
   var vld = req.validator;
   var ListingId = req.params.ListingId;
   var cnn = req.cnn;

   async.waterfall([
      function (cb) {
         if (req.validator.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('select * from Listing where id = ?', [ListingId],
               cb);
      },
      function (Listing, fields, cb) {
         if (vld.check(Listing.length, Tags.notFound, null, cb) &&
            vld.checkPrsOK(Listing[0].ownerId, cb))
            cnn.chkQry('delete from Listing where id = ?', [ListingId],
               cb);
      }],
      function (err) {
         if (!err)
            res.status(200).end();
         cnn.release();
      });
});

router.get('/:ListingId/Images', function (req, res) {
   var vld = req.validator;
   var ListingId = req.params.ListingId;
   var cnn = req.cnn;
   var params = [ListingId];

   var query = 'select m.id as id,'+
      ' m.imageUrl as imageUrl' +
      ' from Listing l join Images m on m.ListingId = l.id'+
      ' where l.id = ?';

   async.waterfall([
      function (cb) {  // Check for existence of Listing
         if (req.validator.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('select * from Listing where id = ?', [ListingId],
               cb);
      },
      function (Listing, fields, cb) { // Get indicated messages
         if (vld.check(Listing.length, Tags.notFound, null, cb))
            cnn.chkQry(query, params, cb);
      },
      function (Images, fields, cb) { // Return retrieved messages
         res.json(Images);
         cb();
      }],
      function (err) {
         cnn.release();
      });
});

// we dont know yet
router.post('/:ListingId/Images', function (req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var ListingId = req.params.ListingId;
   var now;

   async.waterfall([
      function (cb) {
         if (vld.check(req.session, Tags.noLogin, null, cb) &&
            vld.hasFields(req.body, ["imageUrl"], cb)) {
            cnn.chkQry('select * from Listing where id = ?', [ListingId],
               cb);
         }
      },
      function (Listing, fields, cb) {
         if (vld.check(Listing.length, Tags.notFound, null, cb))
            cnn.chkQry('insert into Message set ?',
               {
                  ListingId: ListingId, prsId: req.session.id,
                  whenMade: now = (new Date().getTime()), 
                  content: req.body.content
               }, cb);
      },
      function (insRes, fields, cb) {
         res.location(router.baseURL + '/' + insRes.insertId).end();
         cnn.chkQry("update Listing set lastMessage = ? where id = ?",
            [now, ListingId], cb);
      }],
      function (err) {
         cnn.release();
      });
});

module.exports = router;