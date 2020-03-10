var express =  require('express');
var router = express.Router();

router.get('/:id',function(req,res){
    var i = req.params.id;
    res.send('<h1> Admin ID: </h1>'+i);
})
module.exports = router;