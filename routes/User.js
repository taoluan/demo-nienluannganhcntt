const express =  require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
const conn = mongoose.connect(url, {useNewUrlParser: true})
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const addUser = require('../models/adduser')
router.post('/signup',urlencodedParser,async function(req,res){
  try {
  const conn = mongoose.connect(url, {useNewUrlParser: true})
  let user = req.body.username;
  let pws  = req.body.password;
  let email = req.body.email;
  let name = req.body.name;
    conn
  let newUser = await new addUser({
    _id: new mongoose.Types.ObjectId(),
    username :user,
    password : pws,
    email : email,
    name : name,
  })
  newUser.save();
  } catch (er) {
      console.log(er)
  }
})
router.post('/signin',urlencodedParser,function(req,res){
  let user =req.body.username;
  let pws = req.body.password;
  if(req.body.username && req.body.password){
      req.session.user = user
      req.session.pws = pws
      res.redirect('/')
  }
 
})
module.exports = router;