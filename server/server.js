require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

// Front-End
app.use(express.static(path.join(__dirname, "../client")));

// Connect DB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

// app.get("/api", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));