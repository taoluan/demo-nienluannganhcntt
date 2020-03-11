var express =  require('express');
var router = express.Router();
var client = require('../elasticsearch/connection.js');
var url = require('url');
router.get('/',function(req,res){
  var namejob = req.query.job;
  var results;
  client.search({
    index: 'job',
    type: '_doc',
    body:{
      query:{
        simple_query_string:{
          query: namejob,
          fields:["namejob","skills"]
        }
      }
    }
  },function(err,response,status){
      if(err){
        console.log("search err "+ err)
      }
      else{
        const numlist =response.hits.total.value;
        results = response.hits.hits;
        res.render('./xuly/xulysearch', {searchjob: results ,num: numlist ,name: namejob });
      };
    });
    
  })
module.exports = router;