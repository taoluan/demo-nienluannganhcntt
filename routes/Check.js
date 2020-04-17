var express =  require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const User = require('../models/adduser')
router.post('/signup',urlencodedParser,function(req,res){
    let checkusn = req.body.name;
    mongoose.connect(url,async function(err){
        if (err) throw err;
        const userFind = await User.findOne({username: checkusn});
        if(userFind === null){
            res.send('0')
        }else res.send('1')
    })
})
module.exports = router;