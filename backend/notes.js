const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "visioned"
});

db.connect(err => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log("Connected to MySQL");
    }
});

// Fetch Notes
app.get("/notes/:student_id", (req, res) => {
    const studentId = req.params.student_id;
    db.query("SELECT * FROM Notes WHERE student_id = ?", [studentId], (err, results) => {
        if (err) res.status(500).json({ error: err });
        else res.json(results);
    });
});

// Add a Note
app.post("/notes", (req, res) => {
    const { student_id, title, content } = req.body;
    db.query("INSERT INTO Notes (student_id, title, content) VALUES (?, ?, ?)", 
    [student_id, title, content], (err, result) => {
        if (err) res.status(500).json({ error: err });
        else res.json({ success: true, id: result.insertId });
    });
});

// Delete a Note
app.delete("/notes/:id", (req, res) => {
    const noteId = req.params.id;
    db.query("DELETE FROM Notes WHERE id = ?", [noteId], (err, result) => {
        if (err) res.status(500).json({ error: err });
        else res.json({ success: true });
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));
