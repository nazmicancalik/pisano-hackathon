var TopoSort = require('topo-sort');
var mongoose = require('mongoose');
var _ = require('lodash');

var nodeController = require('../controllers/nodeController');

exports.topologicalSort = function(node) {
    var id = node.id;
    var dependencies = node.dependencies;

    var tsort = new TopoSort();

    tsort.add(id,dependencies);
    
    var i;
    for(i = 0; i < dependencies.length; i++) {
        nodeController.getNode(dependencies[i],function(node){
            tsort.add(dependencies[i],node);
        });
    }

    var sorted_ids = tsort.sort();
    var res = [];

    var j;
    for(j = 0; j < sorted_ids.length; j++) {
        res.push(mongoose.Types.ObjectId(sorted_ids[j]));
    }
    console.log(res);
    return res;
}