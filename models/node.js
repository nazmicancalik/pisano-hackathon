var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NodeSchema = new Schema(
    {
        _id: Schema.Types.ObjectId,
        name: String,
        type: {
            required: true, 
            enum: ['document', 'action'],
        },
        description: {
            type: String,
            required: false
        },
        dependencies: [{type: Schema.Types.ObjectId, ref: 'Node'}],
        hints: Schema.Types.Array,
        instution: [{
                name: String,
                description: String,
                location: {
                    lat: Schema.Types.Number,
                    long: Schema.Types.Number
                }    
        }],
        
    }
);
