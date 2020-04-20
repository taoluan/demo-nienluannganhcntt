const express =  require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
//mongoose.connect(url,{useNewUrlParser: true ,useUnifiedTopology: true })
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const addUser = require('../models/User')
const user_controler = require('../controllers/userctl')
router.post('/signup',urlencodedParser,function(req,res){
  try {
  mongoose.connect(url,async function(err){
    if (err) throw err;
    let user = req.body.username;
    let pws  = req.body.password;
    let email = req.body.email;
    let name = req.body.name;
    let newUser = await new addUser({
      _id: new mongoose.Types.ObjectId(),
      username :user,
      password : pws,
      email : email,
      name : name,
    });
    newUser.save(function(err){
      if (err) throw err;
      res.redirect('/')
    })
  })
  } catch (er) {
      console.log(er)
  }
})
router.post('/signin',urlencodedParser,user_controler.checklogin_user)
 // let user =req.body.username;
//  let pws = req.body.password;
 // if(req.body.username && req.body.password){
 // let check = await userCheckLogin.checklogin_user(user,pws);
 // console.log(check)
    //  req.session.user = user
    //  req.session.pws = pws
    //  res.redirect('/')
  //}
module.exports = router;