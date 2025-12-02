require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/posts");

const app = express();

// Middleware
const corsOptions = {
  origin: [
    "https://csinclair89.github.io",
    "https://csinclair89.github.io/AnimApp",
    "http://localhost:3000"
  ],
  credentials: true
};
app.use(cors(corsOptions));


app.use(express.json({ limit: "5mb" }));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../docs/index.html"));
});

// Front-End
app.use(express.static(path.join(__dirname, "../docs")));

// Connect DB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));