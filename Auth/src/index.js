const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();

// Convert data to JSON
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Serve static files HTML and CSS
app.use(express.static(path.join(__dirname, "../views")));
app.use(express.static(path.join(__dirname, "../public")));

app.get("/signup", (req, res) => res.sendFile(path.join(__dirname, "../views/signup.html")));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, "../views/login.html")));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, "../views/home.html")));

// Default route
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../views/login.html")));

/*
 * Sign-up Route
 */

app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // Check if user already exists
    const existingUser = await collection.findOne({name: data.name});
    if (existingUser) {
        res.send("User already exists. Plesae choose a different username");
    } else {

        // Hash password
        const saltRounds = 10; // number of salt rounds for bcrypt (???)
        const hashedPw = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPw; // replace original pw with hashed pw

        // Add entry to database
        const userdata = await collection.insertMany(data);
        console.log(userdata);

        // Redirects to default/login page
        res.redirect("/");
    }
});

/*
 * Login Route
 */

app.post("/login", async (req, res) => {

    try {

        const check = await collection.findOne({name: req.body.username});
        if (!check) res.send("User name not found");

        const isPwMatch = await bcrypt.compare(req.body.password, check.password);

        if (isPwMatch) res.redirect("/home");
        else res.send("Incorrect password");

    } catch {
        res.send("Wrong details");
    }
})

const port = 3000;
app.listen(port, () => console.log(`Server running on port: ${port}`));