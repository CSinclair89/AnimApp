const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createPost, getPosts } = require("../controllers/postsController");

router.post("/create", auth, createPost);
router.get("/feed", getPosts);

module.exports = router;