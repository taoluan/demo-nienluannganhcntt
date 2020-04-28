const mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
const Companies = require('../models/Companies');
module.exports.editprofile_companies = function(data,id){
        mongoose.connect(url,async function(err){
            if (err) throw err;
            if(data.uplogo){
                console.log('co up logo')
            await Companies.findByIdAndUpdate(id,{$set:
                    {   
                        image:{
                            logo:"/public/image/company/"+data.uplogo,
                        }
                    }
                })
            }
            if(data.upbg){
                console.log('co up gb')
            await Companies.findByIdAndUpdate(id,{$set:
                {       
                    image:{
                        background:"/public/image/company/"+data.upbg,
                    }
                }
                })
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