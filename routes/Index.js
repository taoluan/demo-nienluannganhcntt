const express =  require('express');
const router = express.Router();
const client = require('../elasticsearch/connection.js');
const url = require('url');
router.get('/',function(req,res){
    res.render('index', { title: 'VietJob'});
})
router.get('/vieclamit',function(req,res){
    let skills = req.query.skill;
    let city = req.query.city;
    var output ;
    let page = parseInt(req.query.page) || 1;
    let perPage = 8;
    let start = (page-1)*perPage;
    let end = page * perPage;
    let parse = url.parse(req.url, true);
    let path = parse.search;
    if(path === null){
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
        res.render('vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            namejob: '',
            where: '',
            num: numlist,
            pages: Math.ceil(numlist / perPage),
            current: page
          });
        }
    });
    }else {
      if (city === "all"){
        client.search({  
          index: 'job',
          type: '_doc',
          body: {
            query: {
              multi_match : {
                query:    skills, 
                fields: [ "namejob", "skills" ] 
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
            res.render('vieclamit', {
              title: 'Việc làm IT',
              dsjob: results.slice(start,end) ,
              namejob: skills,
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
                            "query":    skills, 
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
            const results = response.hits.hits;
            const numlist =response.hits.total.value;
            res.render('vieclamit', {
              title: 'Việc làm IT',
              dsjob: results.slice(start,end) ,
              namejob: skills,
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
                            skills: skills
                        }
                      }, {
                        match: {
                          namejob: skills
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
              const results = response.hits.hits;
              const numlist =response.hits.total.value;
              res.render('vieclamit', {
                title: 'Việc làm IT',
                dsjob: results.slice(start,end) ,
                num: numlist,
                namejob: skills,
                where: city,
                pages: Math.ceil(numlist / perPage),
                current: page
              });
              }
          });
      }
    }
})
router.get('/vieclamit/:value',function(req,res){
  res.render('vieclamit', { title: 'Việc làm IT'});
})
module.exports = router;