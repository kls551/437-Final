var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({ caseSensitive: true });
var async = require('async');
var multer = require('multer');

//img stuff
const formData = require('express-form-data')
require('dotenv').config({
   path: './config.env'
})
var cloudinary = require('cloudinary');

router.use(formData.parse())

cloudinary.config({
   cloud_name: process.env.CLOUD_NAME,
   api_key: process.env.API_KEY, 
   api_secret: process.env.API_SECRET
})

console.log(process.env.CLOUD_NAME)
router.baseURL = '/Listing';

// this is multiple image upload (tester version)
router.post('/multiple_uploads', async (req, res) => {
   /* we would receive a request of file paths as array */
   let filePaths = req.body.filePaths;
   let multipleUpload = new Promise(async (resolve, reject) => {
     let upload_len = filePaths.length
         ,upload_res = new Array();

       for(let i = 0; i <= upload_len + 1; i++)
       {
           let filePath = filePaths[i];
           await cloudinary.uploader.upload(filePath, (error, result) => {
               if(upload_res.length === upload_len)
               {
                 /* resolve promise after upload is complete */
                 resolve(upload_res)
               }else if(result)
               {
                 /*push public_ids in an array */  
                 upload_res.push(result.public_id);
               } else if(error) {
                 reject(error)
               }
           })
       } 
   })
   .then((result) => console.log("res  ", result, "resUp ...", upload_res))
   .catch((error) => console.log(error))

   let upload = await multipleUpload; 
   res.json({'response':upload})
})

router.get('/', function (req, res) {
   console.log(req.query);
   var owner = req.query.owner;
   var numbed = req.query.numbed;
   var price = req.query.price;
   var joinQuery = "select l.*, m1.imageUrl from Listing l "+
      "left join "+ 
      "(select min(m.ListingId) as ListingId, min(imageUrl) as imageUrl from "+
      "Image m "+
      "group by m.ListingId) m1 "+
      "on l.id = m1.ListingId ";
   var sort;
   if (price === "1")
      sort = "order by price asc;";
   else if (price === "-1")
      sort = "order by price desc;";

   async.waterfall([
      function (cb) {  // Check for existence of Listing
         if (req.validator.check(req.session, Tags.noLogin, null, cb)) {
            if (price)
               req.cnn.chkQry(joinQuery +
               sort,
               [owner], cb);
            else if (owner)
               req.cnn.chkQry(joinQuery +' where ownerid = ? '+
                  'order by postedDate asc',
                  [owner], cb);
            else if (numbed)
               req.cnn.chkQry(joinQuery + ' where numBed = ? '+
                  'order by postedDate asc',
                  [numbed], cb);
            else if (numbed && owner)
               req.cnn.chkQry(joinQuery+' where numBed = ? and ownerId = ? '+
                  'order by postedDate asc',
                  [numbed, owner], cb);
            else
               req.cnn.chkQry(joinQuery+ 'order by postedDate asc', cb);
         }
      },
      function (Listings, fields, cb) { // Return retrieved messages
         console.log(Listings);
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
   req.cnn.chkQry('select l.*, m.imageUrl from Listing l ' 
   +'left join Image m on m.ListingId = l.id where l.id = ? limit 1',
      [req.params.ListingId], handler);
});

router.post('/', function (req, res) {
   var vld = req.validator;
   var body = req.body;
   var cnn = req.cnn;
   console.log(body);
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
         if (vld.check(!existingLst.length, Tags.dupTitle, null, cb)) {
            body.postedDate = (new Date().getTime());
            cnn.chkQry("insert into Listing set ?", body, cb);
         }
      },
      function (insRes, fields, cb) {
         res.location(router.baseURL + '/' + insRes.insertId).end();
         res.status(200).end;
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
         if(vld.hasFields(body, 
            ["title", "price", "numBed", "location",
            "contactInfo", "description"], cb)
            && req.validator.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('select * from Listing where id = ?', [ListingId], 
               cb);
      },
      function (Listing, fields, cb) {
         if (vld.check(Listing.length, Tags.notFound, null, cb) &&
            vld.checkPrsOK(Listing[0].ownerId, cb))
            cnn.chkQry('select * from Listing where id <> ?'+
               ' and title = ?',[ListingId, body.title], cb);
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
   var imgArr = [];

   async.waterfall([
      function (cb) {
         if (req.validator.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('select * from Listing where id = ?', [ListingId],
               cb);
      },
      function (Listing, fields, cb) {
         if (vld.check(Listing.length, Tags.notFound, null, cb) &&
            vld.checkPrsOK(Listing[0].ownerId, cb))
               cloudinary.v2.api.delete_resources_by_tag(ListingId,
                  cb);
      },
      function (fields, cb) {
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
      ' from Listing l join Image m on m.ListingId = l.id'+
      ' where l.id = ?';

   async.waterfall([
      function (cb) {  // Check for existence of Listing
         if (req.validator.check(req.session, Tags.noLogin, null, cb))
            cnn.chkQry('select * from Listing where id = ?', [ListingId],
               cb);
      },
      function (Listing, fields, cb) { // Get indicated messages
         console.log(Listing);
         if (vld.check(Listing.length, Tags.notFound, null, cb))
            cnn.chkQry(query, params, cb);
      },
      function (Images, fields, cb) { // Return retrieved messages
         console.log(Images);
         res.json(Images);
         cb();
      }],
      function (err) {
         cnn.release();
      });
});


router.post('/:ListingId/Images', function (req, res) {
   var vld = req.validator;
   var cnn = req.cnn;
   var ListingId = req.params.ListingId;

   // const values = Object.values(req.files);
   const filePath = [req.body.filePath];
   console.log("posting images ", filePath);
   const promises = filePath.map(file => 
      cloudinary.v2.uploader.upload(file, {tags : ListingId}));
   
   Promise
     .all(promises)
     .then(results => {

      async.waterfall([
         function (cb) {
            if (vld.check(req.session, Tags.noLogin, null, cb)) {
               //vld.hasFields(req.body, ["imageUrl"], cb)) {
               cnn.chkQry('select * from Listing where id = ?', [ListingId],
                  cb);
            }
         },
         function (Listing, fields, cb) {
            if (vld.check(Listing.length, Tags.notFound, null, cb)) {
               cnn.query("insert into Image set ?",
                  {
                     ListingId: ListingId,
                     imageUrl: results[0].secure_url
                  }
                  , cb);
            }
         },
         function (insRes, fields, cb) {
            if (vld.check(insRes, Tags.notFound, null, cb)) {
               res.location(router.baseURL + '/' + insRes.insertId).end();
            }
            cb();
         }],
         function (err) {
            cnn.release();
         });
   })
   .catch(err => {console.log("this is error ",err);
      vld.check(!err, Tags.notFound, null, null);
      // res.status(400).end();
      cnn.release();
   });
});

module.exports = router;