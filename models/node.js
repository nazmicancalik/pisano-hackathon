var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NodeSchema = new Schema(
    {
        name: String,
        nodeType: {
            type: String,
            required: true, 
            enum: ['document', 'action']
        },
        description: String,
        dependencies: [{type: Schema.Types.ObjectId, ref: 'Node'}],
        hints: [{type:String,required:false}],
        institution: {
            name: String,
            description: String
        },
        relatedLinks: [
            {
                name: String,
                href: String
            }
        ]
    }
);

module.exports = mongoose.model('Node', NodeSchema);
