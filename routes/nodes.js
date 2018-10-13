var express = require('express');
var router = express.Router();



/* GET all nodes names and ids */
router.get('/', function(req, res, next) {
  res.send('all nodes here');
});

module.exports = router;
