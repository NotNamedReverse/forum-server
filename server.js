const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database(':memory:');

app.use(cors({ origin: 'https://your-neocities-site.neocities.org' }));
app.use(bodyParser.json());

// Create posts table
db.serialize(() => {
    db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)");
});

// Endpoint to get all posts
app.get('/posts', (req, res) => {
    db.all("SELECT * FROM posts ORDER BY id DESC", (err, rows) => {
        res.json(rows);
    });
});

// Endpoint to add a new post
app.post('/posts', (req, res) => {
    const content = req.body.content;
    db.run("INSERT INTO posts (content) VALUES (?)", [content], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, content });
    });
});

// Start the server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
