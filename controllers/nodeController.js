var mongoose = require("mongoose")
var Node = require("../models/node")
var Util = require("../utils/Util")

var _ = require("lodash")

exports.nodes_list = function(req, res) {
    Node.find({}, "id name").exec(function(err, list_nodes) {
        if (err) {
            return next(err)
        }
        //Successful, so send
        res.send(list_nodes)
    })
}

exports.node_detail = function(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400).send("Wrong Id")
        return
    }
    Node.findById(req.params.id).exec(async function(err, node_details) {
        if (err || !node_details) {
            //res.status(404).send;
            return next(err)
        }
        //Successful, so send
        var sorted_list = await Util.topologicalSort(node_details)

        Node.find(
            {
                _id: { $in: sorted_list },
            },
            function(err, docs) {
                var response = Util.sort(docs, sorted_list)
                res.send(response)
            }
        )
    })
}

_addNode = async (req, res, next, level) => {
    const currentNode = req.body
    // if the current node has an id
    if (!currentNode.id) {
        // the current node does not exist
        var newNode = new Node({
            name: currentNode.name,
            institution: currentNode.institution,
            nodeType: currentNode.nodeType || "document",
            description: currentNode.description,
            dependencies: await Promise.all(
                _.map(req.body.dependencies, dependency =>
                    _addNode(
                        {
                            body: dependency,
                        },
                        res,
                        next,
                        level + 1
                    )
                )
            ),
        })
        newNode.save(function(err) {
            if (err) {
                return next(err)
            }
            console.log("Node", newNode)
            if(level === 0) res.send(newNode)
        })
        return newNode.id
    } else return currentNode.id
}
exports.addNode = async function(req, res, next) {
    await _addNode(req, res, next, 0)
}

exports.addHint = async function(req, res, next) {
    if (!req.body.hints) {
        res.status(400).send()
        return
    }
    Node.findById(req.params.id).exec(function(err, node) {
        if (err) {
            return next(err)
        }
        //Successful, so update
        if (node.hints) {
            node.hints = node.hints.concat(req.body.hints)
        } else {
            node.hints = req.body.hints
        }
        Node.findByIdAndUpdate(req.params.id, node, {}, function(
            err,
            res_node
        ) {
            if (err) {
                return next(err)
            }

            // Successful - send the node back.
            res.send(node)
        })
    })
}

exports.getNode = function(id, callback) {
    Node.findById(id).exec(function(err, node_details) {
        if (err) {
            return next(err)
        }
        //Successful, so invoke callback
        callback(node_details)
    })
}
