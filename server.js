const express = require("express");

const cookieParser = require("cookie-parser");

const app = express();

//中间件调用,下面的两行代码，实现了给req身上加了一个body的属性
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

//中间件调用，下面这行代码，实现了给req加上一个cookies的属性，获取cookie数据
app.use(cookieParser());

//中间件调用，静态资源托管设置
app.use(express.static("public"));

//to do 路由
app.get('/',(req,res) => {
    //req.query
    console.log(req.query);
    res.send("hello express");
});

app.post('/handleLogin',(req,res) => {
    //req.body
    console.log(req.body);
    res.send("hello req.body");
});

//cookies 相关
app.get('/setCookie',(req,res) => {
    //设置cookie
    res.cookie('username','zhangsan',{
        maxAge: 1000 * 60 * 10
    })
    res.send('cookie设置成功');
});

app.get('/getCookie',(req,res) => {
    console.log(req.cookies);
    res.send('cookie获取成功');
});

//req.params
//获取路由的动态参数
//localhost:3000/hello/apple
//localhost:3000/hello/banana
//localhost:3000/hello/orange
app.get('/hello/:id',(req,res) => {
    console.log(req.params);
    res.send("我来了");
});

//localhost:3000/world/张三/18
app.get('/world/:name/:age',(req,res) => {
    console.log(req.params);
    console.log(req.get("Accept"));
    res.send("hello");
});


//-------------------------------------------------------------------

const myHello = (type) =>{
    return (req,res,next) => {
        let abc = new Date();
        let year = abc.getFullYear();
        let month = abc.getMonth() + 1;
        let date = abc.getDate();
        if(type === 1){
            //年月日
            req.requestTime = `${year} - ${month} - ${date}`;
        } else if(type === 2){
            //年月
            req.requestTime = `${year} - ${month}`;
        } else if(type === 3){
            //年
            req.requestTime = `${year}`;
        } else{
            req.requestTime = abc.getTime();
        }
    next();  
    };
};

// app.use(myHello(1));

app.get('/test',myHello(1),(req,res) => {
    console.log(req.requestTime);
    res.send('test');
});


app.get('/test2',myHello(2),(req,res) => {
    console.log(req.requestTime);
    res.send('test2');
});



app.listen(3000);