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
 
    //var first_element = res.shift();
    //res.reverse();
    //res.unshift(first_element);
    return res;
}

exports.sort = function(nodes,sorted_id_list) {
    console.log(sorted_id_list);
    var ret = [];
    for (var i = 0; i< nodes.length; i++) {
        ret.push(getElement(nodes,sorted_id_list[i]));
    }

    return ret;
}

var getElement = function(list,id) {
    var elementToReturn = _.find(list,{_id:id});
    return elementToReturn;
}