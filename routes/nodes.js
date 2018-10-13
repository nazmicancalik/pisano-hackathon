var express = require('express');
var router = express.Router();

var NodeController = require('../controllers/nodeController');


/* GET all nodes names and ids */
router.get('/', NodeController.nodes_list);

module.exports = router;
