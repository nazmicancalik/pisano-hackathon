var express = require('express');
var router = express.Router();

var NodeController = require('../controllers/nodeController');


/* GET all nodes names and ids */
router.get('/', NodeController.nodes_list);

/* GET Specific node and its dependencies, Topological sort will be here, ordered list */
router.get('/:id', NodeController.node_detail);

module.exports = router;
