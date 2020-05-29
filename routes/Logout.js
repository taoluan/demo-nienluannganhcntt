var express =  require('express');
var router = express.Router();
router.get('/user/:id',function(req,res){
    url=req.params.id;
    delete req.session.usid;
    delete req.session.usname ;
    res.redirect('/'+url)
})
router.get('/admin',function(req,res){
    delete req.session.adid;
    delete req.session.adname;
    res.redirect('/admin/registration')
})
module.exports = router;