const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Change if necessary
    password: "root", // Change if necessary
    database: "visioned"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to database");
});



const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// API to store project
app.post("/addProject", upload.single("file"), (req, res) => {
    const { name, description } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : "";

    if (!name || !description || !filePath) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const sql = "INSERT INTO projects (name, description, file_path) VALUES (?, ?, ?)";
    db.query(sql, [name, description, filePath], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({ message: "Project added successfully", projectId: result.insertId });
    });
});

// API to get all projects
app.get("/projects", (req, res) => {
    db.query("SELECT * FROM projects", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        res.json(results);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});