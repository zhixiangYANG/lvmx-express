const mongoose = require("../config/db");

const schema = new mongoose.Schema({
    //数据表结构
    title : String,
    content : String,
},{
    //这个选项可以让每篇文章都会自动携带有创建时间喝更新时间两个字段
    timestamps:true
});

const model = mongoose.model("post",schema);


module.exports = model;