var express =  require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const User = require('../models/User');
const Companies = require('../models/Companies');
const Infor_Companies = require('../models/Infor_Companies');
router.post('/signup',urlencodedParser,function(req,res){
    let checkusn = req.body.name;
    mongoose.connect(url,async function(err){
        try {
            if (err) throw err;
            const userFind = await User.findOne({username: checkusn});
            if (userFind === undefined || userFind === null) {
                res.send('0')
            }else res.send('1')  
        } catch (error) {
            console.log(error)
        }
        
    })
})
router.post('/signupadmin',urlencodedParser,function(req,res){
    let checkemail = req.body.email;
    let checkname = req.body.name;
    mongoose.connect(url,async function(err){
        try {
            if (err) throw err;
            const emailFind = await  Companies.findOne({email: checkemail});
            const nameFind = await Companies.findOne({name: checkname});
            if(emailFind == null && nameFind == null){
              res.send('true');
            }else{res.send('false');} 
        } catch (error) {
            console.log(error+"err ")
        }
        
    })
})
router.post('/signinadmin',urlencodedParser,function(req,res){
    let checkemail = req.body.email;
    let checkpws = req.body.pass;
    mongoose.connect(url,async function(err){
        try {
            if (err) throw err;
            const checklogin = await Companies.findOne({email:checkemail,pws:checkpws});
            console.log(checkemail)
            if(checklogin !== null){
                res.send('true');
            }else res.send('false')
        } catch (error) {
            console.log(error);
        }
    })
})
router.post('/Default_profile',urlencodedParser,function(req,res){
    if(req.session.adid && req.session.adname){
        mongoose.connect(url,async function(err){
            if(err) throw err;
            const Default_profile = await Infor_Companies.findOne({companies:req.session.adid})
            if(Default_profile){
                res.send('true')
            }else{
               res.send('false') 
            }
            
        })
    }
})
module.exports = router;