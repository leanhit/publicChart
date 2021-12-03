var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('global/registry', { title: 'Registry' });
});

module.exports = router;
