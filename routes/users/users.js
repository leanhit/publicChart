var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const title = (req.baseUrl).slice(1, req.baseUrl.length);
  res.render('index', { title: title });
});

module.exports = router;
