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
const category = [];


category.push({ id: 0, name: '', content: {} })

// Läs alla items
app.get('/items', (req, res) => {
    res.json(items);
});


app.get('/category', (req, res) => {
    res.json(category)
})

app.post('/category', (req, res) => {
    category.push({
        id: category.length,
        name: req.body.name,
        content: {}
    });
    res.status(201).json(category);
});



// Lägg till nytt item
app.post('/items', (req, res) => {
    const item = {
        id: items.length + 1,
        category: req.body.category,
        content: req.body.content,
        description: "",
        completed: false,
        indispose: false
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

    item.category = req.body.category || ''
    item.content = req.body.content || ''
    item.completed = req.body.completed || ''
    res.json(item);
});

// Ta bort ett enskilt item
app.delete('/items/:id', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ message: 'Cannot find item' });
    item.indispose = true
    res.json(item);
});

// Starta servern
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
