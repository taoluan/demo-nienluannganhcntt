var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
//cau hinh ejs
app.set('view engine','ejs');
app.set('views','./views');
//cau hinh files public (css,js)
app.use('/public', express.static('public'));
//session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))
//
app.use(bodyParser.urlencoded({ extended: false }))
//cau hinh router
app.use('/',require('./routes/Index'));
app.use('/user',require('./routes/User'));
app.use('/admin',require('./routes/Admin'));
app.use('/Xuly',require('./routes/Xuly'));
//app.use('/login',require('./routes/Login'));
app.use('/logout',require('./routes/Logout'));
app.use('/check',require('./routes/Check'));


app.listen(3000,()=>{
  console.log('Server đã hoạt động')
});