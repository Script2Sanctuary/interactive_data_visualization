const express = require('express');
const path = require('path');

const app = express();

// Generate 1000 data points with x from 1 to 1000 and random y values
const data = [];
for (let i = 1; i <= 1000; i++) {
    data.push({
        x: i,
        y: Math.random() * 100 // Random y value between 0 and 100
    });
}

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// API route to get the data
app.get('/api/data', (req, res) => {
    res.json(data);
});

// Serve the index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
