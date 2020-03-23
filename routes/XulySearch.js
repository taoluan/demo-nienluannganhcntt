var express =  require('express');
var router = express.Router();
var client = require('../elasticsearch/connection.js');
var url = require('url');
router.get('/',function(req,res){
  var namejob = req.query.job;
  var city = req.query.city;
  var output ;
  let page = parseInt(req.query.page) || 1;
  let perPage = 6;
  let start = (page-1)*perPage;
  let end = page * perPage;
  var results;
  if(city === "all"){
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
        res.render('./xuly/search', {
        searchjob: results 
        ,num: numlist 
        ,name: namejob,
         where: '',
      });
      };
    }); 
  }else if (city === "Orthers"){
    client.search({  
      index: 'job',
      type: '_doc',
      body: {
        "query": {
          "bool" : {
            "must" : {
               "multi_match" : {
                        "query":    namejob, 
                        "fields": [ "namejob", "skills" ] 
                      }
            },
             "must_not" : [{
                  "match" : {  "address" : "Ho Chi Minh" }
              },
              {
                  "match" : {  "address" : "Ha Noi" }
              },{
                  "match" : {  "address" : "Can Tho" }
              }
              ]
          }
        }
      }
    },function (error, response,status) {
        if (error){
          console.log("search error: "+error)
        }
        else {
          const numlist =response.hits.total.value;
          results = response.hits.hits;
          res.render('./xuly/search', {
            searchjob: results ,
            num: numlist ,
            name: namejob,
            where: '',
          });
        }
    });
  }else{
      client.search({  
        index: 'job',
        type: '_doc',
        body: {
          query: {
            bool: {
              must: [{
                bool: {
                  must: [{
                      match: {
                        address : city
                      }
                  },]
                }
              },{
                bool: {
                  should: [{
                      match: {
                        skills: namejob
                    }
                  }, {
                    match: {
                      namejob: namejob
                    }
                  }]
                }
              }]
            }
          }
        }
      },function (error, response,status) {
          if (error){
            console.log("search error: "+error)
          }
          else {
            const numlist =response.hits.total.value;
            results = response.hits.hits;
            res.render('./xuly/search', {
              searchjob: results ,
              num: numlist ,
              name: namejob ,
              where:'tại '+city,
            });
          }
      });
  }

})
  
router.get('/loaddata',function(req,res){
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
        res.render('./xuly/loaddata', {kq: output});
      }
  });
})
module.exports = router;