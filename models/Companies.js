const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var CompanySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email:String,
    pws: String,
    Address: {
        linkwedsite : String,
        city : String,
        Country: String,
        address: String
    },
    title : String,
    Work:String,
    Member:{
        type:String,
        default: ''
    },
    Workday:{
        type:String,
        default: ''
    },
    image:{
        logo :  String,    
        backgrounp:String  
    },
    follow:[
        { User: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'companies'
            }
        }
    ]
});
module.exports = mongoose.model('Companies',CompanySchema)