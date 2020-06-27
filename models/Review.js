var  mongoose = require('mongoose')
var  Schema = mongoose.Schema;

var ReviewSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    comment: String,
    companies: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'companies'
     },
    User: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
     },
    numofStart: Number,
    vote : Number,
    created: { 
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Review',ReviewSchema)