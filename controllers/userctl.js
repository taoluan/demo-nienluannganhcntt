const User = require('../models/User');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';

exports.checklogin_user = function (req,res){
    if(req.body.username && req.body.password){
      mongoose.connect(url,async function(err){
            if(err) throw err;
            const userFind = await User.find({username:req.body.username,password:req.body.password})
            if (userFind === undefined || userFind.length == 0) {
                res.redirect('/')
            }else {
                req.session.user = req.body.username
                req.session.pws = req.body.password
                res.redirect('/')
            }
        })
           
    }
    
}