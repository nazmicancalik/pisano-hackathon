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
        hints: [{type:String,required:false}],
        instution: [{
                name: String,
                description: String,
                location: {
                    lat: Schema.Types.Number,
                    long: Schema.Types.Number
                }
        }],
        related_links: [
            {
                name: String,
                href: String
            }
        ],
        conditions: [{type: String, required: false}]
    }
);

module.exports = mongoose.model('Node', NodeSchema);
