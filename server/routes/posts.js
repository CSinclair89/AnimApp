const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createPost, getPosts, likePost, unlikePost, deletePost } = require("../controllers/postsController");

router.get("/feed", getPosts);
router.post("/create", auth, createPost);
router.delete("/:id", auth, deletePost);
router.post("/:id/like", auth, likePost);
router.post("/:id/unlike", auth, unlikePost);


module.exports = router;