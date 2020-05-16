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
