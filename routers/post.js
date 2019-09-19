const express = require("express");
const moment = require("moment");
const auth = require("../middlewares/auth");
const PostModel = require("../models/post");
const router = express.Router();

//文章列表
router.get("/", auth(), async (req, res) => {
  // console.log(req.session);

  //从url地址上获取当前要的是第几页，每页要几条
  let pageNum = parseInt(req.query.pageNum) || 1;
  let pageSize = parseInt(req.query.pageSize) || 5;
  let total = 5; //总共的页数

  let count = await PostModel.find().countDocuments();
  total = Math.ceil(count / pageSize);
  //从数据库中查找文章
  let list = await PostModel.find()
    .sort({ updatedAt: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

    //list 是数据库查询出来的类数组的东西
    list = JSON.parse(JSON.stringify(list));

    //对list里面的每一项的updatedAt 做一下转换操作
    list.forEach(item => {
      let abc = new Date(item.updatedAt);
     /*  let year = abc.getUTCFullYear();
      let month = abc.getMonth() + 1;
      let date = abc.getDate();

      let h = abc.getHours();
      let m = abc.getMinutes();
      let s = abc.getSeconds(); */
      // item.updatedAt = `${year}-${month}-${date}  ${h}:${m}:${s}`;
      item.updatedAt = moment(abc).format('YYYY-MM-DD HH:mm:ss')
    });

  res.render("posts/index", {
    list,
    total,
    pageNum,
    user:req.session.user
  });
});

//新增文章
router.get("/create", auth(), (req, res) => {
  res.render("posts/create",{
    user:req.session.user
  });
});

//文章详情页
router.get("/:id", auth(), async (req, res) => {
  //1.获取文章的ID
  let id = req.params.id;

  //2.根据这个ID去数据库中查找文章
  let data = await PostModel.findById(id);

  //3.渲染页面
  res.render("posts/show", {
    postInfo: data,
    user:req.session.user
  });
});

//新增文章页面
router.post("/store", auth(), async (req, res) => {
  //1.数据的校验
  if (!req.body.title || !req.body.content) {
    res.send("参数有错误");
    return;
  }

  //2.直接存到数据库里去
  let newPost = new PostModel(req.body);
  await newPost.save();
  // res.send("发表成功");
  //成功后跳转到列表页
  res.redirect("/posts",{
    user:req.session.user
  });
});

//编辑文章页面
router.get("/:id/edit", auth(), async (req, res) => {
  //1.根据文章ID获取信息
  let id = req.params.id;
  let post = await PostModel.findById(id);
  res.render("posts/edit", {
    id: post._id,
    title: post.title,
    content: post.content,
    user:req.session.user
  });
});

//编辑文章操作
router.post("/update", auth(), async (req, res) => {
  //1.需要知道修改文章的ID
  let id = req.body.id;
  let title = req.body.title;
  let content = req.body.content;
  //2.直接做修改
  let data = await PostModel.updateOne(
    { _id: id },
    { title: title, content: content }
  );
  // console.log(data);
  res.send("修改成功");
});

//删除的接口，供前端的AJAX调用
router.delete("/:id", auth(), async (req, res) => {
  let id = req.params.id;
  await PostModel.deleteOne({ _id: id });
  res.send({
    code: 0,
    msg: "删除成功"
  });
});

module.exports = router;
