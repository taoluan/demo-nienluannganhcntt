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
    },
    Work:{
        type: String,
    },
    Member:{
        type: String,
    },
    Country:{
        type: String,
    },
    Workday:{
        type: String,
    },
    image:{
        logo : String,
        backgrounp: String
    },
    RankPoint: Number
});
module.exports = mongoose.model('addcompany',addCompany)