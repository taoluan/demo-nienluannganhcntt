var express =  require('express');
var router = express.Router();
router.get('/user',function(req,res){
    let url = req.query.urlnew
    delete req.session.usid;
    delete req.session.usname;
    res.send(url)
})
router.get('/admin',function(req,res){
    delete req.session.adid;
    delete req.session.adname;
    res.redirect('/admin/registration')
})
module.exports = router;