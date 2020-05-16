var  mongoose = require('mongoose')
var  Schema = mongoose.Schema;

var JobSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    companies: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Companies'
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
    descript: String,
    requirements:{
        mandatory: String,
        others: String
    },
    join:[
        { 
        id_user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'user'
            },
        status:{
            type : String,
            default: 'Đợi duyệt'
            }
        }
    ],
    status: {
        type : String,
        default: 'Đang tuyển'
    }
})
module.exports = mongoose.model('Job',JobSchema)