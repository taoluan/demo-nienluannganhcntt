var express =  require('express');
var router = express.Router();
var client = require('../elasticsearch/connection.js');
var url = require('url');
router.get('/',function(req,res){
    res.render('index', { title: 'VietJob'});
})
router.get('/vieclamit',function(req,res){
    var output ;
    var parse = url.parse(req.url, true);
    var path = parse.path;
    var page = parseInt(req.query.page) || 1;
    var perPage = 1;
    var start = (page-1)*perPage;
    var end = page * perPage;
    client.search({  
      index: 'job',
      type: '_doc',
      body: {
        query: {
          match_all: {
          }
        }
      }
    },function (error, response,status) {
        if (error){
          console.log("search error: "+error)
        }
        else {
        const results = response.hits.hits;
        const numlist =response.hits.total.value;
        var my_Arr;
        const mang = [];
        results.forEach(function(result){
          my_Arr =((result._source.skills).split(",").concat(result._source.namejob)); 
            for(let i = 0; i < my_Arr.length; i++) {
              if(my_Arr[i] === ' ' || my_Arr[i] === 'English' || my_Arr[i] === ' English'){
                
              } else{
                  mang.push(my_Arr[i].trim())
              }
            }
          });
          output = [...new Set(mang)];
          res.render('vieclamit', {
            title: 'Việc làm IT',
            kq: output ,
            dsjob: results.slice(start,end) ,
            num: numlist,
            pages: Math.ceil(numlist / perPage),
            current: page
          });
        }
    });
})
router.get('/vieclamit/:value',function(req,res){
  res.render('vieclamit', { title: 'Việc làm IT'});
})
module.exports = router;