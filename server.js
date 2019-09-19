const express = require('express');
const cookieParser = require('cookie-parser');
const session = require("express-session");

const userRouter = require('./routers/user');
const postRouter = require('./routers/post');

const app = express();


//模板引擎
app.set('views','views');
app.set('view engine','ejs');

//session处理
app.use(session({
    secret: "hello",
    resave: true,
    saveUninitialized: false,
    cookie:{
        maxAge:1000 * 60 * 60 *2
    }
 })
);


//处理静态资源托管
app.use(express.static('public'));

//处理req.body
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//处理req.cookies
app.use(cookieParser());

//处理路由中间件
app.use('/users',userRouter);
app.use('/posts',postRouter);
 

app.listen(3000);

