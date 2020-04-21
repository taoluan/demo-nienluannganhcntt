const User = require('../models/User');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';

module.exports.profile = function (id){
    return new Promise((resolve,reject)=>{
      mongoose.connect(url,function(err){
        if(err) throw reject(err);
       let profile =  User.findById(id)
        resolve(profile)
      })
    })
  }