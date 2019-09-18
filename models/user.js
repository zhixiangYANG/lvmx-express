// users 表的 model 文件

//1.引入mongoose，是已经连接了mongodbd 的 mongoose

const mongoose = require("../config/db");

//2.定义好你要操作的表的数据结构 schema

const schema = new mongoose.Schema({
    //表的数据结构描述
    username: String,
    password: String,
    email: String,
});

//3.生成model

const model = mongoose.model('user',schema);

//4.暴露model

module.exports = model;


