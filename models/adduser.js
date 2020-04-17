var  mongoose = require('mongoose')
var  Schema = mongoose.Schema;

var addUserSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    username :String,
    password:String,
    email: String,
    name: String,
    upCV: String,
    upAvt:String
})
module.exports = mongoose.model('user',addUserSchema)