const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    
    try {
        const { imageUrl, description, tags } = req.body;

        const post = await Post.create({
            author: req.userId,
            imageUrl,
            description,
            tags: tags || []
        });

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating post "});
    }
};

exports.getPosts = async (req, res) => {
    const posts = await Post.find().populate("author", "name avatar");
    res.json(posts);
};