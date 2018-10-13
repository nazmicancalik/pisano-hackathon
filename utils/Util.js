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
                console.log("doop");
                promises.push((async() => {
                    try {
                        const innerPromises = [];
                        console.log("poop");
                        await (new Promise ((resolve, reject) => nodeController.getNode(dependency, (innerNode) => {
                            console.log("hello node");
                            if(!graph[dependency]){
                                graph[dependency] = innerNode.dependencies || [];
                                innerPromises.push(sexy(innerNode));
                            }
                            console.log('*********');
                            console.log(graph);
                            console.log('*********');
                            resolve();
                        })));
                        await Promise.all(innerPromises);
                    } catch(err) {
                        console.log("erere", err)
                    }
                })())
            }
        });
        await Promise.all(promises);
    }
    await sexy(node);
/*
    async.each(dependencies, function(aDependency){
        nodeController.getNode(aDependency, function(node){
            console.log('**********');
            console.log(graph);
            console.log('**********');
            graph[aDependency] = node.dependencies;
        });
        console.log('girdi');
    }, function(){
        console.log(graph);
        var sorted_ids = ds.solve(graph);
        var res = [];

        var j;
        for(j = 0; j < sorted_ids.length; j++) {
            res.push(mongoose.Types.ObjectId(sorted_ids[j]));
        }

        return res;
    });
*/
    
    console.log('========');
    console.log(graph);
    console.log('========');

    var sorted_ids = ds.solve(graph);
    var res = [];

    var j;
    for(j = 0; j < sorted_ids.length; j++) {
        res.push(mongoose.Types.ObjectId(sorted_ids[j]));
    }

    return res;
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