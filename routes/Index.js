const express =  require('express');
const router = express.Router();
const client = require('../elasticsearch/connection.js');
const url = require('url');
router.get('/',function(req,res){
    res.render('index', { title: 'VietJob'});
})
router.get('/vieclamit',async function(req,res){
  try{
    let page = parseInt(req.query.page) || 1;
    let perPage = 5;
    let start = (page-1)*perPage;
    let end = page * perPage;
    let results = await loadjob();
    let result = results.hits;
    let numlist = results.total.value;
    res.render('vieclamit', {
      title: 'Việc làm IT',
      dsjob: result.slice(start,end) ,
      namejob: '',
      where: '',
      num: numlist,
      pages: Math.ceil(numlist / perPage),
      current: page
    });
  }catch (err){
    console.log(err);
  }
    
})
router.get('/vieclamit/search',function(req,res){
    let planets = req.query.planets;
    let city = req.query.city;
    var output ;
    let page = parseInt(req.query.page) || 1;
    let perPage = 6;
    let start = (page-1)*perPage;
    let end = page * perPage;
    let parse = url.parse(req.url, true);
    let path = parse.search;
    if (city === "all"){
      client.search({  
        index: 'job',
        type: '_doc',
        body: {
          query: {
            multi_match : {
              query:    planets, 
              fields: [ "namejob", "skills" ] 
            }
          }
        }
      },function (error, response,status) {
          if (error){
            console.log("search error: loi 2 "+error)
          }
          else {
          const results = response.hits.hits;
          const numlist =response.hits.total.value;
          res.render('vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            namejob: planets,
            where: '',
            num: numlist,
            pages: Math.ceil(numlist / perPage),
            current: page
          });
          }
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
                          "query":    planets, 
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
            console.log("search error: loi 3 "+error)
          }
          else {
          const results = response.hits.hits;
          const numlist =response.hits.total.value;
          res.render('vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            namejob: planets,
            where: '',
            num: numlist,
            pages: Math.ceil(numlist / perPage),
            current: page
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
                    }]
                  }
                },{
                  bool: {
                    should: [{
                        match: {
                          skills: planets
                      }
                    }, {
                      match: {
                        namejob: planets
                      }
                    }]
                  }
                }]
              }
            }
          }
        },function (error, response,status) {
            if (error){
              console.log("search error:  loi 4 "+error)
            }
            else {
            const results = response.hits.hits;
            const numlist =response.hits.total.value;
            res.render('vieclamit', {
              title: 'Việc làm IT',
              dsjob: results.slice(start,end) ,
              num: numlist,
              namejob: planets,
              where: 'tại '+city,
              pages: Math.ceil(numlist / perPage),
              current: page
            });
            }
        });
    }
})
router.get('/vieclamit/:val1&:val2',function(req,res){
  const name_job =req.params.val1;
  const id_job=req.params.val2;
  res.render('job',{
    title: name_job
  })
})
router.get('/companies/:val1',function(req,res){
  const name_company =req.params.val1;
  res.render('companies',{
    title: name_company
  })
})
router.get('/companies',function(req,res){
  res.render('allcompanies',{
    title: "Tất cả công ty"
  })
})
router.get('/top-companies/',function(req,res){
  res.render('topcompanies',{
    title: "Những công ty hàng đầu"
  })
})
router.get('/vieclam-kynang',function(req,res){
  res.render('./elements/dsvl-kynang',{
    title : 'Việc làm theo kỹ năng'
  })
})
function loadjob(){
  return new Promise((resolve, reject) => {
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
          return reject(error)
        }
        else {
        let  results = response.hits;
        resolve(results);
        }
    });
  })
}
module.exports = router;