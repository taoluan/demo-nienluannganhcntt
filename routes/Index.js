const express =  require('express');
const router = express.Router();
const client = require('../elasticsearch/connection.js');
const url = require('url');
var formidable = require('formidable');
const models_function = require('../models_function/Companies_fmd')
const date = require('../models_function/xuly')
const models_elas = require('../models_function/model_elas')
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
router.get('/vieclamit',async function(req,res){
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
    console.log(job)
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
        authentication:req.session.usid
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
    });
  }catch (err){
    console.log(err);
  }  
})
router.get('/vieclamit/search',async function(req,res){
    try {
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
      const searchall = await SearchAll(planets);
      const results = searchall.hits;
      const numlist = searchall.total.value;
    if(req.session.usid && req.session.usname){
      res.render('./user/vieclamit', {
        title: 'Việc làm IT',
        dsjob: results.slice(start,end) ,
        namejob: planets,
        where: '',
        num: numlist,
        pages: Math.ceil(numlist / perPage),
        current: page,
        nameuser : req.session.usname
      })
    }else{
      res.render('vieclamit', {
        title: 'Việc làm IT',
        dsjob: results.slice(start,end) ,
        namejob: planets,
        where: '',
        num: numlist,
        pages: Math.ceil(numlist / perPage),
        current: page
      })
    }
    }else if (city === "Orthers"){
        const searchorthers =  await SearchOrthers(planets);
        results = searchorthers.hits;
        numlist = searchorthers.total.value;
        if(req.session.usid && req.session.usname){
          res.render('./user/vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            namejob: planets,
            where: '',
            num: numlist,
            pages: Math.ceil(numlist / perPage),
            current: page,
            nameuser : req.session.usname
          })
        }else{
          res.render('vieclamit', {
          title: 'Việc làm IT',
          dsjob: results.slice(start,end) ,
          namejob: planets,
          where: '',
          num: numlist,
          pages: Math.ceil(numlist / perPage),
          current: page
        })
      }
    }else{
        const search = await Search(planets,city)
        results = search.hits;
        numlist = search.total.value;
        if(req.session.usid && req.session.usname){
          res.render('./user/vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            num: numlist,
            namejob: planets,
            where: 'tại '+city,
            pages: Math.ceil(numlist / perPage),
            current: page,
            nameuser : req.session.usname
          });
        }else{
          res.render('vieclamit', {
          title: 'Việc làm IT',
          dsjob: results.slice(start,end) ,
          num: numlist,
          namejob: planets,
          where: 'tại '+city,
          pages: Math.ceil(numlist / perPage),
          current: page
        });}
          
    }
  }catch (err){
      console.log(err);
  } 
})
router.get('/vieclamit/:val1&:val2',function(req,res){
  const name_job =req.params.val1;
  const id_job=req.params.val2;
  if(req.session.usid && req.session.usname){
    res.render('./user/us_job',{
      title: name_job,
      nameuser : req.session.usname
     })
  }else{ 
    res.render('job',{
    title: name_job
   })
  }
 
})
router.get('/companies/:val1',function(req,res){
  const name_company =req.params.val1;
  if(req.session.usid && req.session.usname){
    res.render('./user/companies',{
      title: name_company,
      nameuser : req.session.usname
      })
  }else{
    res.render('companies',{
    title: name_company
    })
  }
  
})
router.get('/companies',function(req,res){
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
router.get('/top-companies/',function(req,res){
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
router.get('/vieclam-theo-kynang',function(req,res){
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
router.get('/vieclam-theo-ten',function(req,res){
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
router.get('/vieclam-theo-congty',function(req,res){
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
router.get('/profile',async function(req,res){
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
router.get('/ungtuyen',function(req,res){
  if(req.session.usid && req.session.usname){
    res.render('./user/ungtuyen',{
      title : 'Ứng tuyển công việc | '+req.session.usname,
      nameuser : req.session.usname
    })
  }else{
    res.redirect('/')
  }
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
function SearchAll(planets){
  return new Promise ((resolve, reject) => {
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
          return reject(error+" SearchAll")
        }
        else {
        const results = response.hits;
        resolve(results)
          }
    });
  })
}
function SearchOrthers(planets){
  return new Promise ((resolve,reject)=> {
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
          reject(error+" SearchOrthers ")
        }
        else {
        const results = response.hits;
        resolve(results)
        }
    });
  })
}
function Search(planets,city){
  return new Promise((resolve,reject)=>{
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
          reject(error+" Search ")
        }
        else {
        const results = response.hits
        resolve(results)
        }
    });
  })
}

module.exports = router;