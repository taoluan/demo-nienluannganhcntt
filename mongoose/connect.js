var mongoose = require('mongoose');
const url = 'mongodb://localhost/Nienluannganh';
mongoose.connect(url, {useNewUrlParser: true});
var db = mongoose.connection;
var addcompany = require('../models/companymodel')
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function(){
    const newcompany =new addcompany({
        _id: new mongoose.Types.ObjectId(),
        name:'cong ty tao luan',
        email:"tvluan@gmail.com",
        address: ["ap bung buoi"],
        Work: "Thu 2 - Thu 6",
        Member: "1000",
        Country:"vn",
        Workday:"thu 2 - thu 6",
        image: {
            logo :"1",
            background:"2"
        },
        RankPoint:5,
    });
    newcompany.save(function(err){
        if(err) console.log(err);
        console.log('add company successfully saved.');
    })
})