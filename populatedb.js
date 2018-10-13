#! /usr/bin/env node

console.log('This script populates nodes to the database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

var async = require('async')
var Node = require('./models/node')

var mongoose = require('mongoose');
var mongoDB = 'mongodb://exbibyte:exbibyte2018@ds131373.mlab.com:31373/paperwork'
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var nodes = [];

function nodeCreate(name, node_type, description,dependencies, hints, instutition, cb) {
  nodeDetail = { 
    name: name,
    node_type: node_type,
    description: description,
    dependencies: dependencies,
    hints: hints,
    instutition: instutition
  }
  
  var node = new Node(nodeDetail);

  node.save(function (err) {
    if (err) {
      cb(err, null)
      return;
    }
    console.log('New node: ' + node);
    nodes.push(node)
    cb(null, node)
  });
}

function createNodes(cb) {
    async.parallel([
        function(callback) {
          nodeCreate('Passport', 'document', 'Description' ,[], ['Hint 1','Hint 2', 'Hint 3'], { name: 'Nüfus Müdürlüğü', description: 'Description here', loc: { lat: 1, long: 2}}, callback);
        },
        function(callback) {
          nodeCreate('Nüfus Cüzdanı', 'document', 'Description' ,[], ['Hint 1','Hint 2', 'Hint 3'], { name: 'Adliye', description: 'Description here', loc: { lat: 1, long: 2}}, callback);
        },
        function(callback) {
          nodeCreate('Foto', 'action', 'Description',[], ['Hint 1','Hint 2', 'Hint 3'], { name: 'Fotoğrafçı', description: 'Description here', loc: { lat: 1, long: 2}}, callback);
        }],
        // optional callback
        cb);
}

async.series([
    createNodes
],

// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Nodes: '+ 'nodes here');
    }

    // All done, disconnect from database
    mongoose.connection.close();
});



