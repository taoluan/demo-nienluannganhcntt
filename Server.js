var express = require('express');
var app = express();
app.listen(3000);
//cau hinh ejs
app.set('view engine','ejs');
app.set('views','./views');
//cau hinh files public (css,js)
app.use('/public', express.static('public'));
//cau hinh router
app.use('/',require('./routes/Index'));
app.use('/user',require('./routes/User'));
app.use('/admin',require('./routes/Admin'));
app.use('/XulySearch',require('./routes/XulySearch'));
app.get('/form',function(req,res){
    res.send("hello")
})