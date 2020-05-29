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
router.get('/', async (req,res)=>{
  let list_job = await models_function.loadJob_index();
  let countjob_skill = await models_function.countJob_inSkills(['Java','PHP','Python','JavaScript','C','Ruby']);
  let date_format = []
  list_job.forEach(element => {
    date_format.push(date.Date(element.created)) 
  })
  if(req.session.usid && req.session.usname){
    res.render('index',{ 
      title: 'Chào mừng đến với VietJob',  
      nameuser : req.session.usname,
      job_list: list_job,
      date_format:date_format,
      skills:countjob_skill,
      authentication:req.session.usid
    }) 
  }else res.render('index', { 
        title: 'VietJob' , 
        job_list: list_job,
        date_format:date_format,
        skills:countjob_skill,
        authentication:req.session.usid
      });
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
  let date_jobother = []
  Job_not.forEach(element => {
    date_jobother.push(date.Date(element.created)) 
  })
    res.render('job',{
    title: name_job,
    nameuser:req.session.usname,
    authentication:req.session.usid,
    Job:job,
    Cpn_infor:InforCompanies,
    date:date_format,
    Job_other:Job_not,
    date_other:date_jobother
   })
})
router.get('/companies/:val1&:val2',async (req,res)=>{
  const name_company =req.params.val1;
  const id_company =req.params.val2;
  let companies = await models_function.loadprofile_companies(id_company)
  let Infor_cpn = await models_function.loadInfor_companies(id_company)
  let job_cpn = await models_function.loadJob_companies(id_company)
    res.render('companies',{
    title: name_company,
    authentication:req.session.usid,
    nameuser : req.session.usname,
    profiles:companies,
    Infor:Infor_cpn,
    Job:job_cpn
    }) 
})
router.get('/companies',(req,res)=>{
  if(req.session.usid && req.session.usname){
    res.render('./user/us_allcompanies',{
      title: "Tất cả công ty",
      nameuser : req.session.usname
      })
  }else{
     res.render('allcompanies',{
    title: "Tất cả công ty"
    })
  }
 
})
router.get('/top-companies/',(req,res)=>{
  if(req.session.usid && req.session.usname){
    res.render('./user/us_topcompanies',{
      title: "Những công ty hàng đầu",
      nameuser : req.session.usname
    })
  }else{
    res.render('topcompanies',{
      title: "Những công ty hàng đầu"
    })
  }
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
        upavt: getpro.upAvt
      })
    } catch (error) {
      console.log(error)
    }
    
  }else{
    res.redirect('/')
  }
})
router.get('/ungtuyen',(req,res)=>{
  if(req.session.usid && req.session.usname){
    res.render('./user/ungtuyen',{
      title : 'Ứng tuyển công việc | '+req.session.usname,
      nameuser : req.session.usname
    })
  }else{
    res.redirect('/')
  }
})
module.exports = router;