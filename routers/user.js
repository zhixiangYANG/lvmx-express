const express = require('express');
const UserModel = require('../models/user');
const router = express.Router();

//注册页面路由
router.get('/create',(req,res) => {
    res.render('register');
});

//注册操作路由
router.post('/store',(req,res) => {
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
    UserModel.findOne({ email:req.body.email }).then(data => {
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
    })
});

module.exports = router;