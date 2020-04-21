var express =  require('express');
var router = express.Router();
router.get('/user',function(req,res){
    delete req.session.usid;
    delete req.session.usname ;
    res.redirect('/')
})
module.exports = router;