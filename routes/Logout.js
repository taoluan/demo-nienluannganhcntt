var express =  require('express');
var router = express.Router();
router.get('/user',function(req,res){
    delete req.session.user;
    delete req.session.pws ;
    res.redirect('/')
})
module.exports = router;