const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// This line allows the server to find your index.html in the root folder
app.use(express.static(path.join(__dirname, '.')));

// DIAGNOSTIC TEST: Go to your-url.onrender.com/test to see if this works
app.get('/test', (req, res) => {
    res.send('The Vox Talk Server is AWAKE and listening!');
});

// The "Axon" - The bridge to OpenAI
app.post('/api/chat', async (req, res) => {
    console.log("Brain received a request:", req.body.prompt);
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.prompt }]
        }, {
            // This pulls the hidden key you saved in Render's Environment tab
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        console.error("OpenAI Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "The Brain connection to OpenAI failed." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vox Talk active on port ${PORT}`);
});
