var  mongoose = require('mongoose')
var  Schema = mongoose.Schema;

var ReviewSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    content: String,
    companies: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'companies'
     },
     User: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'companies'
     },
    numofStart: String,
    vote : String,
    created: { 
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Job',ReviewSchema)