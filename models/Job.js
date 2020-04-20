var  mongoose = require('mongoose')
var  Schema = mongoose.Schema;

var JobSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    companies: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'companies'
     },
    salary: {
        money : String,
        unit : String,
    },
    skills: [String],
    address: String,
    created: { 
        type: Date,
        default: Date.now
    },
    description: String,
    requirements:{
        skill: String,
        additional: String
    },
    join:[
        { User: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'companies'
         },
            UpCV: String
        }
    ]
})
module.exports = mongoose.model('Job',JobSchema)