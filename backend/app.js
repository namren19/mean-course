const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://norman:W8O7Z9YpjjkTWYBm@cluster0-n4wgc.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
  console.log('Connected to database!');
})
.catch(() => {
  console.log('Connection Failed');

});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");  // allows any domain to access our resources
    res.setHeader("Access-Control-Allow-Headers",        //
    "Origin, X-Requested-Width, Content-Type, Accept"
    );
    res.setHeader("Access-Control-Allow-Methods", // Allow HTTP VERB methods
     "GET, POST, PATCH, DELETE, OPTIONS"
    );
    next();

  });

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });

    post.save()
    .then((createdPost) => {
      console.log(createdPost);
      res.status(201).json({
        message: 'Post Added Successfully',
        postId: createdPost._id
    });

    });

});

app.get("/api/posts", (req, res, next) => {
  Post.find()
    .then((documents) => {
      console.log(documents);
      res.status(200).json({
        message: 'POST fetch successfully',
        posts: documents
      });

    })
    .catch(() => {

    });

});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({
    _id: req.params.id
  })
  .then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted"
  });
  })
  .catch(() => {

  });

});

module.exports = app;

