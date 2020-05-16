const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
const Companies = require('../models/Companies');
const Infor_Companies = require('../models/Infor_Companies')
const Job = require('../models/Job')
module.exports.editprofile_companies = function(data,id){
        mongoose.connect(url,async function(err){
            if (err) throw err;
            if(data.uplogo){
            await Companies.update({_id:id},{$set:{'image.logo':"/public/image/company/"+data.uplogo}})
            }
            if(data.upbg){
            await Companies.findByIdAndUpdate(id,{$set:{'image.background':"/public/image/company/"+data.upbg}})
            }
            await Companies.findByIdAndUpdate(id,{$set:
            {
                Address:{
                    linkwebsite:data.link,
                    city: data.city,
                    country: data.country,
                    address:data.address,
                },
                title: data.title,
                work: data.work,
                member:data.member,
                workday: data.workday,
            }
        })
           
        })
}
module.exports.loadprofile_companies = function(id){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let profile = Companies.findById(id);
            resolve(profile)
        })
    })
}
module.exports.loadInfor_companies = function(id){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let Infor = Infor_Companies.findOne({companies:id});
            resolve(Infor)
        })
    })
}
module.exports.loadJob_companies = function(id){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            list_job = await Job.find({companies:id}).populate('join.id_user')
            resolve(list_job)
            //list_job[0].join[0].id_user.fullname
        })
    })
}
module.exports.countJob_companies = function(id){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let count_job = Job.count({companies:id});
            resolve(count_job)
        })
    })
}
module.exports.countCandidate_companies = function(id){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let count_job = Job.countDocuments({companies:id});
            resolve(count_job)
        })
    })
}
module.exports.viewJob_companies = function(id){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let list_job = Job.findById(id);
            resolve(list_job)
        })
    })
}