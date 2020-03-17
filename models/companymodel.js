const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var addCompany = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required : true
    },
    address:{
        type: Array,
        required:"",
    },
    Work:{
        type: String,
        required:""
    },
    Member:{
        type: String,
        required:""
    },
    Country:{
        type: String,
        required:""
    },
    Workday:{
        type: String,
        required:""
    },
    image:{
        logo : String,
        backgrounp: String
    },
    RankPoint: Number
});
module.exports = mongoose.model('addcompany',addCompany)