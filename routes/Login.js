var express =  require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.post('/user',urlencodedParser,function(req,res){
    let user =req.body.username;
    let pws = req.body.password;
    if(req.body.username && req.body.password){
        req.session.user = user
        req.session.pws = pws
        console.log( req.session.user, req.session.pws)
        res.redirect('/user')
    }
   
})
module.exports = router;