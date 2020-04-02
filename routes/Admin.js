var express =  require('express');
var router = express.Router();

router.get('/registration',function(req,res){
    res.render('./admin/registration')
})
module.exports = router;