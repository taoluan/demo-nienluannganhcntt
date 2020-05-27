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
            let list_job = Job.findById(id).populate('companies');
            resolve(list_job)
        })
    })
}
module.exports.UpdateJob_agree = function(id_job,id_user){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let update = Job.updateOne({'_id':id_job,'join.id_user':id_user},{$set:{'join.$.status':'Đã được duyệt'}})
            resolve(update)
        })
    })
}
module.exports.UpdateJob_notagree = function(id_job,id_user){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let update = Job.updateOne({'_id':id_job,'join.id_user':id_user},{$set:{'join.$.status':'Không được duyệt'}})
            resolve(update)
        })
    })
}
module.exports.loadJob_index = function(){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            list_job_desc = await Job.find({status:'Đang tuyển'}).sort({'created': -1}).populate('companies').limit(20)
            resolve(list_job_desc)
            //list_job[0].join[0].id_user.fullname
        })
    })
}
module.exports.countJob_inSkills = function(skill){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let count_job=[];
            let count;
            for(let i = 0 ; i < skill.length ; i++){
                count = await Job.countDocuments({skills:skill[i]});
                count_job.push({skill: skill[i],count_num:count})
            }
            resolve(count_job)
        })
    })
}
module.exports.random_companies = function(){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let count = await Companies.count();
            var random =Math.floor(Math.random() * count)
            let result = await Companies.findOne().skip(random)
            let result2 = await Companies.findOne().skip(Math.floor(Math.random() * count))
            let arr_rs = [result,result2]
            resolve(arr_rs)
        })
    })
}
module.exports.random_companies_job = function(id_1,id_2){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let result = await Job.find({companies:id_1}).select('title')
            let result2 =await Job.find({companies:id_2}).select('title')
            let arr_rs = [result,result2]
            resolve(arr_rs)
        })
    })
}
module.exports.loadjob_not1vl = function(id_1,id_not){
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let result =await Job.find({companies:id_2},{ $not: { _id: id_not }})
            resolve(result)
        })
    })
}