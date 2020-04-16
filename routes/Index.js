const express =  require('express');
const router = express.Router();
const client = require('../elasticsearch/connection.js');
const url = require('url');
router.get('/',function(req,res){
  if(req.session.user && req.session.pws){
    res.render('./user/user',{ title: 'Chào mừng đến với VietJob', name: req.session.user}) 
  }else res.render('index', { title: 'VietJob'});
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
    if(req.session.user && req.session.pws){
        res.render('./user/vieclamit', {
        title: 'Việc làm IT',
        dsjob: result.slice(start,end) ,
        namejob: '',
        where: '',
        num: numlist,
        pages: Math.ceil(numlist / perPage),
        current: page
      });
    }else res.render('vieclamit', {
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
    if(req.session.user && req.session.pws){
      res.render('./user/vieclamit', {
        title: 'Việc làm IT',
        dsjob: results.slice(start,end) ,
        namejob: planets,
        where: '',
        num: numlist,
        pages: Math.ceil(numlist / perPage),
        current: page
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
        if(req.session.user && req.session.pws){
          res.render('./user/vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            namejob: planets,
            where: '',
            num: numlist,
            pages: Math.ceil(numlist / perPage),
            current: page
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
        if(req.session.user && req.session.pws){
          res.render('./user/vieclamit', {
            title: 'Việc làm IT',
            dsjob: results.slice(start,end) ,
            num: numlist,
            namejob: planets,
            where: 'tại '+city,
            pages: Math.ceil(numlist / perPage),
            current: page
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
  if(req.session.user && req.session.pws){
    res.render('./user/us_job',{
      title: name_job
     })
  }else{ 
    res.render('job',{
    title: name_job
   })
  }
 
})
router.get('/companies/:val1',function(req,res){
  const name_company =req.params.val1;
  if(req.session.user && req.session.pws){
    res.render('./user/companies',{
      title: name_company
      })
  }else{
    res.render('companies',{
    title: name_company
    })
  }
  
})
router.get('/companies',function(req,res){
  if(req.session.user && req.session.pws){
    res.render('./user/us_allcompanies',{
      title: "Tất cả công ty"
      })
  }else{
     res.render('allcompanies',{
    title: "Tất cả công ty"
    })
  }
 
})
router.get('/top-companies/',function(req,res){
  if(req.session.user && req.session.pws){
    res.render('./user/us_topcompanies',{
      title: "Những công ty hàng đầu"
    })
  }else{
    res.render('topcompanies',{
      title: "Những công ty hàng đầu"
    })
  }
})
router.get('/vieclam-theo-kynang',function(req,res){
  if(req.session.user && req.session.pws){
    res.render('./user/dsvl-kynang',{
      title : 'Việc làm theo kỹ năng'
    })
  }else{
    res.render('./elements/dsvl-kynang',{
      title : 'Việc làm theo kỹ năng'
    })
  }
})
router.get('/vieclam-theo-ten',function(req,res){
  if(req.session.user && req.session.pws){
    res.render('./user/dsvl-ten',{
      title : 'Việc làm theo ten'
    })
  }else{
    res.render('./elements/dsvl-ten',{
      title : 'Việc làm theo ten'
    })
  }
})
router.get('/vieclam-theo-congty',function(req,res){
  if(req.session.user && req.session.pws){
    res.render('./user/dsvl-congty',{
      title : 'Việc làm theo công ty'
    })
  }else{
    res.render('./elements/dsvl-congty',{
      title : 'Việc làm theo công ty'
    })
  }
})
router.get('/profile',function(req,res){
  if(req.session.user && req.session.pws){
    res.render('./user/profile',{
      title : 'Thông tin tài khoản'
    })
  }else{
    res.redirect('/')
  }
})
router.get('/ungtuyen',function(req,res){
  if(req.session.user && req.session.pws){
    res.render('./user/ungtuyen',{
      title : 'Ứng tuyển công việc | Tào Luân'
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