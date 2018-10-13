// var mongoose = require('mongoose');
var Node = require('../models/node');

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
    Node.findById(req.params.id)
        .exec(function (err, node_details) {
            if (err) { 
              return next(err); 
            }
            //Successful, so send
            res.send(node_details);
        });
}