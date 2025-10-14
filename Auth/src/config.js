const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Check DB Connection
connect
.then(() => console.log("Database connected successfully"))
.catch(() => console.log("Database connection failed", err));

// Create schema
const LoginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Collection part/ Create a model
const collection = new mongoose.model("users", LoginSchema);

module.exports = collection;