var express =  require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const Companies = require('../models/Companies');
const Infor_Companies = require('../models/Infor_Companies');
const PostJob = require('../models/Job');
const PostJob_Elas = require('../models_function/model_elas')
const mongoose = require('mongoose');
var client = require('../elasticsearch/connection');
const url = 'mongodb://localhost/Nienluannganh';
var formidable = require('formidable');
var fs = require('fs');
const Companies_fmd = require('../models_function/Companies_fmd');
var form = new formidable.IncomingForm();
form.uploadDir = "public/image/company/";
router.get('/registration',function(req,res){
    if(req.session.adid && req.session.adname){
        res.redirect('/admin/home')
    }else{
        res.render('./admin/registration')
    }
   
})
router.post('/signup',function(req,res){
    form.uploadDir="/public/image/"
    form.parse(req, function (err, fields, file) {
        if(err) throw err;
        let cpnname = fields.namecpn;
        let link = fields.link;
        let title = fields.title;
        let address = fields.address;
        let country = fields.country;
        let city = fields.city;
        let work = fields.work;
        let email = fields.email;
        let password = fields.password;
        let uplogo = file.uplogo.name;
        let newpath = form.uploadDir + uplogo; 
        let oldpath  = file.uplogo.path;
        mongoose.connect(url,async function(){
            if (err) throw err;
            let newCompany = await new Companies({
                _id: new mongoose.Types.ObjectId(),
                name:cpnname,
                email:email,
                pws:password,
                Address:{
                    linkwedsite:link,
                    city:city,
                    country:country,
                    address:address
                },
                title:title,
                work:work,
                image:{
                    logo:newpath
                }
            });
            newCompany.save(async function(err){
                if(err) throw err;
                await client.index({
                    index: 'companies',
                    id: newCompany._id.toString(),
                    type: '_doc',
                    body:{
                        name:cpnname,
                        email:email,
                        address:{
                            linkwedsite:link,
                            city:city,
                            country:country,
                            address:address
                        },
                        title:title,
                        work:work,
                        image:{
                            logo:newpath
                        }
                    }
                },function(err,req,status){
                    if(err) console.log(err);
                })
                fs.rename(oldpath,newpath, function (err) {
                    if (err) throw err;
                });
            })
        })
    })
    return res.redirect('/admin/registration');
})
router.post('/signin',urlencodedParser,function(req,res){
    let email = req.body.emailad;
    let pws = req.body.passwdad;
    mongoose.connect(url,async function(err){
        const companiesFind =await Companies.findOne({email:email,pws:pws})
        if(email && pws){
            req.session.adid = companiesFind._id;
            req.session.adname = companiesFind.name;
            res.redirect('/admin/home')
        }else res.redirect('/admin/registration')
    })
})
router.get('/home',checklogin,async function(req,res){
    let load_profile = await Companies_fmd.loadprofile_companies(req.session.adid)
       res.render('./admin/home', {
           title: 'Nhà tuyển dụng',
           profiles:load_profile
       }) 
})
router.get('/page-ad',async function(req,res){
    if(req.session.adid && req.session.adname){
        let load_profile = await Companies_fmd.loadprofile_companies(req.session.adid)
        let load_Infor = await Companies_fmd.loadInfor_companies(req.session.adid)
        res.render('./admin/page', {
            title: 'Nhà tuyển dụng',
            profiles: load_profile,
            Infor: load_Infor,
        }) 
     }else res.redirect('/admin/registration')
})
router.post('/edit',function(req,res){
    if(req.session.adid && req.session.adname){
        mongoose.connect(url,async function(err){
            const CompaniesFind =await Companies.findById(req.session.adid);
            const CompaniesInforFind =await Infor_Companies.findOne({companies:req.session.adid});
                if(CompaniesInforFind === null){
                    res.render('./xuly/createpage_admin', {
                    data: CompaniesFind,
                    }) 
                }else{
                    res.render('./xuly/editpage_admin', {
                    data: CompaniesFind,
                    info: CompaniesInforFind
                    }) 
                }
                
        })
        
     }else res.redirect('/admin/registration')
})
router.post('/introcpn',function(req,res){
    if(req.session.adid && req.session.adname){
    files = [],
    fields = [];
    let images = [];
    form.uploadDir = "public/image/company/";
    form.on('field', function(field, value) {
        fields.push([field, value]);
    })
    form.on('file', function(field, file) {
        fs.rename(file.path,form.uploadDir+file.name, function (err) {
            if (err) throw err;
        });
        files.push([field, file]);
        images.push("/public/image/company/"+file.name)
    })
    form.on('end', function() {
    });
    form.parse(req, function (err, fields, file) {
        let intro = fields.intro;
        let os_skills = fields.skills.split(',');
        let os_intro = fields.os_intro;
        let choose_us_reasons = fields.reasons;
        let choose_us_others = fields.others;
        let benefits_environ = fields.environment;
        let benefits_bonus = fields.bonus;
        let idcpn = req.session.adid;
        mongoose.connect(url,async function(err){
            let Info_new = await new Infor_Companies({
                _id: new mongoose.Types.ObjectId(),
                intro: intro,
                companies:idcpn,
                os:{
                    skills: os_skills,
                    os_intro: os_intro
                },
                choose_us: {
                    reason : choose_us_reasons,
                    image: images,
                    others:choose_us_others
                },
                Benefits : {
                    work_environment: benefits_environ,
                    bonus : benefits_bonus
                }
            })
            Info_new.save(async function(err){
                if (err) throw err;
                await Companies.update({_id:Info_new.companies},{$set:{'status':"active"}})
                res.redirect('/admin/page-ad')
              })
        })
    })
    }else res.redirect('/admin/registration')
})
router.post('/edit_profile',checklogin,function(req,res){
        form.parse(req,async function(error,fields,file){
            let companies_Edit = await {
             link : fields.link,
             title : fields.title,
             address : fields.address,
             country : fields.country,
             city : fields.city,
             work : fields.work,
             workday : fields.workday,
             member : fields.member,
             uplogo : file.uplogo.name,
             upbg : file.upbg.name,
            };
            await Companies_fmd.editprofile_companies(companies_Edit,req.session.adid)
            if(companies_Edit.uplogo){
             let newpath_uplogo =  form.uploadDir + file.uplogo.name;
             let oldpath_uplogo  = file.uplogo.path;
                fs.rename(oldpath_uplogo,newpath_uplogo, function (err) {
                if (err) console.log(err);
                });
            }
            if(companies_Edit.upbg){
                let newpath_upbg =  form.uploadDir + file.upbg.name;
                let oldpath_upbg  = file.upbg.path;
                fs.rename(oldpath_upbg,newpath_upbg, function (err) {
                if (err) console.log(err) ;
                });
            }
            res.redirect('/admin/home#') 
        })
})
router.post('/post-job',checklogin,async function(req,res){
    let load_profile = await Companies_fmd.loadprofile_companies(req.session.adid)
    res.render('./admin/post-job',{
        logo : load_profile.image.logo,
        companies: load_profile.name,
    })
})
router.post('/edit_post_job',checklogin,async function(req,res){
    form.parse(req,async function(error,fields,file){
            title = fields.job_name;
            address = fields.job_address,
            money = fields.job_salary,
            unit = fields.unit,
            skills = fields.skills.split(','),
            descript = fields.descript,
            logo = fields.logo,
            req_skill = fields.req_skill,
            req_additional = fields.req_additional,
            mongoose.connect(url,async function(err){
            let Post_Job = await new PostJob({
                _id: new mongoose.Types.ObjectId(),
                title:title,
                companies:req.session.adid,
                salary:{
                    money : money,
                    unit : unit,
                },
                skills:skills,
                address:address,
                descript:descript,
                requirements:{
                    skill:req_skill,
                    additional:req_additional
                },
            })
            Post_Job.save(async function(err){
                if(err) throw err;
                let post_elas = await PostJob_Elas.postjob(Post_Job,logo)
            })
        })
        res.redirect('/admin/home') 
    })
})
router.post('/list-job',checklogin,async function(req,res){
    let load_list_job = await Companies_fmd.loadJob_companies(req.session.adid);
    res.render('./admin/list-job',{
        list_job:load_list_job,
    })
})
function checklogin(req,res,next){
    if(req.session.adid && req.session.adname){
       return next()
    }
    res.redirect('/admin/registration')
}
function checklogout(req,res,next){
    if(req.session.adid && req.session.adname){
        res.redirect('/admin/registration')
    }
    next()
}
module.exports = router;