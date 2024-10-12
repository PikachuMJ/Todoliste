const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'your_database_name',
    password: 'gruen2007',
    port: 5432,
});

client.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error', err.stack));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const bcrypt = require('bcrypt');
const saltRounds = 10;

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const query = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    try {
        await client.query(query, [username, hashedPassword]);
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).send('Error registering user');
    }
});

// User Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = $1';
    try {
        const result = await client.query(query, [username]);
        const user = result.rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user.id;
            res.send('Login successful');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error logging in', error);
        res.status(500).send('Error logging in');
    }
});
app.post('/todos', async (req, res) => {
    const { todo_text } = req.body;
    const query = 'INSERT INTO todos (user_id, todo_text) VALUES ($1, $2)';
    try {
        await client.query(query, [req.session.userId, todo_text]);
        res.status(201).send('Todo added successfully');
    } catch (error) {
        console.error('Error adding todo', error);
        res.status(500).send('Error adding todo');
    }
});

app.get('/todos', async (req, res) => {
    const query = 'SELECT * FROM todos WHERE user_id = $1';
    try {
        const result = await client.query(query, [req.session.userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching todos', error);
        res.status(500).send('Error fetching todos');
    }
});
