const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Statisk middleware för att servera index.html från root-mappen
app.use(express.static(path.join(__dirname)));

const items = [];

// Läs alla items
app.get('/items', (req, res) => {
    res.json(items);
});

// Lägg till nytt item
app.post('/items', (req, res) => {
    const item = {
        id: items.length + 1,
        category: req.body.category,
        content: req.body.content,
        completed: false
    };
    items.push(item);
    res.status(201).json(item);
});

// Läs ett enskilt item
app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Cannot find item' });
    res.json(item);
});

// Uppdatera ett enskilt item
app.put('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Cannot find item' });

    if (req.body.category != null) {
        item.category = req.body.category;
    }
    if (req.body.content != null) {
        item.content = req.body.content;
    }
    if (req.body.completed != null) {
        item.completed = req.body.completed;
    }

    res.json(item);
});

// Ta bort ett enskilt item
app.delete('/items/:id', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
    if (itemIndex === -1) return res.status(404).json({ message: 'Cannot find item' });

    items.splice(itemIndex, 1);
    res.json({ message: 'Deleted Item' });
});

// Starta servern
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
