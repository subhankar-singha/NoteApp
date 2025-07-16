import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import cors from 'cors';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/notes', async (req, res) => {
    try {
        const data = await fs.readFile('notes.txt', 'utf-8');
        const lines = data.split('\n').filter(line => line.trim() !== '');

        let i = 1;
        const notes = lines.map(line => {
            try {
                const obj = JSON.parse(line);
                obj.serialNo = i++;
                return obj;
            } catch (err) {
                console.error('Skipping invalid JSON:', line);
                return null;
            }
        }).filter(note => note !== null); 

        res.status(200).json({ notes });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to read notes." });
    }
});

app.post('/note', async (req, res) => {
    const note = req.body;

    if (!note || typeof note !== 'object') {
        return res.status(400).json({ message: "Invalid note format." });
    }

    try {
        const noteString = JSON.stringify(note) + '\n';
        await fs.appendFile('notes.txt', noteString);
        res.status(201).json({ message: "Note saved successfully!" });
    } catch (err) {
        console.error("Error saving note:", err);
        res.status(500).json({ message: "Failed to save note." });
    }
});

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});
