var express = require('express');
var app = express();
var session = require('express-session');

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
//cau hinh router
app.use('/',require('./routes/Index'));
app.use('/user',require('./routes/User'));
app.use('/admin',require('./routes/Admin'));
app.use('/XulySearch',require('./routes/XulySearch'));
app.use('/login',require('./routes/Login'));
app.use('/logout',require('./routes/Logout'));
//session


app.listen(3000,()=>{
  console.log('Server đã hoạt động')
});