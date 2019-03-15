var Express = require('express');
var Tags = require('../Validator.js').Tags;
var router = Express.Router({ caseSensitive: true });
var async = require('async');

router.baseURL = '/Msgs';

router.get('/:msgId', function (req, res) {
   var vld = req.validator;

   async.waterfall([
      function (cb) {
         if (vld.checkPrsOK(req.session.id, cb) &&
            vld.check(req.session, Tags.noLogin, null, cb))
            req.cnn.chkQry('select whenMade, email, content from Message m,'+
               'Person p where m.prsId = p.id && m.id = ?', 
               [req.params.msgId], cb);
      },
      function (prsArr, fields, cb) {
         if (vld.check(prsArr.length, Tags.notFound, null, cb)) {
            res.json(prsArr[0]);
            cb();
         }
      }],
      function (err) {
         req.cnn.release();
      });
});


module.exports = router;
