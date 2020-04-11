var express =  require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

router.get('/',function(req,res){
    res.render('./user/user',{ title: 'Chào mừng đến với VietJob', name: 'luan'})
})
module.exports = router;