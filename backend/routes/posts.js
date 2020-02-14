const express = require('express');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const router = express.Router();
const PostController = require('../controllers/post');

router.post("", checkAuth, extractFile, PostController.createPost);
router.get("", PostController.getPosts);
router.delete("/:id", checkAuth, PostController.deletePost);
router.put("/:id", checkAuth, extractFile, PostController.updatePost);
router.get('/:id', PostController.getPost);

module.exports = router;
