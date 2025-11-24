require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Connect DB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));