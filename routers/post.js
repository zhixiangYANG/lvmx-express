const express = require("express");
const PostModel = require("../models/post");
const router = express.Router();

//文章列表
router.get("/", async (req, res) => {
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
  res.render("posts/index", {
    list,
    total,
    pageNum
  });
});

//新增文章
router.get("/create", (req, res) => {
  res.render("posts/create");
});

//文章详情页
router.get("/:id", async (req, res) => {
  //1.获取文章的ID
  let id = req.params.id;

  //2.根据这个ID去数据库中查找文章
  let data = await PostModel.findById(id);

  //3.渲染页面
  res.render("posts/show", {
    postInfo: data
  });
});

//新增文章页面
router.post("/store", async (req, res) => {
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
  res.redirect("/posts");
});

//编辑文章页面
router.get("/:id/edit", async (req, res) => {
  //1.根据文章ID获取信息
  let id = req.params.id;
  let post = await PostModel.findById(id);
  res.render("posts/edit", {
    id: post._id,
    title: post.title,
    content: post.content
  });
});

//编辑文章操作
router.post("/update", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  await PostModel.deleteOne({ _id: id });
  res.send({
    code: 0,
    msg: "删除成功"
  });
});

module.exports = router;