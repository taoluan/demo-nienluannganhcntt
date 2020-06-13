const User = require('../models/User');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
var formidable = require('formidable');
var fs = require('fs');

exports.checklogin_user = function (req,res){
    if(req.body.username && req.body.password){
      mongoose.connect(url,async function(err){
            if(err) throw err;
            let url = req.body.url
            const userFind =await User.findOne({username:req.body.username,password:req.body.password})
            if (userFind === undefined || userFind === null) {
                res.redirect(url)
            }else {
                req.session.usid = userFind._id
                req.session.usname = userFind.fullname
                res.redirect(url)
            }
        })
           
    }
}
exports.editprofile_user =  function(req,res){
    let form = new formidable.IncomingForm();
    form.uploadDir="public/image/cv/"
    form.parse(req, function (err, fields, file) {
        if(err) throw err;
        let email = fields.email;
        let fullname = fields.fullname;
        let address = fields.address;
        let upcv = file.upcv.name;
        let upavt = file.upavt.name;
        mongoose.connect(url,async function(err){
            await User.findByIdAndUpdate({_id:req.session.usid},{$set: {fullname:fullname, address:address, email:email}},{new: true})
        if(upcv != ''){
            var newpath = form.uploadDir + upcv; 
            var path = file.upcv.path;
            await User.findByIdAndUpdate({_id:req.session.usid},{$set: {upCV:form.uploadDir+upcv}},{new: true})
            fs.rename(path, newpath, function (err) {
            });
        }
        if(upavt != ''){
            var path_avt = file.upavt.path;
            var newpath_avt = "public/image/"+upavt;
            await User.findByIdAndUpdate({_id:req.session.usid},{$set: {upAvt:"public/image/"+upavt}},{new: true})
            fs.rename(path_avt,newpath_avt, function (err) {
            });
        }
    })
    });
    return res.redirect('/profile');
}