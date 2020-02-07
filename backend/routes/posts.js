const express = require('express');
const multer = require('multer');
const Post = require('../models/post');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
  }
});

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then((createdPost) => {
    console.log(createdPost);
    res.status(201).json({
      message: 'Post Added Successfully',
      postId: createdPost._id
  });

  });
});

router.get("", (req, res, next) => {
  Post.find().then((documents) => {
      console.log(documents);
      res.status(200).json({
        message: 'POST fetch successfully',
        posts: documents
      });

    })
    .catch(() => {

    });
});

router.delete("/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post deleted"
  });
  })
  .catch(() => {

  });

});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    // console.log(result);
    res.status(200).json({
      message: "Successfully updated!"
    })
  })
  .catch(() => {

  });
});

router.get('/:id', (req, res, next) => {
    Post.findById(req.params.id).then((post) => {
        if (post) {
            res.status(200).json(post);
        } else {
          res.status(404).json({
            message: "Not Found"
          });
        }
    });
});

module.exports = router;
