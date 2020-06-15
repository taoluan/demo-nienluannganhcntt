const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
const Companies = require('../models/Companies');
const Infor_Companies = require('../models/Infor_Companies')
const Job = require('../models/Job')
const Us_Review = require('../models/Review')
const User_Profile =  require('../models/User');
const { countDocuments, model } = require('../models/Companies');
module.exports.editprofile_companies = (data,id)=>{
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
module.exports.loadprofile_companies = (id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let profile = Companies.findById(id);
            resolve(profile)
        })
    })
}
module.exports.loadInfor_companies = (id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let Infor = Infor_Companies.findOne({companies:id});
            resolve(Infor)
        })
    })
}
module.exports.loadJob_companies = (id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            list_job = await Job.find({companies:id}).populate('join.id_user')
            resolve(list_job)
            //list_job[0].join[0].id_user.fullname
        })
    })
}
module.exports.countJob_companies = (id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let count_job = Job.count({companies:id});
            resolve(count_job)
        })
    })
}
module.exports.countCandidate_companies = (id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let count_job = Job.countDocuments({companies:id});
            resolve(count_job)
        })
    })
}
module.exports.viewJob_companies = (id)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let list_job = Job.findById(id).populate('companies');
            resolve(list_job)
        })
    })
}
module.exports.UpdateJob_agree = (id_job,id_user)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let update = Job.updateOne({'_id':id_job,'join.id_user':id_user},{$set:{'join.$.status':'Đã được duyệt'}})
            resolve(update)
        })
    })
}
module.exports.UpdateJob_notagree = (id_job,id_user)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let update = Job.updateOne({'_id':id_job,'join.id_user':id_user},{$set:{'join.$.status':'Không được duyệt'}})
            resolve(update)
        })
    })
}
module.exports.UpdateCV_User = (id_us,cv)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,function(err){
            if(err) throw reject(err);
            let update_cv = User_Profile.findByIdAndUpdate({_id:id_us},{$set: {upCV:cv}},{new: true})
            resolve(update_cv)
        })
    })
}
module.exports.listNew_Job = (lmt)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            list_job_desc = await Job.find({status:'Đang tuyển'}).sort({'created': -1}).populate('companies').limit(lmt)
            resolve(list_job_desc)
            //list_job[0].join[0].id_user.fullname
        })
    })
}
module.exports.countJob_inSkills = (skill)=>{
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
module.exports.random_companies = ()=>{
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
module.exports.random_companies_job = (id_1,id_2)=>{
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
module.exports.loadjob_not1vl = (id_1,id_not)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let result =await Job.find({companies:id_1,status:'Đang tuyển'})
            let temp;
            result.forEach((element,index) => {
                if(element._id == id_not){
                    temp = index
                }
            });
            result.splice(temp,1)
            resolve(result)
        })
    })
}
module.exports.usereview_companies = (cmt,star,vote,id_us,id_cpn)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let created_review = new Us_Review({
                _id: new mongoose.Types.ObjectId(),
                comment:cmt,
                companies:id_cpn,
                User:id_us,
                numofStart:star,
                vote:vote,
            })
            created_review.save(async (err)=>{
                if(err) throw reject(err);
                let count_review = await Us_Review.countDocuments({companies:id_cpn});
                let count_voteNo = await Us_Review.countDocuments({companies:id_cpn,vote:0});
                let count_voteYes = await Us_Review.countDocuments({companies:id_cpn,vote:1});
                let getPoint_cpn = await  Companies.findById(id_cpn).select('point');
                let setPoint_start = (getPoint_cpn.point.point_start*(count_review-1) + created_review.numofStart)/count_review;
                setPoint_start = Math.round(setPoint_start * 10)/10
                let setPoint_vote =  Math.round((count_voteYes/count_review)*100)
                let updatePoint_cpn = await Companies.findByIdAndUpdate(id_cpn,{$set:{'point.point_start': setPoint_start,'point.point_vote':setPoint_vote}})
                resolve(updatePoint_cpn)
            })
           
        })
    })
}
module.exports.loadReview_companies = (id_cpn)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let result =await Us_Review.find({companies:id_cpn}).sort('created : -1').populate('User').limit(10)
            resolve(result)
        })
    })
}
module.exports.userfollow_companies = (id_cpn,id_us)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let result = await Companies.findOneAndUpdate({_id:id_cpn},{$push:{follow:{_id:id_us}}})
            resolve(result)
        })
    })
}
module.exports.checlfollow_companies = (id_cpn,id_us)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let result = Companies.findOne({_id:id_cpn,'follow._id':id_us})
            resolve(result)
        })
    })
}
module.exports.userUnfollow_companies = (id_cpn,id_us)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let result = await Companies.findOneAndUpdate({_id:id_cpn},{$pull:{follow:{_id:id_us}}})
            resolve(result)
        })
    })
}
module.exports.ungTuyen_job = (id,id_job)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err)
            let Join =  await Job.findByIdAndUpdate(id_job,{$push:{join:{id_user:id}}})
            resolve(Join)
        })
    })
}
module.exports.check_join = (id_us,id_job)=>{
    return new Promise((resolve,reject)=>{
        mongoose.connect(url,async function(err){
            if(err) throw reject(err);
            let result = await Job.findOne({_id:id_job,'join.id_user':id_us}).select('join')
            resolve(result)
        })
    })
}
module.exports.topCompany = (lmt)=>{
    return new Promise ((resolve,reject)=>{
        mongoose.connect(url,async (err)=>{
            if(err) throw reject(err);
            let result =await Companies.find().sort({'point.point_start':-1}).limit(lmt)
            resolve(result)
        })
    })
}
module.exports.topCompany_Infor = (lmt)=>{
    return new Promise ((resolve,reject)=>{
        mongoose.connect(url,async (err)=>{
            if(err) throw reject(err);
            let result =await Infor_Companies.find().populate('companies').sort({'point.point_start':-1}).limit(lmt)
            resolve(result)
        })
    })
}
module.exports.listCompanies = ()=>{
    return new Promise ((resolve,reject)=>{
        mongoose.connect(url,async (err)=>{
            if(err) throw reject(err);
            let result = await Companies.find()
            var obj = [];
            for(let i = 0 ; i < result.length ; i++){
                 obj.push(await Job.countDocuments({companies:result[i]._id}))
            }
            let rs = {results:result,count_num:obj}
            resolve(rs)
        })
    })
}
module.exports.selectCompanies_city = (city)=>{
    return new Promise ((res,rej)=>{
        mongoose.connect(url,async(err)=>{
            if(err) throw rej(err);
            let result;
            if(city ==="all"){
                result = await Companies.find()
            }else{
                result = await Companies.find({'Address.city':city})
            }
            var obj = [];
            for(let i = 0 ; i < result.length ; i++){
                 obj.push(await Job.countDocuments({companies:result[i]._id}))
            }
            let rs = {results:result,count_num:obj}
            res(rs)
        })
    })
}
module.exports.listUngTuyen_User = (id_us)=>{
    return new Promise((res,rej)=>{
        mongoose.connect(url,async(err)=>{
            if(err) throw rej(err)
            let result = await Job.find({'join.id_user':id_us}).populate('companies')
            res(result)
        })
    })
}
module.exports.random_companies_limit=()=>{
    return new Promise ((res,rej)=>{
        mongoose.connect(url,async(err)=>{
            if(err) throw rej(err)
            let result = await Companies.find().limit(5)
            res(result)
        })
    })
}