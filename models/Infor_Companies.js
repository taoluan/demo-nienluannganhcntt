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
        os_intro: {
            type:String,
            default: ''
        }
    },
    choose_us: {
        reasons : {
            type:String,
            default: ''
        },
        image: [String],
        others: {
            type:String,
            default:''
        }
    },
    Benefits : {
        work_environment: String,
        bonus : {
            type:String,
            default:''
        }
    },
});
module.exports = mongoose.model('InforCompanies',InforSchema)