var client = require('../elasticsearch/connection'); 
module.exports.addCompanies = function(data){
    client.index({
            index: 'companies',
            id: data._id,
            type: '_doc',
            body:{
                'name':data.name,
                'email':data.email,
                'address':{
                    'linkwedsite':data.Address.link,
                    'city':data.Address.city,
                    'country':data.Address.Country,
                    'address':data.Address.address
                },
                'title':data.title,
                'work':data.work,
                'image':{
                    'logo':data.image.logo
                }
            }
        },function(err,req,status){
            console.log(req);
        })   
}
module.exports.postjob = function(data,logo){
    return new Promise((resolve,reject)=>{
        client.index({
            index: 'jobs',
            id: (data._id).toString(),
            type: '_doc',
            body:{
                'title':data.title,
                'companies':data.companies,
                'salary':data.salary,
                'skills':data.skills,
                'address':address,
                'descript':data.descript,
                'logo':logo,
                'created':data.created,
                'status':data.status
            }
        },function(err,req,status){
            if(err) reject(err);
            resolve(req);
        })
    })
}
module.exports.loadjob =  function(){
    return new Promise((resolve, reject) => {
      client.search({  
        index: 'jobs',
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
module.exports.SearchAll = function(planets){
    return new Promise ((resolve, reject) => {
        client.search({  
        index: 'jobs',
        type: '_doc',
        body: {
          query: {
            multi_match : {
              query:    planets, 
              fields: [ "title", "skills" ] 
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
module.exports.SearchOrthers = function(planets){
    return new Promise ((resolve,reject)=> {
      client.search({  
        index: 'jobs',
        type: '_doc',
        body: {
          "query": {
            "bool" : {
              "must" : {
                 "multi_match" : {
                          "query":    planets, 
                          "fields": [ "title", "skills" ] 
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
module.exports.Search = function(planets,city){
    return new Promise((resolve,reject)=>{
        client.search({  
        index: 'jobs',
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
                      title: planets
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