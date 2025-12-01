const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { createPost, getPosts } = require("../controllers/postsController");

router.post("/create", auth, createPost);
router.get("/feed", getPosts);

// router.get("/search", async (req, res) => {
//     try {
//         const tag = req.query.tag;
//         if (!tag) return res.status(400).json({ message: "Tag query required" });

//         const results = await Post.find({
//             tags: { $regex: tag, $options: "i" }  // case-insensitive
//         }).sort({ createdAt: -1 });

//         res.json(results);
//     } catch (err) {
//         console.error("Search error:", err);
//         res.status(500).json({ message: "Server error performing search" });
//     }
// });


module.exports = router;