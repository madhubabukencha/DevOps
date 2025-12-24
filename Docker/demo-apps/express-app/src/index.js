// Importing required packages
const express = require('express');
const bodyParser = require('body-parser');


// Initialize app
const app = express();
const port = 3000;
const users = [];

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Get all registered users
app.get("/users", (req, res) => {
    res.json({ users })
})

// Register new user
app.post("/register", (req, res) => {
    const newUserId = req.body.userId;
    if (!newUserId) {
        return res.status(400).send("User ID is required");
    }

    if (users.includes(newUserId)) {
        return res.status(400).send("User already exists");
    }

    users.push(newUserId);
    res.status(201).send("User registered successfully");
})

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
