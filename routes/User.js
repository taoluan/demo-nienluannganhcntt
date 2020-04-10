var express =  require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


router.post('/',urlencodedParser,function(req,res){
    var us = req.body.username;
    var ps = req.body.password;
    if(us && ps){
       res.render('./user/user',{ title: 'Chào mừng đến với VietJob', name: usn})
    }else {
        res.render('index', { title: 'VietJob'});
    }
})
router.post('/login1',urlencodedParser,function(req,res){
    var us = req.body.username;
    var ps = req.body.password;
    res.send('username: '+us+'password: '+ps);
})
module.exports = router;