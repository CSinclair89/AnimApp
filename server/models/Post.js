const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true},
    description: { type: String, default: "" },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);