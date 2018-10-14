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

exports.addNode = function(req,res,next) {
    console.log('Add note giriş');
    var node = new Node({
        name: req.body.name,
        nodeType: req.body.nodeType || 'document',
        description: req.body.description,
        dependencies: _.map(req.body.dependencies, function(aDepenedency){
            // If the dependency already exist in the database.
            if(aDepenedency.id){
                return aDepenedency.id;
            } else {
                console.log('Kayıtlı olmayan dep');
                var aDep = new Node({
                    name: aDepenedency.name,
                    description: aDepenedency.description,
                    dependencies: []
                });

                aDep.save(function(err) {
                    if (err) {return next(err);}
                    return aDep.id;
                });
            }
        })
    });

    node.save(function(err){
        if (err) { return next(err); }
        console.log('Node', node);
        res.send(node);
    });
};

exports.getNode = function(id,callback) {
    Node.findById(id)
        //.select("-dependencies")
        .exec(function (err, node_details) {
            if (err) { 
              return next(err); 
            }
            //Successful, so invoke callback
            callback(node_details);
        });
};