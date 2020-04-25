const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var InforSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    intro: String,
    companies: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'companies'
     },
    os:{
        skills: [String],
        os_intro: String
    },
    choose_us: {
        reason : String,
        image: [String]
    },
    Benefits : {
        work_environment: String,
        bonus : String
    },
});
module.exports = mongoose.model('InforCompanies',InforSchema)