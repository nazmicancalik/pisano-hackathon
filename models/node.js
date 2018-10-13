var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NodeSchema = new Schema(
    {
        name: String,
        node_type: {
            type: String,
            required: true, 
            enum: ['document', 'action']
        },
        description: String,
        dependencies: [{type: Schema.Types.ObjectId, ref: 'Node'}],
        hints: Schema.Types.Array,
        instution: [{
                name: String,
                description: String,
                location: {
                    lat: Schema.Types.Number,
                    long: Schema.Types.Number
                }
        }]
    }
);

module.exports = mongoose.model('Node', NodeSchema);
