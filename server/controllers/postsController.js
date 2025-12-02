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

exports.likePost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Already liked
        if (post.likes.includes(userId)) return res.status(400).json({ message: "Already liked" });

        post.likes.push(userId);
        await post.save();

        res.json({ likes: post.likes.length });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error liking post" });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        post.likes = post.likes.filter(id => id.toString() !== userId);
        await post.save();

        res.json({ likes: post.likes.length });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error unliking post" });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;

        console.log("🔍 DELETE REQUEST");
        console.log("   userId:", userId);
        console.log("   postId:", postId);

        const post = await Post.findById(postId);

        console.log("   post.author:", post.author);
        console.log("   post.author typeof:", typeof post.author);

        if (!post)
            return res.status(404).json({ message: "Post not found" });

        // DO NOT CHANGE THIS YET — we want to see the logs first
        if (post.author.toString() !== userId)
            return res.status(403).json({ message: "You are not allowed to delete this post" });

        await Post.findByIdAndDelete(postId);
        return res.json({ message: "Post deleted successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error deleting post" });
    }
};


