var express =  require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
router.get('/registration',function(req,res){
    res.render('./admin/registration')
})
router.post('/signup',urlencodedParser,function(req,res){
    console.log(req.body.namecpn)
})
router.post('/signin',urlencodedParser,function(req,res){

})
module.exports = router;