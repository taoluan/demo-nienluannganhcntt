var  mongoose = require('mongoose')
var  Schema = mongoose.Schema;

var addUserSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    username :String,
    password:String,
    email: String,
    fullname: String,
    address: {
        type : String,
        default : ''
    },
    upCV: {
        type : String,
        default : ''
    },
    upAvt:{
        type : String,
        default : ''
    },

})
module.exports = mongoose.model('user',addUserSchema)