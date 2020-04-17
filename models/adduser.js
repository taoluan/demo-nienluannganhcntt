var  mongoose = require('mongoose')
var  Schema = mongoose.Schema;

var addUserSchema = new Schema ({
    _id: mongoose.Schema.Types.ObjectId,
    username:{
        type:String,
        required : true
    },
    password:{
        type:String,
        required : true
    },
    email:{
        type: String,
    },
    
    name:{type : String}
})
module.exports = mongoose.model('addUser',addUserSchema)