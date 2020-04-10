var express =  require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/user',urlencodedParser,function(req,res){
    let user = req.session;
    let pws = req.session;
    user = req.body.username
    pws = req.body.password
    console.log(user,pws)
})
module.exports = router;