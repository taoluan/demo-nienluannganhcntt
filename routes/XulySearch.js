var express =  require('express');
var router = express.Router();
var url = require('url');
router.get('/',function(req,res){
    var parse = url.parse(req.url, true);
    var path = parse.path;
    console.log(path);
    console.log(req.query.job)
    res.send("tao met vl ");
  })
module.exports = router;