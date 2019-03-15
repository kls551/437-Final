var Express = require('express');
var Tags = require('../Validator.js').Tags;
var async = require('async');
var mysql = require('mysql');

var router = Express.Router({ caseSensitive: true });

router.baseURL = '/Prss';

/* Much nicer versions
*/
router.get('/', function (req, res) {
   var email = req.session.isAdmin() && req.query.email ||
      !req.session.isAdmin() && req.query.email;
   var limit = "";

   var qemail = req.query.email;
   var semail = req.session.email;
   var handler = function (err, prsArr) {
      if (req.session.isAdmin())
         res.json(prsArr);
      else {
         var i = null;
         for (i = 0; prsArr.length > i; i += 1) {
            if (prsArr[i].id === req.session.id) {
               prsArr[0] = prsArr[i];
               prsArr.length = 1;
               res.json(prsArr);
               break;
            }
         }
      }
      req.cnn.release();
   };


   if (email) {
      if (!semail.startsWith(qemail) && !req.session.isAdmin()) {
         res.json([]);
         req.cnn.release();
      }
      else {
         req.cnn.chkQry('select id, email from Person where email LIKE ?'
            , email + '%', handler);
      }
   }
   else
      req.cnn.chkQry('select id, email from Person', handler);
});

router.post('/', function (req, res) {
   var vld = req.validator;  // Shorthands
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;

   if (admin && !body.password)
      body.password = "*";                       // Blocking password
   if (admin && body.termsAccepted === false)
      body.termsAccepted = null;
   body.whenRegistered = new Date();

   async.waterfall([
      function (cb) { // Check properties and search for Email duplicates
         if (vld.hasFields(body, ["email", "lastName", "password", "role"],
               cb)
            && vld.chain(body.role === 0 || admin, Tags.noPermission)
               .chain(body.termsAccepted || admin, Tags.noTerms)
               .check(body.role >= 0, Tags.badValue, ["role"], cb)) {
            cnn.chkQry('select * from Person where email = ?', body.email,
               cb)
         }
      },
      function (existingPrss, fields, cb) { 
         if (vld.check(!existingPrss.length, Tags.dupEmail, null, cb)) {
            body.termsAccepted = body.termsAccepted && new Date();
            cnn.chkQry('insert into Person set ?', body, cb);
         }
      },
      function (result, fields, cb) { // Return location of inserted Person
         res.location(router.baseURL + '/' + result.insertId).end();
         cb();
      }],
      function (err) {
         cnn.release();
      });
});

function isEmpty(obj) {
   for (var prop in obj) {
      if (obj.hasOwnProperty(prop))
         return false;
   }
   return JSON.stringify(obj) === JSON.stringify({});
}

router.put('/:id', function (req, res) {
   // Class exercise
   var vld = req.validator;
   var body = req.body;
   var admin = req.session && req.session.isAdmin();
   var cnn = req.cnn;

   async.waterfall([
      function (cb) {
         if (isEmpty(body)) {
            res.status(200).end();
            // need cb for release
            cb();
         }

         if (vld.checkPrsOK(req.params.id, cb)
            && vld.chain(!('email' in body), Tags.forbiddenField, ['email'])
               .chain(!('termsAccepted' in body), 
                  Tags.forbiddenField, ['termsAccepted'])
               .chain(!('whenRegistered' in body), 
                  Tags.forbiddenField, ['whenRegistered'])
               .check(!('role' in body) || admin || body.role === 0, 
                  Tags.badValue, ['role'], cb)) {
            cnn.chkQry('select * from Person where id = ?', [req.params.id],
               cb); //chkQry automatically follows with 500 if query error
         }
      },

      function (result, fields, cb) {
         if (vld.check(result.length, Tags.notFound, null, cb) &&
            vld.chain(!("password" in body) || body.password !== "", 
               Tags.badValue, ['password'])
               .check(!("password" in body) || body.password !== null, 
                  Tags.badValue, ['password'], cb) &&
            vld.check(!('password' in body) || ('oldPassword' in body) 
               || admin, Tags.noOldPwd, null, cb) &&
            vld.check(!('password' in body) 
               || body.oldPassword === result[0].password 
               || admin, Tags.oldPwdMismatch, null, cb)
         ) {

            delete body.oldPassword;
            cnn.chkQry("update Person set ? where id = ?", 
               [body, req.params.id], cb);
            // because of not callbacks, it might return 4 months from now
            // --> res.status(200).end();
         }
      },
      function (result, fields, cb) {
         res.status(200).end();
         // need cb for release
         cb();
      }
   ],
      function (err) {
         cnn.release();
      }
   );
});

router.get('/:id', function (req, res) {
   var vld = req.validator;
   var admin = req.session && req.session.isAdmin();

   async.waterfall([
      function (cb) {
         if (vld.checkPrsOK(req.params.id, cb) &&
            vld.check(req.session, Tags.noLogin, null, cb))
            req.cnn.chkQry('select id, firstName, lastName, ' +
               'email, (UNIX_TIMESTAMP(whenRegistered)*1000) ' +
               'as whenRegistered,'+
               '(UNIX_TIMESTAMP(termsAccepted)*1000) '+
               'as termsAccepted, role '+
               'from Person where id = ?', [req.params.id],
               cb);
      },
      function (prsArr, fields, cb) {
         if (vld.check(prsArr.length, Tags.notFound, null, cb)) {
            res.json(prsArr);
            cb();
         }
      }],
      function (err) {
         req.cnn.release();
      });
});

router.delete('/:id', function (req, res) {
   var vld = req.validator;
   var id = req.params.id;
   var cnn = req.cnn;

   async.waterfall([
      function (cb) {
         cnn.chkQry('select * from Person where id = ?', [id], cb);
      },
      function (prss, fields, cb) {
         if (vld.check(prss.length, Tags.notFound, null, cb) &&
            vld.checkAdmin(cb))
            cnn.chkQry('delete from Person where id = ?', [id], cb);
      }],
      function (err) {
         if (!err)
            res.status(200).end();
         cnn.release();
      });
});

module.exports = router;
