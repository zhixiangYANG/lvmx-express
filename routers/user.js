const express = require('express');
const UserModel = require('../models/user');
const bcryptjs = require('bcryptjs');
const router = express.Router();

//注册页面路由
router.get('/create',(req,res) => {
    res.render('register');
});

//注册操作路由
router.post('/store', async (req,res) => {
    //1.获取form表单，前端传递过来的参数
    // let username = req.boby.username;
    let username = req.body.username;
    let password = req.body.password; 
    let email = req.body.email;

    //2.对参数做一些校验
    if(!username || !password || !email){
        res.send('参数有误');
        return;
    }

    //3.保存到数据库中
   /*  UserModel.findOne({ email:req.body.email })
    .then(data => {
        // console.log(data)
        if(data){
            //邮箱已经被注册过了
            res.send('邮箱已经被注册过了');
        } else {
            let user = new UserModel(req.body);
            // console.log(user)
            user.save().then(() => {
                //成功
                res.send("注册成功");
            }).catch(error => {
                //失败
                res.send("注册失败");
            });   
        }
    }) */


    //await 方法
    let data = await UserModel.findOne({ email: req.body.email })
    if(data){
        res.send("邮箱已被注册");
    } else {
        let user = new UserModel({
            username:req.body.username,
            email:req.body.email,
            password:bcryptjs.hashSync(req.body.password)
        });
        await user.save();
        res.send("注册成功");
    }

});

//登录页面
router.get("/login",(req,res) => {
    let redirect = req.query.redirect || "/posts";
    res.render("login", {
        redirect
    });
});

//登录页面操作
router.post("/login", async (req,res) => {
    let email = req.body.email;
    let password = req.body.password;
    let redirect = req.body.redirect;

    if(!email || !password){
        res.send("参数有误");
        return;
    }

    //由于数据库的密码加密了，不要直接用两个数据去查询
    let user = await UserModel.findOne({email:email});
    if(!user){
        res.send("用户名或密码错误");
        return;
    }

    //密码校验
     let isOk = bcryptjs.compareSync(password,user.password)
    if(!isOk){
        res.send("用户名或密码错误");
        return;
    }
    //登录成功
    //给session加点内容
    req.session.user = user;
    res.redirect(redirect);
});

module.exports = router;