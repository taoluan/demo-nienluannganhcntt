const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var CompanySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:String,
    email:String,
    pws:String,
    Address: {
        linkwebsite : String,
        city : String,
        country: String,
        address: String
    },
    title:String,
    work:String,
    member:{
        type:String,
        default:''
    },
    workday:{
        type:String,
        default: ''
    },
    image:{
        logo:String,
        background:String
    },
    status: {
        type: String,
        default: 'inactive'
    },
    follow:[
        {user:{
            type:mongoose.Schema.Types.ObjectId, 
            ref:'user'
            }
        }
    ]
});
module.exports = mongoose.model('Companies',CompanySchema)