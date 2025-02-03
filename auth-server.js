const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key'; // Byt ut detta till en mer säker nyckel

// Middleware
app.use(cors());
app.use(express.json());

// Statisk middleware för att servera index.html från root-mappen
app.use(express.static(path.join(__dirname)));

const items = [];
const categories = [];
const users = [];

categories.push({ id: 0, name: '', content: {} })


// Middleware för autentisering
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

categories.push({ id: 0, name: 'NoKat', content: {} });

// Läs alla items för en specifik användare
app.get('/items', authenticateToken, (req, res) => {
    const userItems = items.filter(item => item.userId === req.user.id);
    res.json(userItems);
});

// Läs alla kategorier för en specifik användare
app.get('/categories', authenticateToken, (req, res) => {
    const userCategories = categories.filter(category => category.userId === req.user.id);
    res.json(userCategories);
});

// Lägg till en ny kategori
app.post('/categories', authenticateToken, (req, res) => {
    const newCategory = {
        id: categories.length,
        name: req.body.name,
        userId: req.user.id,
        content: {}
    };
    categories.push(newCategory);
    res.status(201).json(newCategory);
});

// Lägg till nytt item
app.post('/items', authenticateToken, (req, res) => {
    const newItem = {
        id: items.length + 1,
        category: req.body.category,
        content: req.body.content,
        description: req.body.description || "",
        completed: false,
        indispose: false,
        userId: req.user.id
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Läs ett enskilt item
app.get('/items/:id', authenticateToken, (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id) && i.userId === req.user.id);
    if (!item) return res.status(404).json({ message: 'Cannot find item' });
    res.json(item);
});

// Uppdatera ett enskilt item
app.put('/items/:id', authenticateToken, (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id) && i.userId === req.user.id);
    if (!item) return res.status(404).json({ message: 'Cannot find item' });

    item.category = req.body.category || item.category;
    item.content = req.body.content || item.content;
    item.completed = req.body.completed != null ? req.body.completed : item.completed;
    res.json(item);
});

// Ta bort ett enskilt item
app.delete('/items/:id', authenticateToken, (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id) && i.userId === req.user.id);
    if (!item) return res.status(404).json({ message: 'Cannot find item' });
    item.indispose = true;
    res.json(item);
});

// Registrera användare
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = users.find(user => user.username === username);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: users.length + 1, username, password: hashedPassword };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Logga in användare
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(user => user.username === username);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Starta servern
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
