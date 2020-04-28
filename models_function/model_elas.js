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
