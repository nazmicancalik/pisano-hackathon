var mongoose = require('mongoose');
var Node = require('../models/node');
var Util = require('../utils/Util');

var _ = require('lodash');

exports.nodes_list = function(req,res) {
    Node.find({}, 'id name')
    .exec(function (err, list_nodes) {
        if (err) { 
          return next(err); 
        }
        //Successful, so send
        res.send(list_nodes);
    });
}

exports.node_detail = function(req,res,next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).send('Wrong Id');
        return ;
    }
    Node.findById(req.params.id)
        .exec(async function (err, node_details) {
            if (err || !node_details) { 
              //res.status(404).send;
              return next(err);
            }
            //Successful, so send
            var sorted_list = await Util.topologicalSort(node_details);

            Node.find({
                '_id': { $in: sorted_list }
            }, function(err, docs){
                var response = Util.sort(docs,sorted_list);
                res.send(response);
            });
        });
}

exports.addNode = async function(req,res,next) {
    var node = new Node({
        name: req.body.name,
        nodeType: req.body.nodeType || 'document',
        description: req.body.description,
        dependencies: await Promise.all(_.map(req.body.dependencies, async function(aDependency){
            // If the dependency already exist in the database.
            if(aDependency.id){
                return aDependency.id;
            } else {
                var aDep = new Node({
                    name: aDependency.name,
                    nodeType: aDependency.nodeType || 'document',
                    description: aDependency.description,
                    dependencies: []
                });
                try {
                    const savedDep = await aDep.save();
                    return savedDep.id
                } catch(err) {
                    return next(err);
                }
            }
        }))
    });

    node.save(function(err){
        if (err) { return next(err); }
        console.log('Node', node);
        res.send(node);
    });
};

exports.addHint = async function(req,res,next) {
    Node.findById(req.params.id)
        .exec(function (err, node) {
            if (err) { 
              return next(err); 
            }
            //Successful, so update
            if (node.hints){
                node.hints = node.hints.concat(req.body.hints);
            } else {
                node.hints = req.body.hints;
            }
            Node.findByIdAndUpdate(req.params.id, node, {}, function(err,res_node){
                if (err) { return next(err); }
                
                // Successful - send the node back.
                res.send(node);
            })
        });
}

exports.getNode = function(id,callback) {
    Node.findById(id)
        .exec(function (err, node_details) {
            if (err) { 
              return next(err); 
            }
            //Successful, so invoke callback
            callback(node_details);
        });
};