var express =  require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/',urlencodedParser,function(req,res){
    var us = req.body.username;
    var ps = req.body.password;
    res.render('./user/user',{ title: 'Chào mừng đến với VietJob', name: us}
    )
})
router.post('/login1',urlencodedParser,function(req,res){
    var us = req.body.username;
    var ps = req.body.password;
    res.send('username: '+us+'password: '+ps);
})
module.exports = router;