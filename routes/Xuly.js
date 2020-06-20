var express =  require('express');
var router = express.Router();
var client = require('../elasticsearch/connection.js');
var url = require('url');
const Companies_fmd = require('../models_function/Companies_fmd');
const models_elas = require('../models_function/model_elas')
const date = require('../models_function/xuly')
const bodyParser = require('body-parser');
const check_Us = require('../models_function/xuly')
const urlencodedParser = bodyParser.urlencoded({ extended: false });
var admin = require('firebase-admin');
var formidable = require('formidable');
var fs = require('fs');
const serviceAccount = require('../nienluannganh-3c1c3-firebase-adminsdk-a2akg-e942e3c0e4.json')
router.get('/Search',async function(req,res){
  var namejob = req.query.job;
  var city = req.query.city;
  var output ;
  let page = parseInt(req.query.page) || 1;
  let perPage = 6;
  let start = (page-1)*perPage;
  let end = page * perPage;
  var data, numlist, results, where;
  var date_format = [];
  if(!namejob){
    data = await models_elas.loadjob();
    console.log(data)
    numlist =data.total.value;
    results = data.hits;
    results.forEach(element => {
      date_format.push(date.Date(element.created)) 
    })
  }else{
     if(city === "all"){
    data = await models_elas.SearchAll(namejob);
    numlist =data.total.value;
    results = data.hits;
    results.forEach(element => {
      date_format.push(date.Date(element.created)) 
    })
  }else if (city === "Orthers"){
    data = await models_elas.SearchOrthers(namejob);
    numlist =data.total.value;
    results = data.hits;
    results.forEach(element => {
      date_format.push(date.Date(element.created)) 
    })
  }else{
      
    numlist =data.total.value;
    results = data.hits;
    where = 'tại '+city
    results.forEach(element => {
      date_format.push(date.Date(element.created)) 
    })
  }
  }
  res.render('./xuly/search', {
    dsjob: results.slice(start,end),
    num: numlist,
    name: namejob,
    pages: Math.ceil(numlist / perPage),
    current: page,
    where: where,
    date:date_format,
    authentication:req.session.usid,
  });
})
router.get('/company',async function(req,res){
  let cityname = req.query.name;
  let data = await Companies_fmd.selectCompanies_city(cityname)
  let results = data.results
  let count = data.count_num
  let numlist = results.length
  res.render('./xuly/selectcity', {
    data: results ,
    num: numlist ,
    name:cityname,
    counts:count
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
    index: 'companies',
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
router.post('/send_mail',urlencodedParser,async function(req,res){
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
  let str = req.body.to;
  let message = req.body.massage;
  let job_id = req.body.id_job;
  let info_Job =await Companies_fmd.viewJob_companies(job_id)
  let user_name = str.substring(0,str.indexOf('@'));
  let user_id = str.substring(str.indexOf('@')+1,str.length);
  /*let Ref = admin.database().ref('Send_Email/${user_id}');
  let newMessageRef = Ref.push(); auto id*/
  let Ref = admin.database().ref('Send_Email/'+user_id)
  let newMessageRef = Ref.push();
  let utc = new Date().toJSON().slice(0,10).replace(/-/g,'-');
  let companiess_send = info_Job.companies.name
  newMessageRef.set({
    from: info_Job.companies.name,
    to: user_id,
    job: info_Job.title,
    message: message,
    created: utc,
    id_job: job_id,
    status:'Chưa xem'
  });
  //var path = newMessageRef.toString();
  //console.log(path)
  res.redirect('/admin/home')
})
router.get('/follow',check_Login_Us,async (req,res,next)=>{
   let id_cpn = req.query.id_cpn;
   let id_us = req.session.usid;
   let follow = await Companies_fmd.userfollow_companies(id_cpn,id_us)
   res.send(follow)
  })
router.get('/unfollow',check_Login_Us,async (req,res,next)=>{
  let id_cpn = req.query.id_cpn;
  let id_us = req.session.usid;
  let unfollow = await Companies_fmd.userUnfollow_companies(id_cpn,id_us)
  res.send(unfollow)
  })
router.post('/ungtuyen',check_Login_Us,async (req,res)=>{
  let form = new formidable.IncomingForm();
  form.uploadDir="public/image/cv/"
  var ungtuyen;
  form.parse(req,async function (err, fields, file) {
    if(err) throw err;
    let upcv = file.upcv.name
    let name = fields.name
    let id_job = fields.id_job
    let id_us = req.session.usid
    if(upcv){
      var newpath = form.uploadDir+upcv; 
      var path = file.upcv.path;
      await Companies_fmd.UpdateCV_User(id_us,form.uploadDir+upcv)
      fs.rename(path, newpath, function (err) {
      });
    }
    ungtuyen = await Companies_fmd.ungTuyen_job(id_us,id_job)
    res.send(ungtuyen)
  })
  //let check_cv = await Companies_fmd.checkUser_cv(id_us,id_job) 
})
router.get('/loadList_star',async(req,res)=>{
    let data =await Companies_fmd.getstar_review(req.session.adid)
    res.send(data)
} )
function test() {
  client.search({
    index: 'jobs',
    type: '_doc',
    body:{
      query:{
        simple_query_string:{
          query: namejob,
          fields:["title","skills"]
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
}
function check_Login_Us(req,res,next){
  if(req.session.usid && req.session.usname){
     return next()
  }
  res.redirect('/')
}
module.exports = router;