var express =  require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const Companies = require('../models/Companies');
const mongoose = require('mongoose');
const Infor_Companies = require('../models/Infor_Companies');
var client = require('../elasticsearch/connection');
const url = 'mongodb://localhost/Nienluannganh';
var formidable = require('formidable');
var fs = require('fs');
var addcompanies_elas= require('../models_function/model_elas');
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
               console.log(newCompany._id) 
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
router.get('/home',checklogin,function(req,res){
       res.render('./admin/home', {
           title: 'Nhà tuyển dụng',
           name: req.session.adname,
           id: req.session.adid
       }) 
})
router.get('/page-ad',function(req,res){
    if(req.session.adid && req.session.adname){
        res.render('./admin/page', {
            title: 'Nhà tuyển dụng',
            name: req.session.adname,
            id: req.session.adid
        }) 
     }else res.redirect('/admin/registration')
})
router.post('/edit',function(req,res){
    if(req.session.adid && req.session.adname){
        mongoose.connect(url,async function(err){
            const CompaniesFind =await Companies.findById(req.session.adid);
            const CompaniesInforFind =await Infor_Companies.findOne({companies:req.session.adid});
            res.render('./xuly/edit_pageadmin', {
                data: CompaniesFind,
                info: CompaniesInforFind
            }) 
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
            Info_new .save(function(err){
                if (err) throw err;
                res.redirect('/admin/page-ad')
              })
        })
    })
    }else res.redirect('/admin/registration')
})
router.post('/edit_profile',checklogin,function(req,res){
        const edit_profile = require('../models_function/Companies_fmd');
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
            await edit_profile.editprofile_companies(companies_Edit,req.session.adid)
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