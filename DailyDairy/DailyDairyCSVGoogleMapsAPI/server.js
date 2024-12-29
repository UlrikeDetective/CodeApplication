require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve the success.html file
app.get('/success', (req, res) => {
    res.sendFile(path.join(__dirname, 'success.html'));
});

app.get('/get-google-api-key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_API_KEY });
});

const appendToCSV = (filename, data) => {
    const dirPath = path.join(__dirname, 'data');
    const filePath = path.join(dirPath, filename);

    // Create the data directory if it does not exist
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    // Create the CSV file with headers if it does not exist
    if (!fs.existsSync(filePath)) {
        const headers = Object.keys(data).join(';') + '\n';
        fs.writeFileSync(filePath, headers, 'utf8');
    }

    // Replace empty values with "N"
    const csvData = Object.values(data).map(value => value === '' ? 'N' : value).join(';') + '\n';
    fs.appendFileSync(filePath, csvData, 'utf8');
};

app.post('/submit', (req, res) => {
    const data = req.body;

    try {
        appendToCSV('location.csv', data.location);
        appendToCSV('sport.csv', data.sport);
        appendToCSV('food.csv', data.food);
        appendToCSV('programs.csv', data.programs);
        appendToCSV('career.csv', data.career);
        appendToCSV('culture.csv', data.culture);
        appendToCSV('goodThings.csv', data.goodThings);

        res.redirect('/success');
    } catch (error) {
        res.status(500).send('Error saving data');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
