var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
// 第一次访问时候，给你react的public 的index hmtl
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('index.html', {root: path.join(__dirname, '../../client/build/')});
});

module.exports = router;
