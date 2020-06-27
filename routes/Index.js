const express =  require('express');
const router = express.Router();
const client = require('../elasticsearch/connection.js');
const url = require('url');
var formidable = require('formidable');
const models_function = require('../models_function/Companies_fmd')
const date = require('../models_function/xuly')
const models_elas = require('../models_function/model_elas')
const Infor_Companies = require('../models/Infor_Companies');
const Date = require('../models_function/xuly')
const User = require('../models_function/loadprofile');
const { model } = require('../models/Infor_Companies');
var firebase = require('firebase');
router.get('/', async (req,res)=>{
  let list_job = await models_function.listNew_Job(12);
  let countjob_skill = await models_function.countJob_inSkills(['Java','PHP','Python','JavaScript','C','Ruby']);
  let date_format = []
  let topcompany = await models_function.topCompany(5);
  list_job.forEach(element => {
    date_format.push(date.Date(element.created)) 
  })
    res.render('index',{ 
      title: 'Chào mừng đến với VietJob',  
      nameuser : req.session.usname,
      job_list: list_job,
      date_format:date_format,
      skills:countjob_skill,
      authentication:req.session.usid,
      topcpn: topcompany
    }) 
})
router.get('/vieclamit',async (req,res)=>{
    try{
    let page = parseInt(req.query.page) || 1;
    let perPage = 5;
    let start = (page-1)*perPage;
    let end = page * perPage;
    let results = await models_elas.loadjob();
    let result = results.hits;
    let date_format = []
    result.forEach(element => {
      date_format.push(date.Date(element.created)) 
    })
    let numlist = results.total.value;
    let random = await models_function.random_companies();
    let job = await models_function.random_companies_job(random[0].id,random[1].id)
    if(req.session.usid && req.session.usname){
        res.render('vieclamit', {
        title: 'Việc làm IT',
        dsjob: result.slice(start,end) ,
        namejob: '',
        where: '',
        num: numlist,
        pages: Math.ceil(numlist / perPage),
        current: page,
        nameuser : req.session.usname,
        date:date_format,
        authentication:req.session.usid,
        rd_cpn:random,
        cpn_job:job
      });
    }else res.render('vieclamit', {
      title: 'Việc làm IT',
      dsjob: result.slice(start,end) ,
      namejob: '',
      where: '',
      num: numlist,
      pages: Math.ceil(numlist / perPage),
      current: page,
      authentication:req.session.usid,
      date:date_format,
      rd_cpn:random,
      cpn_job:job
    });
  }catch (err){
    console.log(err);
  }  
})
router.get('/vieclamit/search',async (req,res)=>{
    try {
    let random = await models_function.random_companies();
    let job = await models_function.random_companies_job(random[0].id,random[1].id)
    let planets = req.query.planets;
    let city = req.query.city;
    var output ;
    let page = parseInt(req.query.page) || 1;
    let perPage = 6;
    let start = (page-1)*perPage;
    let end = page * perPage;
    let parse = url.parse(req.url, true);
    var numlist, results, where;
    var date_format = [];
    if (city === "all"){
      const searchall = await models_elas.SearchAll(planets);
      results = searchall.hits;
      results.forEach(element => {
        date_format.push(date.Date(element.created)) 
      })
     numlist = searchall.total.value;
    }else if (city === "Orthers"){
        const searchorthers =  await models_elas.SearchOrthers(planets);
        results = searchorthers.hits;
        results.forEach(element => {
        date_format.push(date.Date(element.created)) 
        })
        numlist = searchorthers.total.value;
    }else{
        const search = await models_elas.Search(planets,city)
        results = search.hits;
        results.forEach(element => {
        date_format.push(date.Date(element.created)) 
        })
        numlist = search.total.value;
        where = 'tại '+city 
    }
    res.render('vieclamit', {
      title: 'Việc làm IT',
      dsjob: results.slice(start,end),
      namejob: planets,
      where: where,
      num: numlist,
      pages: Math.ceil(numlist / perPage),
      current: page,
      nameuser : req.session.usname,
      authentication:req.session.usid,
      date:date_format,
      rd_cpn:random,
      cpn_job:job
    })
  }catch (err){
      console.log(err);
  } 
})
router.get('/vieclamit/:name&:id',async (req,res)=>{
  const name_job =req.params.name;
  const id_job=req.params.id;
  let job = await models_function.viewJob_companies(id_job);
  let InforCompanies = await models_function.loadInfor_companies(job.companies._id);
  let date_format = Date.Date(job.created);
  let Job_not = await models_function.loadjob_not1vl(job.companies._id,id_job)
  let count_job = await models_function.countJob_companies(job.companies._id)
  let profile_user = '';
  let check_join = '';
  if(req.session.usid){
     profile_user = await User.profile(req.session.usid);
     check_join = await models_function.check_join(req.session.usid,id_job)
    }
  let date_jobother = []
  Job_not.forEach(element => {
    date_jobother.push(date.Date(element.created)) 
  })
    res.render('job',{
    us_pro:profile_user,
    title: name_job,
    nameuser:req.session.usname,
    authentication:req.session.usid,
    Job:job,
    CountJob:count_job,
    Cpn_infor:InforCompanies,
    date:date_format,
    Job_other:Job_not,
    date_other:date_jobother,
    checkJoin:check_join
   })
})
router.get('/companies/:val1&:val2',async (req,res)=>{
  const name_company =req.params.val1;
  const id_company =req.params.val2;
  let check_follow ;
  let date_review = []
  let companies = await models_function.loadprofile_companies(id_company)
  let Infor_cpn = await models_function.loadInfor_companies(id_company)
  let job_cpn = await models_function.loadJob_companies(id_company)
  let load_review = await models_function.loadReview_companies(id_company)
  let getstar = await models_function.getstar_review(id_company)
  load_review.forEach(element => {
    date_review.push(date.Date(element.created)) 
  })
  if(req.session.usid){
    check_follow = await models_function.checlfollow_companies(id_company,req.session.usid)
  }
  res.render('companies',{
    title: name_company,
    authentication:req.session.usid,
    nameuser : req.session.usname,
    profiles:companies,
    Infor:Infor_cpn,
    Job:job_cpn,
    check:check_follow,
    review_load:load_review,
    date_rv:date_review,
    list_star:getstar
  }) 
})
router.get('/companies',async (req,res)=>{
    let page = parseInt(req.query.page) || 1;
    let perPage = 9;
    let start = (page-1)*perPage;
    let end = page * perPage;
    let data = await models_function.listCompanies();
    let dscompanies = data.results
    let count = data.count_num
    let numlist = dscompanies.length
   // console.log(typeof dscompanies)
     res.render('allcompanies',{
      title: "Tất cả công ty",
      dsjob: dscompanies.slice(start,end),
      nameuser : req.session.usname,
      authentication:req.session.usid,
      pages: Math.ceil(numlist / perPage),
      current: page,
      counts : count
    })
})
router.get('/top-companies/',async(req,res)=>{
  let topcompany = await models_function.topCompany_Infor(20);
  res.render('topcompanies',{
      title: "Những công ty hàng đầu",
      nameuser : req.session.usname,
      authentication:req.session.usid,
      topcpn: topcompany
    })
    
})
router.get('/vieclam-theo-kynang',(req,res)=>{
  if(req.session.usid && req.session.usname){
    res.render('./user/dsvl-kynang',{
      title : 'Việc làm theo kỹ năng',
      nameuser : req.session.usname
    })
  }else{
    res.render('./elements/dsvl-kynang',{
      title : 'Việc làm theo kỹ năng'
    })
  }
})
router.get('/vieclam-theo-ten',(req,res)=>{
  if(req.session.usid && req.session.usname){
    res.render('./user/dsvl-ten',{
      title : 'Việc làm theo ten',
      nameuser : req.session.usname
    })
  }else{
    res.render('./elements/dsvl-ten',{
      title : 'Việc làm theo ten'
    })
  }
})
router.get('/vieclam-theo-congty',(req,res)=>{
  if(req.session.usid && req.session.usname){
    res.render('./user/dsvl-congty',{
      title : 'Việc làm theo công ty',
      nameuser : req.session.usname
    })
  }else{
    res.render('./elements/dsvl-congty',{
      title : 'Việc làm theo công ty'
    })
  }
})
router.get('/profile',async (req,res)=>{
  if(req.session.usid && req.session.usname){
    try {
    let loadprofile = require('../models_function/loadprofile');
    let getpro = await loadprofile.profile(req.session.usid);
      res.render('./user/profile',{
        title : 'Thông tin tài khoản',
        nameuser : req.session.usname,
        email : getpro.email,
        fullname : getpro.fullname,
        address: getpro.address,
        upcv: getpro.upCV,
        upavt: getpro.upAvt,
        authentication:req.session.usid,
      })
    } catch (error) {
      console.log(error)
    }
    
  }else{
    res.redirect('/')
  }
})
router.get('/ungtuyen',check_Login_Us,async(req,res)=>{
  let list_job = await models_function.listUngTuyen_User(req.session.usid)
  let list_cpn = await models_function.random_companies_limit()
  let date_format = []
  list_job.forEach((element,idx) => {
      date_format.push(date.Date(element.created))
  })

  res.render('./user/ungtuyen',{
      title : 'Ứng tuyển công việc | '+req.session.usname,
      nameuser : req.session.usname,
      data: list_job,
      date:date_format,
      list_cpns:list_cpn,
      authentication:req.session.usid,
    })

})
router.get('/email',check_Login_Us,async(req,res)=>{
  let list_job = await models_function.listUngTuyen_User(req.session.usid)
  let listNew_Job = await models_function.listNew_Job(5);
  let date_format = []
  listNew_Job.forEach(element => {
      date_format.push(date.Date(element.created)) 
  })
  var config = {
    apiKey: "AIzaSyDUL1FX3aHjQdymwsrQLgT-UH5HzVJqKHI",
    authDomain: "nienluannganh-3c1c3.firebaseapp.com",
    databaseURL: "https://nienluannganh-3c1c3.firebaseio.com",
    storageBucket: "bucket.appspot.com"
  };
  if (firebase.apps.length === 0) {
    firebase.initializeApp(config);
  }
  var db = firebase.database();
  let rf = db.ref('Send_Email/'+req.session.usid);
  let count = 0
  await rf.once('value',(snap)=>{
    snap.forEach(element => {
      rf.child(element.key).update({
        "status": "Đã xem"
      })
    });
  })
  /*
  rf.orderByChild("to").equalTo(req.session.usid).once("value", function(snapshot) {
    var list_mail = [];
    snapshot.forEach(function (childSnapshot) {    
      list_mail.push(childSnapshot.val())
    });
    console.log(list_mail)
    res.render('./user/email',{
      title : 'Thông báo ',
      nameuser : req.session.usname,
      data: list_job,
      date:date_format,
      list_cpns:listNew_Job,
    }) 
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });?*/
  res.render('./user/email',{
    title : 'Thông báo ',
    nameuser : req.session.usname,
    data: list_job,
    date:date_format,
    list_cpns:listNew_Job,
    authentication:req.session.usid,
  }) 
})
function check_Login_Us(req,res,next){
  if(req.session.usid && req.session.usname){
     return next()
  }
  res.redirect('/')
}
module.exports = router;