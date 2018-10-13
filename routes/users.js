var express = require('express');
var router = express.Router();

/* GET all users */
router.get('/', function(req, res, next) {
  res.send('Userlar buraya gelecek');
});

module.exports = router;
