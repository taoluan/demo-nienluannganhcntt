const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var CompanySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email:String,
    address: {
        city : String,
        Country: String
    },
    title : String,
    Work:String,
    Member:String,
    Country:String,
    Workday:String,
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