var express =  require('express');
var router = express.Router();
var client = require('../elasticsearch/connection.js');
var url = require('url');
const Companies_fmd = require('../models_function/Companies_fmd');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var admin = require('firebase-admin');
const serviceAccount = require('../nienluannganh-3c1c3-firebase-adminsdk-a2akg-e942e3c0e4.json')
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
        console.log("search err  1 "+ err)
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
          console.log("search error: 2 "+error)
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
                }]
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
        const results = response.hits.hits;
        const numlist =response.hits.total.value;
        res.render('./xuly/search', {
          searchjob: results ,
          num: numlist ,
          name: namejob,
          where: 'tại '+city,
        });
        }
    });
  }
})
router.get('/company',function(req,res){
  var namecompany = req.query.name;
  client.search({
    index: 'company',
    type: '_doc',
    body:{
      query:{
        multi_match:{
          query : namecompany,
          fields: ["name"]
        }
      }
    }
  },function(err,response,status){
      if(err){
        console.log("search err  1 "+ err)
      }
      else{
        const numlist =response.hits.total.value;
        results = response.hits.hits;
        res.render('./xuly/searchcompany', {
        data: results 
        ,num: numlist 
        ,name: namecompany,
      });
      };
    }); 
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
        console.log("search error: 4"+error)
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
router.get('/loadcompany',function(req,res){
  client.search({  
    index: 'company',
    type: '_doc',
    body: {
      query: {
        match_all: {
        }
      }
    }
  },function (error, response,status) {
      if (error){
        console.log("search error: 4"+error)
      }
      else {
      const results = response.hits.hits;
      res.render('./xuly/loadcompany', {kq: results});
      }
  });
})
router.get('/update_job',async (req,res)=>{
  let id_job = req.query.id_job;
  let id_user = req.query.id_user;
  let update =await Companies_fmd.UpdateJob_agree(id_job,id_user)
  console.log(update)
  res.send(update)
})
router.get('/update_huy_job',async (req,res)=>{
  let id_job = req.query.id_job;
  let id_user = req.query.id_user;
  let update_huy =await Companies_fmd.UpdateJob_notagree(id_job,id_user)
  res.send(update_huy)
})
router.get('/loadChart_job',async function(req,res){
  let id_cpn = req.session.adid;
  let list_job = await Companies_fmd.loadJob_companies(id_cpn)
  let data = {
    name: [],
    count: []
  };
  list_job.forEach(element => {
    data.name.push(element.title)
    data.count.push(element.join.length)
  });
  res.send(data)
})
router.post('/send_mail',urlencodedParser,function(req,res){
 /* var config = {
    apiKey: "AIzaSyDUL1FX3aHjQdymwsrQLgT-UH5HzVJqKHI",
    authDomain: "nienluannganh-3c1c3.firebaseapp.com",
    databaseURL: "https://nienluannganh-3c1c3.firebaseio.com",
    projectId: "nienluannganh-3c1c3",
  };*/
  //firebase.initializeApp(config);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://nienluannganh-3c1c3.firebaseio.com'
  });
  // Get a reference to the database service
  let str = req.body.to;
  let message = req.body.massage;
  let job_id = req.body.id_job;
  let user_name = str.substring(0,str.indexOf('@'));
  let user_id = str.substring(str.indexOf('@')+1,str.length);
  var Ref = admin.database().ref('Send_Email');
  var newMessageRef = Ref.push();
  newMessageRef.set({
    send: job_id,
    to: user_id,
    message: message
  });
  var path = newMessageRef.toString();
  console.log(path)
  res.redirect('/admin/home')
})
module.exports = router;