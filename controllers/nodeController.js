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