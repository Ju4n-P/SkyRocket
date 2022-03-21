const router = require('express').Router();
const postController = require('../controllers/post.controller');
const multer = require("multer");
const upload = multer();
const {checkUser, requireAuth} = require('../middleware/auth.middleware');

router.get('/', postController.readPost);
router.post('/', upload.single("file"), postController.createPost);
router.put('/:id', requireAuth, postController.updatePost);
router.delete('/:id', requireAuth, postController.deletePost);
router.patch('/like-post/:id', requireAuth, postController.likePost);
router.patch('/unlike-post/:id', requireAuth, postController.unlikePost);

// comments
router.patch('/comment-post/:id', postController.commentPost);
router.patch('/edit-comment-post/:id', postController.editCommentPost);
router.patch('/delete-comment-post/:id', postController.deleteCommentPost);

module.exports = router;