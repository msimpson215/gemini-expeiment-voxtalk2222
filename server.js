const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Serve your index.html file
app.use(express.static(path.join(__dirname, '.')));

// The "Axon" - This endpoint talks to the AI
app.post('/api/chat', async (req, res) => {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: req.body.prompt }]
        }, {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Brain connection failed" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vox Talk Brain active on port ${PORT}`);
});
