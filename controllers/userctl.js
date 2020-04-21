const User = require('../models/User');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
var formidable = require('formidable');
var fs = require('fs');

exports.checklogin_user = function (req,res){
    if(req.body.username && req.body.password){
      mongoose.connect(url,async function(err){
            if(err) throw err;
            const userFind =await User.findOne({username:req.body.username,password:req.body.password})
            if (userFind === undefined || userFind === null) {
                res.redirect('/')
            }else {
                req.session.usid = userFind._id
                req.session.usname = userFind.fullname
                res.redirect('/')
            }
        })
           
    }
}
exports.editprofile_user = async function(req,res){
    let form = new formidable.IncomingForm();
    form.uploadDir="public/image/cv/"
    let fullname = req.body.fullname;
    let email = req.body.email;
    let address = req.body.address;
    let upcv = req.body.upcv;
    let upavt = req.body.upavt;
    console.log(fullname)
    form.parse(req, function (err, fields, file) {
        //path tmp trên server
        var path = file.upcv.path;
        //thiết lập path mới cho file
        var newpath = form.uploadDir + file.upcv.name;
        fs.rename(path, newpath, function (err) {
            if (err) throw err;
            console.log('Upload Thanh cong!');
        });
        fs.rename(file.upavt.path,"public/image/"+file.upavt.name, function (err) {
            if (err) throw err;
            console.log('Upload avt Thanh cong!');
        });
    });
}