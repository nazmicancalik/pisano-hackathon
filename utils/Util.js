// var TopoSort = require('topo-sort');
var ds = require('dependency-solver'); 
var mongoose = require('mongoose');
var _ = require('lodash');
var async = require('async');

var nodeController = require('../controllers/nodeController');

exports.topologicalSort = async function (node) {
    
    var id = node.id;
    var dependencies = node.dependencies;

    var graph = {};
    
    graph[id] = dependencies;
    
    var i;
    const sexy = async(node) => {
        const promises = [];
        (node.dependencies || []).forEach((dependency) => {
            if (!graph[dependency]) {
                promises.push((async() => {
                    try {
                        const innerPromises = [];
                        await (new Promise ((resolve, reject) => nodeController.getNode(dependency, (innerNode) => {
                            if(!graph[dependency]){
                                graph[dependency] = innerNode.dependencies || [];
                                innerPromises.push(sexy(innerNode));
                            }
                            resolve();
                        })));
                        await Promise.all(innerPromises);
                    } catch(err) {
                        console.log("Error", err)
                    }
                })())
            }
        });
        await Promise.all(promises);
    }
    await sexy(node);

    // console.log('========');
    // console.log(graph);
    // console.log('========');

    var res = [];
    try {
        var sorted_ids = ds.solve(graph);

        var j;
        for(j = 0; j < sorted_ids.length; j++) {
            res.push(mongoose.Types.ObjectId(sorted_ids[j]));
        }

        return res;
    } catch (err) {
        res.push(mongoose.Types.ObjectId(id))
        return res;
    }
}

exports.sort = function(nodes,sorted_id_list) {
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


/*
var tsort = new TopoSort();

tsort.add('a',['b','c','d']);
tsort.add('b',['c','t']);

var sorted_ids = tsort.sort();
console.log(sorted_ids);
*/